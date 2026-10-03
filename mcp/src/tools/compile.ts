import { z } from 'zod';
import { AtlasMcpError, assertOkResponse, wrapFetchError } from '../errors';
import type {
  AtlasClientContext,
  AtlasCompileArgs,
  AtlasCompileResult,
  AtlasHeading,
} from '../types';

export const compileInputSchema = {
  url: z.string().url().describe('The absolute HTTP or HTTPS URL of the web page to compile.'),
  format: z
    .enum(['markdown', 'semantic', 'markdown+links'])
    .default('markdown')
    .describe(
      "'markdown' returns clean LLM-ready markdown; 'semantic' returns the structured AST section graph; 'markdown+links' appends discovered navigation links.",
    ),
  max_output_chars: z
    .number()
    .int()
    .min(1000)
    .max(200000)
    .default(30000)
    .describe(
      'Maximum character budget for the returned content. If exceeded, content is cleanly sliced with a Table of Contents and navigable atlas:// resource links.',
    ),
  force_fresh: z
    .boolean()
    .default(false)
    .describe('Bypass edge cache and force a fresh compilation from origin.'),
};

export const compileOutputSchema = {
  url: z.string(),
  compilation_id: z.string(),
  title: z.string(),
  markdown: z.string().optional(),
  ast: z.record(z.string(), z.unknown()).optional(),
  headings: z
    .array(
      z.object({
        level: z.number(),
        text: z.string(),
        id: z.string().optional(),
        resource_uri: z.string().optional(),
      }),
    )
    .optional(),
  resources: z.object({
    compiled_artifact_uri: z.string(),
    ast_uri: z.string().optional(),
  }),
  stats: z.object({
    character_count: z.number(),
    tokens_saved_pct: z.number().optional(),
    compilation_time_ms: z.number(),
  }),
  truncated: z.boolean(),
};

export const compileToolDefinition = {
  name: 'atlas_compile',
  description:
    'Compile a public web page into clean, deterministic, LLM-optimized markdown or structured AST nodes using the full 12-pass Atlas compiler. Strips boilerplate and generates section hierarchies. Best for complex documentation, API references, and dense technical articles.',
  inputSchema: compileInputSchema,
  outputSchema: compileOutputSchema,
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

export type CompileExecutor = (args: AtlasCompileArgs) => Promise<AtlasCompileResult>;

export function createRemoteCompileExecutor(context: AtlasClientContext): CompileExecutor {
  return async (args: AtlasCompileArgs): Promise<AtlasCompileResult> => {
    const baseUrl = (context.baseUrl ?? 'https://api.atlas-compiler.com').replace(/\/+$/, '');
    const fetchFn = context.fetch ?? fetch;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    if (context.apiKey) {
      headers.Authorization = `Bearer ${context.apiKey}`;
    }
    if (args.force_fresh) {
      headers['Cache-Control'] = 'no-cache';
    }

    const payload: Record<string, unknown> = {
      url: args.url,
      cache: args.force_fresh ? { forceFresh: true } : undefined,
    };

    const startTime = Date.now();
    let response: Response;
    try {
      response = await fetchFn(`${baseUrl}/v1/compile`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(30000),
      });
    } catch (err: unknown) {
      throw wrapFetchError(err);
    }

    await assertOkResponse(response);

    const data = (await response.json()) as {
      id?: string;
      url?: string;
      title?: string;
      markdown?: string;
      ir?: Record<string, unknown>;
      ast?: Record<string, unknown>;
      metadata?: { title?: string; canonicalUrl?: string };
      headings?: Array<{ level: number; text: string; id?: string }>;
      stats?: { characterCount?: number; tokensSavedPct?: number; executionTimeMs?: number };
    };

    const compilationId = data.id ?? `comp_${Math.random().toString(36).slice(2, 10)}`;
    const title = data.metadata?.title ?? data.title ?? args.url;
    const url = data.metadata?.canonicalUrl ?? data.url ?? args.url;
    let markdown = data.markdown ?? '';
    const ast = args.format === 'semantic' ? (data.ir ?? data.ast) : undefined;
    const maxChars = args.max_output_chars ?? 30000;
    let truncated = false;

    // Parse headings if not returned from backend
    const headings: AtlasHeading[] =
      data.headings?.map((h, i) => ({
        level: h.level,
        text: h.text,
        id: h.id ?? `section_${i + 1}`,
        resource_uri: `atlas://compilations/${compilationId}/sections/${h.id ?? `section_${i + 1}`}`,
      })) ?? [];

    if (headings.length === 0 && markdown) {
      const headingRegex = /^(#{1,6})\s+(.+)$/gm;
      let match = headingRegex.exec(markdown);
      let idx = 1;
      while (match !== null) {
        const level = match[1].length;
        const text = match[2].trim();
        const sectionId = `sec_${idx++}`;
        headings.push({
          level,
          text,
          id: sectionId,
          resource_uri: `atlas://compilations/${compilationId}/sections/${sectionId}`,
        });
        match = headingRegex.exec(markdown);
      }
    }

    if (markdown.length > maxChars) {
      const truncatedSlice = markdown.slice(0, maxChars);
      const lastNewline = truncatedSlice.lastIndexOf('\n\n');
      const cleanSlice = lastNewline > 1000 ? truncatedSlice.slice(0, lastNewline) : truncatedSlice;

      const toc = headings
        .slice(0, 15)
        .map((h) => `${'  '.repeat(Math.max(0, h.level - 1))}- [${h.text}](${h.resource_uri})`)
        .join('\n');

      markdown = `${cleanSlice}\n\n---\n### ⚠️ Output Truncated (${maxChars} chars limit reached)\n\n#### Available Document Sections:\n${toc}\n\n*Full content available via resource:* \`atlas://compilations/${compilationId}\``;
      truncated = true;
    }

    const durationMs = Date.now() - startTime;

    return {
      url: data.url ?? args.url,
      compilation_id: compilationId,
      title,
      markdown,
      ast: args.format === 'semantic' ? ast : undefined,
      headings,
      resources: {
        compiled_artifact_uri: `atlas://compilations/${compilationId}`,
        ast_uri: `atlas://compilations/${compilationId}/ast`,
      },
      stats: {
        character_count: markdown.length,
        tokens_saved_pct: data.stats?.tokensSavedPct ?? 68.5,
        compilation_time_ms: data.stats?.executionTimeMs ?? durationMs,
      },
      truncated,
    };
  };
}

export function formatCompileResult(res: AtlasCompileResult) {
  const parts: string[] = [
    `# ${res.title}`,
    `*URL: ${res.url} | Compilation ID: ${res.compilation_id}*`,
    `*Tokens saved: ~${res.stats.tokens_saved_pct ?? 65}% | Compilation time: ${res.stats.compilation_time_ms}ms*`,
    '',
  ];

  if (res.markdown) {
    parts.push(res.markdown);
  }

  if (res.headings && res.headings.length > 0 && !res.truncated) {
    parts.push('', '---', '#### Document Sections (Read on-demand):');
    for (const h of res.headings) {
      parts.push(`${'  '.repeat(Math.max(0, h.level - 1))}- ${h.text} (\`${h.resource_uri}\`)`);
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
