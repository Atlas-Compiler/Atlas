import { McpServer } from '@modelcontextprotocol/server';
import { formatErrorToToolResult } from './errors';
import {
  type ResourceReader,
  astResourceTemplate,
  compilationResourceTemplate,
  crawlResourceTemplate,
  createRemoteResourceReader,
  sectionResourceTemplate,
} from './resources';
import {
  type BatchExecutor,
  batchToolDefinition,
  createRemoteBatchExecutor,
  formatBatchResult,
} from './tools/batch';
import {
  type CompileExecutor,
  compileToolDefinition,
  createRemoteCompileExecutor,
  formatCompileResult,
} from './tools/compile';
import {
  type CrawlExecutor,
  crawlToolDefinition,
  createRemoteCrawlExecutor,
  formatCrawlResult,
} from './tools/crawl';
import {
  type MapExecutor,
  createRemoteMapExecutor,
  formatMapResult,
  mapToolDefinition,
} from './tools/map';
import {
  type ScrapeExecutor,
  createRemoteScrapeExecutor,
  formatScrapeResult,
  scrapeToolDefinition,
} from './tools/scrape';
import type { AtlasClientContext } from './types';

export interface CreateAtlasMcpServerOptions {
  context?: AtlasClientContext;
  scrapeExecutor?: ScrapeExecutor;
  compileExecutor?: CompileExecutor;
  mapExecutor?: MapExecutor;
  batchExecutor?: BatchExecutor;
  crawlExecutor?: CrawlExecutor;
  resourceReader?: ResourceReader;
}

export function createAtlasMcpServer(options: CreateAtlasMcpServerOptions = {}): McpServer {
  const context = options.context ?? {};

  const server = new McpServer({
    name: 'atlas',
    version: '1.0.0',
  });

  const scrapeExec = options.scrapeExecutor ?? createRemoteScrapeExecutor(context);
  const compileExec = options.compileExecutor ?? createRemoteCompileExecutor(context);
  const mapExec = options.mapExecutor ?? createRemoteMapExecutor(context);
  const batchExec = options.batchExecutor ?? createRemoteBatchExecutor(context);
  const crawlExec = options.crawlExecutor ?? createRemoteCrawlExecutor(context);
  const resourceRead = options.resourceReader ?? createRemoteResourceReader(context);

  // 1. atlas_scrape
  server.registerTool(
    scrapeToolDefinition.name,
    {
      description: scrapeToolDefinition.description,
      inputSchema: scrapeToolDefinition.inputSchema,
      outputSchema: scrapeToolDefinition.outputSchema,
      annotations: scrapeToolDefinition.annotations,
    },
    async (args) => {
      try {
        const res = await scrapeExec(args);
        return formatScrapeResult(res);
      } catch (err: unknown) {
        return formatErrorToToolResult(err);
      }
    },
  );

  // 2. atlas_compile
  server.registerTool(
    compileToolDefinition.name,
    {
      description: compileToolDefinition.description,
      inputSchema: compileToolDefinition.inputSchema,
      outputSchema: compileToolDefinition.outputSchema,
      annotations: compileToolDefinition.annotations,
    },
    async (args) => {
      try {
        const res = await compileExec(args);
        const maxChars = args.max_output_chars ?? 30000;
        if (res.markdown && res.markdown.length > maxChars) {
          const slice = res.markdown.slice(0, maxChars);
          const lastNl = slice.lastIndexOf('\n\n');
          const cleanSlice = lastNl > 1000 ? slice.slice(0, lastNl) : slice;
          const toc = (res.headings ?? [])
            .slice(0, 15)
            .map((h) => `${'  '.repeat(Math.max(0, h.level - 1))}- [${h.text}](${h.resource_uri})`)
            .join('\n');
          res.markdown = `${cleanSlice}\n\n---\n### ⚠️ Output Truncated (${maxChars} chars limit reached)\n\n#### Available Document Sections:\n${toc}\n\n*Full content available via resource:* \`${res.resources.compiled_artifact_uri}\``;
          res.truncated = true;
        }
        return formatCompileResult(res);
      } catch (err: unknown) {
        return formatErrorToToolResult(err);
      }
    },
  );

  // 3. atlas_map
  server.registerTool(
    mapToolDefinition.name,
    {
      description: mapToolDefinition.description,
      inputSchema: mapToolDefinition.inputSchema,
      outputSchema: mapToolDefinition.outputSchema,
      annotations: mapToolDefinition.annotations,
    },
    async (args) => {
      try {
        const res = await mapExec(args);
        return formatMapResult(res);
      } catch (err: unknown) {
        return formatErrorToToolResult(err);
      }
    },
  );

  // 4. atlas_batch_compile
  server.registerTool(
    batchToolDefinition.name,
    {
      description: batchToolDefinition.description,
      inputSchema: batchToolDefinition.inputSchema,
      outputSchema: batchToolDefinition.outputSchema,
      annotations: batchToolDefinition.annotations,
    },
    async (args) => {
      try {
        const res = await batchExec(args);
        return formatBatchResult(res);
      } catch (err: unknown) {
        return formatErrorToToolResult(err);
      }
    },
  );

  // 5. atlas_crawl
  server.registerTool(
    crawlToolDefinition.name,
    {
      description: crawlToolDefinition.description,
      inputSchema: crawlToolDefinition.inputSchema,
      outputSchema: crawlToolDefinition.outputSchema,
      annotations: crawlToolDefinition.annotations,
    },
    async (args) => {
      try {
        const res = await crawlExec(args);
        return formatCrawlResult(res);
      } catch (err: unknown) {
        return formatErrorToToolResult(err);
      }
    },
  );

  // Register atlas:// Resource Templates
  const normalizeVars = (vars: Record<string, string | string[]>): Record<string, string> => {
    const res: Record<string, string> = {};
    for (const [k, v] of Object.entries(vars)) {
      res[k] = Array.isArray(v) ? (v[0] ?? '') : v;
    }
    return res;
  };

  server.registerResource(
    'Compiled Page',
    compilationResourceTemplate,
    {
      mimeType: 'text/markdown',
      description: 'Full compiled markdown artifact for compilation {id}',
      cacheHint: { ttlMs: 300000, cacheScope: 'private' },
    },
    async (uri, variables) => {
      return resourceRead(uri.toString(), normalizeVars(variables));
    },
  );

  server.registerResource(
    'Compiled Section',
    sectionResourceTemplate,
    {
      mimeType: 'text/markdown',
      description: 'Exact text slice of a specific heading section within compilation {id}',
      cacheHint: { ttlMs: 300000, cacheScope: 'private' },
    },
    async (uri, variables) => {
      return resourceRead(uri.toString(), normalizeVars(variables));
    },
  );

  server.registerResource(
    'Crawl Manifest',
    crawlResourceTemplate,
    {
      mimeType: 'application/json',
      description:
        'Full crawl inventory with all discovered URLs, HTTP status codes, and artifact pointers',
      cacheHint: { ttlMs: 300000, cacheScope: 'private' },
    },
    async (uri, variables) => {
      return resourceRead(uri.toString(), normalizeVars(variables));
    },
  );

  server.registerResource(
    'Compiled AST',
    astResourceTemplate,
    {
      mimeType: 'application/json',
      description: 'Abstract Syntax Tree (AST) JSON artifact for compilation {id}',
      cacheHint: { ttlMs: 300000, cacheScope: 'private' },
    },
    async (uri, variables) => {
      return resourceRead(uri.toString(), normalizeVars(variables));
    },
  );

  return server;
}
