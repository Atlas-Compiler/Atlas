/**
 * Atlas MCP Error Codes and Standardized Error Formatting
 */

export type AtlasMcpErrorCode =
  | 'ATLAS_INVALID_URL'
  | 'ATLAS_SSRF_BLOCKED'
  | 'ATLAS_FETCH_TIMEOUT'
  | 'ATLAS_FETCH_HTTP_ERROR'
  | 'ATLAS_RATE_LIMITED'
  | 'ATLAS_UNAUTHORIZED'
  | 'ATLAS_QUOTA_EXCEEDED'
  | 'ATLAS_JOB_FAILED'
  | 'ATLAS_RESOURCE_NOT_FOUND'
  | 'ATLAS_INTERNAL_ERROR';

export interface AtlasMcpErrorPayload {
  code: AtlasMcpErrorCode;
  message: string;
  retryable: boolean;
  retryAfterSeconds?: number;
  details?: unknown;
}

export class AtlasMcpError extends Error {
  readonly code: AtlasMcpErrorCode;
  readonly retryable: boolean;
  readonly retryAfterSeconds?: number;
  readonly details?: unknown;

  constructor(payload: AtlasMcpErrorPayload) {
    super(`[${payload.code}] ${payload.message}`);
    this.name = 'AtlasMcpError';
    this.code = payload.code;
    this.retryable = payload.retryable;
    this.retryAfterSeconds = payload.retryAfterSeconds;
    this.details = payload.details;
  }

  toToolErrorResult() {
    return {
      isError: true,
      content: [
        {
          type: 'text' as const,
          text: `Atlas Error (${this.code}): ${this.message}${
            this.retryAfterSeconds ? ` (Retry after ${this.retryAfterSeconds}s)` : ''
          }`,
        },
      ],
      structuredContent: {
        error: {
          code: this.code,
          message: this.message,
          retryable: this.retryable,
          retry_after_seconds: this.retryAfterSeconds,
          details: this.details,
        },
      },
    };
  }
}

export function wrapFetchError(err: unknown): AtlasMcpError {
  const msg = err instanceof Error ? err.message : String(err);
  return new AtlasMcpError({
    code: msg.includes('timeout') ? 'ATLAS_FETCH_TIMEOUT' : 'ATLAS_INTERNAL_ERROR',
    message: `Failed to connect to Atlas API: ${msg}`,
    retryable: true,
  });
}

export async function assertOkResponse(response: Response): Promise<void> {
  if (response.ok) {
    return;
  }

  let errorDetail = `HTTP ${response.status}`;
  try {
    const errJson = (await response.json()) as {
      title?: string;
      detail?: string;
      code?: string;
    };
    errorDetail = errJson.detail || errJson.title || errorDetail;
  } catch {
    // ignore JSON parsing errors
  }

  if (response.status === 401) {
    throw new AtlasMcpError({
      code: 'ATLAS_UNAUTHORIZED',
      message: 'Unauthorized: missing or invalid ATLAS_API_KEY.',
      retryable: false,
    });
  }
  if (response.status === 402 || response.status === 403) {
    throw new AtlasMcpError({
      code: 'ATLAS_QUOTA_EXCEEDED',
      message: `Atlas quota or authorization error: ${errorDetail}`,
      retryable: false,
    });
  }
  if (response.status === 429) {
    throw new AtlasMcpError({
      code: 'ATLAS_RATE_LIMITED',
      message: `Atlas rate limit exceeded: ${errorDetail}`,
      retryable: true,
      retryAfterSeconds: 5,
    });
  }
  if (response.status === 400 && errorDetail.toLowerCase().includes('ssrf')) {
    throw new AtlasMcpError({
      code: 'ATLAS_SSRF_BLOCKED',
      message: errorDetail,
      retryable: false,
    });
  }
  if (response.status === 404) {
    throw new AtlasMcpError({
      code: 'ATLAS_RESOURCE_NOT_FOUND',
      message: `Resource not found: ${errorDetail}`,
      retryable: false,
    });
  }

  throw new AtlasMcpError({
    code: 'ATLAS_FETCH_HTTP_ERROR',
    message: `Atlas API error: ${errorDetail}`,
    retryable: response.status >= 500,
  });
}

export function formatErrorToToolResult(err: unknown) {
  if (err instanceof AtlasMcpError) {
    return err.toToolErrorResult();
  }

  // Recognize backend Problem objects, duck-typed errors, or JSON string errors
  let p = typeof err === 'object' && err !== null ? (err as Record<string, unknown>) : null;
  if (p && typeof p.message === 'string' && p.message.startsWith('{') && p.message.endsWith('}')) {
    try {
      const parsed = JSON.parse(p.message);
      if (typeof parsed === 'object' && parsed !== null) {
        p = { ...p, ...parsed };
      }
    } catch {}
  }

  if (p) {
    const status = typeof p.status === 'number' ? p.status : undefined;
    const code = typeof p.code === 'string' ? p.code : undefined;
    const title = typeof p.title === 'string' ? p.title : undefined;
    const detail = typeof p.detail === 'string' ? p.detail : undefined;
    const message =
      detail || title || (typeof p.message === 'string' ? p.message : 'Unknown Atlas error');

    if (status === 401 || code === 'unauthorized' || code === 'invalid_credentials') {
      return new AtlasMcpError({
        code: 'ATLAS_UNAUTHORIZED',
        message,
        retryable: false,
      }).toToolErrorResult();
    }
    if (status === 429 || code === 'execution_concurrency' || code === 'rate_limit_exceeded') {
      return new AtlasMcpError({
        code: 'ATLAS_RATE_LIMITED',
        message:
          code === 'execution_concurrency'
            ? 'Execution concurrency limit reached for your workspace. Please retry shortly.'
            : message,
        retryable: true,
        retryAfterSeconds: 5,
      }).toToolErrorResult();
    }
    if (status === 402 || code === 'quota_exceeded' || code === 'insufficient_credits') {
      return new AtlasMcpError({
        code: 'ATLAS_QUOTA_EXCEEDED',
        message,
        retryable: false,
      }).toToolErrorResult();
    }
    if (status === 404 || code === 'resource_not_found') {
      return new AtlasMcpError({
        code: 'ATLAS_RESOURCE_NOT_FOUND',
        message,
        retryable: false,
      }).toToolErrorResult();
    }
    if (
      message.toLowerCase().includes('ssrf') ||
      code === 'ssrf_blocked' ||
      message.toLowerCase().includes('private ip')
    ) {
      return new AtlasMcpError({
        code: 'ATLAS_SSRF_BLOCKED',
        message,
        retryable: false,
      }).toToolErrorResult();
    }
  }

  const message = err instanceof Error ? err.message : String(err);
  return {
    isError: true,
    content: [
      {
        type: 'text' as const,
        text: `Atlas Execution Error: ${message}`,
      },
    ],
    structuredContent: {
      error: {
        code: 'ATLAS_INTERNAL_ERROR',
        message,
        retryable: false,
      },
    },
  };
}
