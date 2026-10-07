import { z } from 'zod';
import {
  AtlasMcpError,
  assertOkResponse,
  formatErrorToToolResult,
  wrapFetchError,
} from '../errors';
import type { AtlasClientContext, AtlasScrapeArgs, AtlasScrapeResult } from '../types';

export const scrapeInputSchema = {
  url: z.string().url().describe('The absolute HTTP or HTTPS URL of the web page to scrape.'),
  formats: z
    .array(z.enum(['markdown', 'links', 'text']))
    .default(['markdown'])
    .describe(
      "Content formats to include in the response. 'markdown' returns clean formatted content; 'links' includes discovered hyperlinks; 'text' returns raw stripped text.",
    ),
  max_output_chars: z
    .number()
    .int()
    .min(1000)
    .max(200000)
    .default(30000)
    .describe(
      'Maximum character budget for the returned content. If content exceeds this limit, it is cleanly truncated at paragraph boundaries with truncation notice.',
    ),
  timeout_ms: z
    .number()
    .int()
    .min(1000)
    .max(30000)
    .default(15000)
    .describe('Fetch and processing timeout in milliseconds.'),
};

export const scrapeOutputSchema = {
  url: z.string(),
  title: z.string(),
  markdown: z.string().optional(),
  text: z.string().optional(),
  links: z
    .array(
      z.object({
        url: z.string(),
        text: z.string(),
      }),
    )
    .optional(),
  stats: z.object({
    character_count: z.number(),
    word_count: z.number(),
    read_time_seconds: z.number(),
  }),
  truncated: z.boolean(),
  resource_uri: z.string().optional(),
};

export const scrapeToolDefinition = {
  name: 'atlas_scrape',
  description:
    "Quickly extract clean, readable text, markdown, and links from a web page using Atlas's fast synchronous parser. Strips cookie banners, navigation clutter, and ads. Best for articles, documentation pages, and general web reading.",
  inputSchema: scrapeInputSchema,
  outputSchema: scrapeOutputSchema,
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

export type ScrapeExecutor = (args: AtlasScrapeArgs) => Promise<AtlasScrapeResult>;

export function createRemoteScrapeExecutor(context: AtlasClientContext): ScrapeExecutor {
  return async (args: AtlasScrapeArgs): Promise<AtlasScrapeResult> => {
    const baseUrl = (context.baseUrl ?? 'https://api.atlas-compiler.com').replace(/\/+$/, '');
    const fetchFn = context.fetch ?? fetch;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    if (context.apiKey) {
      headers.Authorization = `Bearer ${context.apiKey}`;
    }

    const requestedFormats = args.formats ?? ['markdown'];
    const safeFormats = Array.from(
      new Set(requestedFormats.map((f) => (f === 'text' ? 'markdown' : f))),
    ).filter((f) => f === 'markdown' || f === 'links');

    const payload: Record<string, unknown> = {
      url: args.url,
      formats: safeFormats.length > 0 ? safeFormats : ['markdown'],
    };

    let response: Response;
    try {
      response = await fetchFn(`${baseUrl}/v1/scrape`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(args.timeout_ms ?? 15000),
      });
    } catch (err: unknown) {
      throw wrapFetchError(err);
    }

    await assertOkResponse(response);

    const data = (await response.json()) as {
      data?: {
        url?: string;
        title?: string;
        markdown?: string;
        text?: string;
        links?: Array<{ url: string; text: string }>;
        stats?: { character_count?: number; word_count?: number; read_time_seconds?: number };
      };
      metadata?: { title?: string; canonicalUrl?: string };
      // fallback in case of direct root
      url?: string;
      title?: string;
      markdown?: string;
      text?: string;
      links?: Array<{ url: string; text: string }>;
      stats?: { character_count?: number; word_count?: number; read_time_seconds?: number };
    };

    const root = data.data ?? data;
    const title = data.metadata?.title ?? root.title ?? args.url;
    const resolvedUrl = data.metadata?.canonicalUrl ?? root.url ?? args.url;
    let markdown = root.markdown;
    let text = root.text ?? (requestedFormats.includes('text') ? markdown : undefined);
    const rawLinks = (root.links ?? (data as Record<string, unknown>).links) as
      | unknown[]
      | undefined;
    const links: Array<{ url: string; text: string }> | undefined = Array.isArray(rawLinks)
      ? rawLinks.map((item: unknown) => {
          if (typeof item === 'string') {
            return { url: item, text: item };
          }
          if (item && typeof item === 'object' && 'url' in item) {
            const obj = item as { url: string; text?: string };
            return { url: obj.url, text: obj.text || obj.url };
          }
          return { url: String(item), text: String(item) };
        })
      : undefined;

    const maxChars = args.max_output_chars ?? 30000;
    let truncated = false;

    if (markdown && markdown.length > maxChars) {
      markdown = `${markdown.slice(0, maxChars)}\n\n---\n*[Output truncated at ${maxChars} characters. Use atlas_compile for structured sections.]*`;
      truncated = true;
    }
    if (text && text.length > maxChars) {
      text = `${text.slice(0, maxChars)}\n\n---\n*[Output truncated at ${maxChars} characters]*`;
      truncated = true;
    }

    const charCount = (markdown ?? text ?? '').length;
    const wordCount = (markdown ?? text ?? '').split(/\s+/).filter(Boolean).length;
    const readTimeSeconds = Math.max(1, Math.ceil(wordCount / 4));

    return {
      url: resolvedUrl,
      title,
      markdown,
      text,
      links,
      stats: {
        character_count: charCount,
        word_count: wordCount,
        read_time_seconds: readTimeSeconds,
      },
      truncated,
    };
  };
}

export function formatScrapeResult(res: AtlasScrapeResult) {
  const parts: string[] = [`# ${res.title}`, `*Source: ${res.url}*`, ''];

  if (res.markdown) {
    parts.push(res.markdown);
  } else if (res.text) {
    parts.push(res.text);
  }

  if (res.links && res.links.length > 0) {
    parts.push('', '## Discovered Links');
    for (const link of res.links.slice(0, 20)) {
      parts.push(`- [${link.text || link.url}](${link.url})`);
    }
    if (res.links.length > 20) {
      parts.push(`*... and ${res.links.length - 20} more links*`);
    }
  }

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
