import { z } from 'zod';
import { AtlasMcpError, assertOkResponse, wrapFetchError } from '../errors';
import type { AtlasBatchCompileArgs, AtlasBatchCompileResult, AtlasClientContext } from '../types';

export const batchInputSchema = {
  urls: z
    .array(z.string().url())
    .min(1)
    .max(20)
    .describe('List of URLs to compile in parallel (maximum 20 per call).'),
  format: z
    .enum(['markdown', 'semantic', 'markdown+links'])
    .default('markdown')
    .describe('Content format for compilation.'),
  max_output_chars_per_page: z
    .number()
    .int()
    .min(1000)
    .max(50000)
    .default(15000)
    .describe('Character limit allocated per individual page.'),
};

export const batchOutputSchema = {
  total_requested: z.number(),
  successful: z.number(),
  failed: z.number(),
  results: z.array(
    z.object({
      url: z.string(),
      status: z.enum(['success', 'failed']),
      compilation_id: z.string().optional(),
      title: z.string().optional(),
      markdown: z.string().optional(),
      resource_uri: z.string().optional(),
      character_count: z.number().optional(),
      error: z.string().optional(),
    }),
  ),
};

export const batchToolDefinition = {
  name: 'atlas_batch_compile',
  description:
    'Compile a bounded list of explicit URLs in parallel. Returns clean markdown for each page within a consolidated budget. Maximum 20 URLs per batch call.',
  inputSchema: batchInputSchema,
  outputSchema: batchOutputSchema,
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

export type BatchExecutor = (args: AtlasBatchCompileArgs) => Promise<AtlasBatchCompileResult>;

import { createRemoteCompileExecutor } from './compile';

export function createRemoteBatchExecutor(context: AtlasClientContext): BatchExecutor {
  const compile = createRemoteCompileExecutor(context);
  return async (args: AtlasBatchCompileArgs): Promise<AtlasBatchCompileResult> => {
    const urls = args.urls;
    const maxCharsPerPage = args.max_output_chars_per_page ?? 15000;
    const concurrency = 4;
    const results: AtlasBatchCompileResult['results'] = new Array(urls.length);

    let currentIndex = 0;
    async function worker() {
      while (currentIndex < urls.length) {
        const index = currentIndex++;
        const targetUrl = urls[index];
        try {
          const compResult = await compile({
            url: targetUrl,
            format: args.format,
            max_output_chars: maxCharsPerPage,
          });
          results[index] = {
            url: targetUrl,
            status: 'success',
            compilation_id: compResult.compilation_id,
            title: compResult.title,
            markdown: compResult.markdown,
            resource_uri: compResult.resources.compiled_artifact_uri,
            character_count: compResult.markdown?.length,
          };
        } catch (err: unknown) {
          results[index] = {
            url: targetUrl,
            status: 'failed',
            error: err instanceof Error ? err.message : String(err),
          };
        }
      }
    }

    const workers = Array.from({ length: Math.min(concurrency, urls.length) }, () => worker());
    await Promise.all(workers);

    const successful = results.filter((r) => r.status === 'success').length;
    return {
      total_requested: urls.length,
      successful,
      failed: urls.length - successful,
      results,
    };
  };
}

export function formatBatchResult(res: AtlasBatchCompileResult) {
  const parts: string[] = [
    '# Batch Compilation Summary',
    `*Requested: ${res.total_requested} | Succeeded: ${res.successful} | Failed: ${res.failed}*`,
    '',
  ];

  for (const item of res.results) {
    parts.push(`## ${item.title || item.url}`);
    parts.push(`*URL: ${item.url} | Status: ${item.status}*`);
    if (item.resource_uri) {
      parts.push(`*Full Resource: \`${item.resource_uri}\`*`);
    }
    parts.push('');
    if (item.markdown) {
      parts.push(item.markdown);
    } else if (item.error) {
      parts.push(`> **Error:** ${item.error}`);
    }
    parts.push('', '---', '');
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
