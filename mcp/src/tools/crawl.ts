import { z } from 'zod';
import { AtlasMcpError, assertOkResponse, wrapFetchError } from '../errors';
import type {
  AtlasClientContext,
  AtlasCrawlArgs,
  AtlasCrawlPageResult,
  AtlasCrawlResult,
} from '../types';

export const crawlInputSchema = {
  url: z.string().url().describe('Starting seed URL for the crawl.'),
  max_pages: z
    .number()
    .int()
    .min(1)
    .max(50)
    .default(10)
    .describe('Maximum number of pages to discover and compile.'),
  max_depth: z
    .number()
    .int()
    .min(1)
    .max(5)
    .default(2)
    .describe('Maximum link hop depth from seed URL.'),
  include_paths: z
    .array(z.string())
    .optional()
    .describe(
      "Path glob patterns to restrict compilation (e.g. ['/docs/api/**', '/reference/**']).",
    ),
  exclude_paths: z
    .array(z.string())
    .optional()
    .describe(
      "Path glob patterns to exclude from compilation (e.g. ['/changelog/**', '/**/pricing']).",
    ),
};

export const crawlOutputSchema = {
  crawl_id: z
    .string()
    .describe(
      'Atlas job identifier for tracking crawl status and reading results via atlas://crawls/{id}.',
    ),
  root_url: z.string(),
  pages_crawled: z.number(),
  pages_failed: z.number(),
  summary_markdown: z
    .string()
    .describe('Structured Table of Contents and synopsis of crawled pages within context budget.'),
  pages: z.array(
    z.object({
      url: z.string(),
      title: z.string(),
      depth: z.number(),
      compilation_id: z.string().optional(),
      resource_uri: z.string(),
      character_count: z.number().optional(),
    }),
  ),
  duration_ms: z.number(),
};

export const crawlToolDefinition = {
  name: 'atlas_crawl',
  description:
    'Traverse and compile a bounded subsection of a website (such as an API reference or documentation folder) starting from a seed URL. Returns consolidated page summaries and navigable resource URIs.',
  inputSchema: crawlInputSchema,
  outputSchema: crawlOutputSchema,
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
    idempotentHint: true,
  },
  cacheHint: {
    ttlMs: 300000,
    cacheScope: 'private' as const,
  },
};

export type CrawlExecutor = (args: AtlasCrawlArgs) => Promise<AtlasCrawlResult>;

export function createRemoteCrawlExecutor(context: AtlasClientContext): CrawlExecutor {
  return async (args: AtlasCrawlArgs): Promise<AtlasCrawlResult> => {
    const baseUrl = (context.baseUrl ?? 'https://api.atlas-compiler.com').replace(/\/+$/, '');
    const fetchFn = context.fetch ?? fetch;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    if (context.apiKey) {
      headers.Authorization = `Bearer ${context.apiKey}`;
    }

    const payload = {
      url: args.url,
      maxPages: args.max_pages ?? 10,
      maxDepth: args.max_depth ?? 2,
      includePaths: args.include_paths,
      excludePaths: args.exclude_paths,
    };

    const startTime = Date.now();
    let response: Response;
    try {
      response = await fetchFn(`${baseUrl}/v1/crawls`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(60000),
      });
    } catch (err: unknown) {
      throw wrapFetchError(err);
    }

    await assertOkResponse(response);

    const data = (await response.json()) as {
      id?: string;
      crawlId?: string;
      rootUrl?: string;
      status?: string;
      progress?: { completedItems?: number; failedItems?: number };
      pagesCrawled?: number;
      pagesFailed?: number;
      pages?: Array<{
        url: string;
        title?: string;
        depth?: number;
        compilationId?: string;
        id?: string;
        characterCount?: number;
      }>;
      summaryMarkdown?: string;
    };

    const crawlId = data.crawlId ?? data.id ?? `crawl_${Math.random().toString(36).slice(2, 10)}`;
    const rootUrl = data.rootUrl ?? args.url;
    const rawPages = data.pages ?? [];

    const pages: AtlasCrawlPageResult[] = rawPages.map((p) => {
      const compId = p.compilationId ?? p.id;
      return {
        url: p.url,
        title: p.title ?? p.url,
        depth: p.depth ?? 1,
        compilation_id: compId,
        resource_uri: compId ? `atlas://compilations/${compId}` : `atlas://crawls/${crawlId}`,
        character_count: p.characterCount,
      };
    });

    let summaryMarkdown = data.summaryMarkdown;
    if (!summaryMarkdown) {
      if (pages.length > 0) {
        const summaryParts: string[] = [
          `### Crawl Overview for ${rootUrl}`,
          `Discovered and processed **${pages.length} pages** (max requested: ${args.max_pages ?? 10}, depth: ${args.max_depth ?? 2}).`,
          '',
          '| Page Title | Depth | Resource URI |',
          '| :--- | :---: | :--- |',
        ];

        for (const p of pages) {
          summaryParts.push(`| [${p.title}](${p.url}) | ${p.depth} | \`${p.resource_uri}\` |`);
        }
        summaryMarkdown = summaryParts.join('\n');
      } else {
        const status = data.status ?? 'queued';
        summaryMarkdown = `Crawl initiated for ${rootUrl}. Status: ${status}. Atlas Job ID: ${crawlId}. Crawl results will be available at atlas://crawls/${crawlId}.`;
      }
    }
    const durationMs = Date.now() - startTime;

    return {
      crawl_id: crawlId,
      root_url: rootUrl,
      pages_crawled: pages.length || (data.progress?.completedItems ?? data.pagesCrawled ?? 0),
      pages_failed: data.progress?.failedItems ?? data.pagesFailed ?? 0,
      summary_markdown: summaryMarkdown,
      pages,
      duration_ms: durationMs,
    };
  };
}

export function formatCrawlResult(res: AtlasCrawlResult) {
  const parts: string[] = [
    `# Atlas Crawl Completed: ${res.root_url}`,
    `*Crawl ID: ${res.crawl_id} | Pages Compiled: ${res.pages_crawled} | Duration: ${res.duration_ms}ms*`,
    '',
    res.summary_markdown,
    '',
    '---',
    '*To read any individual page from this crawl, invoke `resources/read` with the corresponding resource URI, or call `atlas_compile`.*',
  ];

  return {
    content: [
      {
        type: 'text' as const,
        text: parts.join('\n'),
      },
    ],
    structuredContent: res,
  };
}
