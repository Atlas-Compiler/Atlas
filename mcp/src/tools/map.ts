import { z } from 'zod';
import { AtlasMcpError, assertOkResponse, wrapFetchError } from '../errors';
import type { AtlasClientContext, AtlasMapArgs, AtlasMapResult } from '../types';

export const mapInputSchema = {
  url: z.string().url().describe("Root URL or domain to map (e.g. 'https://docs.stripe.com')."),
  limit: z
    .number()
    .int()
    .min(1)
    .max(500)
    .default(100)
    .describe('Maximum number of discovered links to return.'),
  include_subdomains: z
    .boolean()
    .default(false)
    .describe('Whether to discover links on subdomains of the target host.'),
  sitemap: z
    .enum(['include', 'skip', 'only'])
    .default('include')
    .describe(
      "Strategy for inspecting sitemap.xml files ('include' checks sitemaps first then crawls links; 'skip' only crawls links; 'only' strictly reads sitemaps).",
    ),
};

export const mapOutputSchema = {
  root_url: z.string(),
  urls: z.array(z.string()),
  count: z.number(),
  sitemaps_found: z.array(z.string()),
  duration_ms: z.number(),
};

export const mapToolDefinition = {
  name: 'atlas_map',
  description:
    'Discover the URL topology, sitemap structure, and hierarchy of a website without compiling individual pages. Use before crawling to identify relevant documentation paths and section boundaries.',
  inputSchema: mapInputSchema,
  outputSchema: mapOutputSchema,
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
    idempotentHint: true,
  },
  cacheHint: {
    ttlMs: 60000,
    cacheScope: 'private' as const,
  },
};

export type MapExecutor = (args: AtlasMapArgs) => Promise<AtlasMapResult>;

export function createRemoteMapExecutor(context: AtlasClientContext): MapExecutor {
  return async (args: AtlasMapArgs): Promise<AtlasMapResult> => {
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
      limit: args.limit ?? 100,
      includeSubdomains: args.include_subdomains ?? false,
      sitemap: args.sitemap ?? 'include',
    };

    const startTime = Date.now();
    let response: Response;
    try {
      response = await fetchFn(`${baseUrl}/v1/map`, {
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
      rootUrl?: string;
      urls?: string[];
      links?: Array<{ url: string; title?: string | null }> | string[];
      sitemaps?: string[];
    };

    const rawLinks = data.links ?? data.urls ?? [];
    const urls: string[] = rawLinks.map((item) => (typeof item === 'string' ? item : item.url));
    const sitemaps = data.sitemaps ?? [];
    const durationMs = Date.now() - startTime;

    return {
      root_url: data.rootUrl ?? args.url,
      urls,
      count: urls.length,
      sitemaps_found: sitemaps,
      duration_ms: durationMs,
    };
  };
}

export function formatMapResult(res: AtlasMapResult) {
  const parts: string[] = [
    `# Site Topology Map for ${res.root_url}`,
    `*Discovered ${res.count} URLs in ${res.duration_ms}ms*`,
    '',
  ];

  if (res.sitemaps_found.length > 0) {
    parts.push('### Sitemaps Found:');
    for (const sm of res.sitemaps_found) {
      parts.push(`- ${sm}`);
    }
    parts.push('');
  }

  parts.push('### Discovered Paths:');
  for (const url of res.urls.slice(0, 50)) {
    parts.push(`- ${url}`);
  }
  if (res.urls.length > 50) {
    parts.push(`*... and ${res.urls.length - 50} more discovered URLs*`);
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
