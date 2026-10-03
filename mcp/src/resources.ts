import { type ReadResourceResult, ResourceTemplate } from '@modelcontextprotocol/server';
import { AtlasMcpError, assertOkResponse, wrapFetchError } from './errors';
import type { AtlasClientContext } from './types';

export const compilationResourceTemplate = new ResourceTemplate('atlas://compilations/{id}', {
  list: undefined,
});

export const sectionResourceTemplate = new ResourceTemplate(
  'atlas://compilations/{id}/sections/{section_id}',
  { list: undefined },
);

export const crawlResourceTemplate = new ResourceTemplate('atlas://crawls/{id}', {
  list: undefined,
});

export const astResourceTemplate = new ResourceTemplate('atlas://compilations/{id}/ast', {
  list: undefined,
});

export type ResourceContentItem =
  | { uri: string; text: string; mimeType?: string }
  | { uri: string; blob: string; mimeType?: string };

export type ResourceReadResult = ReadResourceResult;

export type ResourceReader = (
  uri: string,
  variables: Record<string, string>,
) => Promise<ResourceReadResult>;

async function readCompilationResource(
  baseUrl: string,
  fetchFn: typeof fetch,
  headers: Record<string, string>,
  uri: string,
  variables: Record<string, string>,
): Promise<ResourceReadResult> {
  const compilationId = variables.id;
  const sectionId = variables.section_id;

  let response: Response;
  let text = '';
  try {
    response = await fetchFn(`${baseUrl}/v1/jobs/${compilationId}/results`, {
      method: 'GET',
      headers,
      signal: AbortSignal.timeout(15000),
    });
    if (response.ok) {
      const json = (await response.json()) as {
        data?: Array<{ markdown?: string; text?: string }>;
      };
      text = json.data?.[0]?.markdown ?? json.data?.[0]?.text ?? '';
    }
  } catch {
    // ignore and try fallback
  }

  if (!text) {
    let endpoint = `${baseUrl}/v1/compilations/${compilationId}`;
    if (sectionId) {
      endpoint += `/sections/${sectionId}`;
    }
    try {
      response = await fetchFn(endpoint, {
        method: 'GET',
        headers,
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) {
        if (response.status === 404 || response.status === 403) {
          throw new AtlasMcpError({
            code: 'ATLAS_RESOURCE_NOT_FOUND',
            message: `Resource not found or unauthorized: ${uri}`,
            retryable: false,
          });
        }
        await assertOkResponse(response);
      }
      text = await response.text();
    } catch (err: unknown) {
      if (err instanceof AtlasMcpError) throw err;
      throw wrapFetchError(err);
    }
  }

  if (sectionId && text) {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    let match: RegExpExecArray | null = headingRegex.exec(text);
    let idx = 1;
    let targetStart = -1;
    let targetLevel = -1;
    let targetEnd = -1;

    while (match !== null) {
      const level = match[1].length;
      const headingText = match[2].trim();
      const currentSectionId = `sec_${idx}`;
      const slug = headingText
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      if (targetStart === -1) {
        if (
          sectionId === currentSectionId ||
          sectionId === `section_${idx}` ||
          sectionId === slug ||
          sectionId === String(idx)
        ) {
          targetStart = match.index;
          targetLevel = level;
        }
      } else if (level <= targetLevel) {
        targetEnd = match.index;
        break;
      }

      idx++;
      match = headingRegex.exec(text);
    }

    if (targetStart !== -1) {
      text =
        targetEnd !== -1
          ? text.slice(targetStart, targetEnd).trim()
          : text.slice(targetStart).trim();
    }
  }

  return {
    contents: [
      {
        uri,
        mimeType: 'text/markdown',
        text,
      },
    ],
  };
}

async function readCrawlResource(
  baseUrl: string,
  fetchFn: typeof fetch,
  headers: Record<string, string>,
  uri: string,
  variables: Record<string, string>,
): Promise<ResourceReadResult> {
  const crawlId = variables.id;
  const endpoint = `${baseUrl}/v1/jobs/${crawlId}`;

  let response: Response;
  try {
    response = await fetchFn(endpoint, {
      method: 'GET',
      headers,
      signal: AbortSignal.timeout(15000),
    });
  } catch (err: unknown) {
    throw wrapFetchError(err);
  }

  if (!response.ok) {
    if (response.status === 404 || response.status === 403) {
      throw new AtlasMcpError({
        code: 'ATLAS_RESOURCE_NOT_FOUND',
        message: `Crawl resource not found or unauthorized: ${uri}`,
        retryable: false,
      });
    }
    await assertOkResponse(response);
  }

  const text = await response.text();
  return {
    contents: [
      {
        uri,
        mimeType: 'application/json',
        text,
      },
    ],
  };
}

export function createRemoteResourceReader(context: AtlasClientContext): ResourceReader {
  return async (uri: string, _variables: Record<string, string>): Promise<ResourceReadResult> => {
    const baseUrl = (context.baseUrl ?? 'https://api.atlas-compiler.com').replace(/\/+$/, '');
    const fetchFn = context.fetch ?? fetch;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
    };

    if (context.apiKey) {
      headers.Authorization = `Bearer ${context.apiKey}`;
    }

    let response: Response;
    try {
      response = await fetchFn(`${baseUrl}/mcp`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'resources/read',
          params: { uri },
        }),
        signal: AbortSignal.timeout(15000),
      });
    } catch (err: unknown) {
      throw wrapFetchError(err);
    }

    if (!response.ok) {
      if (response.status === 404 || response.status === 403) {
        throw new AtlasMcpError({
          code: 'ATLAS_RESOURCE_NOT_FOUND',
          message: `Resource not found or unauthorized: ${uri}`,
          retryable: false,
        });
      }
      await assertOkResponse(response);
    }

    let rawText = await response.text();
    // Support both SSE stream (event: message\ndata: {...}) and raw JSON response
    if (rawText.includes('data: ')) {
      const dataLine = rawText.split('\n').find((l) => l.startsWith('data: '));
      if (dataLine) rawText = dataLine.slice(6);
    }

    let json: { result?: ResourceReadResult; error?: { code?: number; message?: string } };
    try {
      json = JSON.parse(rawText);
    } catch {
      throw new AtlasMcpError({
        code: 'ATLAS_FETCH_HTTP_ERROR',
        message: `Invalid JSON response from resource gateway: ${rawText.slice(0, 100)}`,
        retryable: false,
      });
    }

    if (json.error) {
      throw new AtlasMcpError({
        code: 'ATLAS_RESOURCE_NOT_FOUND',
        message: json.error.message || `Resource error: ${uri}`,
        retryable: false,
      });
    }

    if (!json.result?.contents) {
      throw new AtlasMcpError({
        code: 'ATLAS_RESOURCE_NOT_FOUND',
        message: `Resource ${uri} returned empty contents.`,
        retryable: false,
      });
    }

    return json.result;
  };
}
