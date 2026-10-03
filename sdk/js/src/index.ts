/* Generated from backend/openapi/atlas.openapi.json. Do not edit. */
export type ExecutionResultArtifact = {
  completedAt: string;
  id: string;
  ir: {
    contentGraph: {
      nodes: {
        [key: string]: {
          attributes?: { [key: string]: string };
          children: Array<string>;
          chunkBoundary?: boolean;
          content?: string;
          contentHash?: string;
          id: string;
          language?: string;
          level?: number;
          parent: string;
          provenance?: { selector: string; tag: string };
          semanticRole?: string;
          type:
            | 'section'
            | 'heading'
            | 'paragraph'
            | 'list'
            | 'list-item'
            | 'table'
            | 'table-row'
            | 'table-cell'
            | 'code'
            | 'code-inline'
            | 'text'
            | 'metadata'
            | 'link'
            | 'image'
            | 'strong'
            | 'emphasis'
            | 'nav'
            | 'separator'
            | 'button'
            | 'search-input'
            | 'blockquote'
            | 'figure'
            | 'caption'
            | 'math'
            | 'definition-list'
            | 'definition-term'
            | 'definition-desc';
        };
      };
      readingOrder: Array<string>;
    };
    metadata: {
      author?: string;
      canonicalUrl: string;
      description?: string;
      documentHash?: string;
      extractionConfidence?: number;
      language?: string;
      publishedDate?: string | null;
      title: string;
    };
    version: string;
  } | null;
  markdown: string | null;
  metadata: {
    author?: string;
    canonicalUrl: string;
    description?: string;
    documentHash?: string;
    extractionConfidence?: number;
    language?: string;
    publishedDate?: string | null;
    title: string;
  } | null;
  url: string | null;
};
export type HealthResponse = { service: 'atlas-backend'; status: 'ok'; version: '1' };
export type JsonValue =
  | null
  | boolean
  | number
  | string
  | Array<JsonValue>
  | { [key: string]: JsonValue };
export type PlanCatalog = Array<PlanCatalogEntry>;
export type PlanCatalogEntry = {
  annualAmountCents: number | null;
  code: string;
  currency: string;
  features: Array<string>;
  highlightBadge?: string | null;
  includedCredits: number;
  limits: Array<PlanLimit>;
  marketingBlurb: string;
  monthlyAmountCents: number | null;
  version: number;
};
export type PlanLimit = { key: string; unit: string; value: number | null };
export type Problem = {
  code: string;
  detail: string;
  documentationUrl?: string;
  instance: string;
  invalidParams?: Array<{ name: string; reason: string }>;
  requestId: string;
  resourceId?: string;
  retryable: boolean;
  status: number;
  title: string;
  type: string;
};
export type GetHealthParameters = Record<string, never>;
export type GetHealthRequest = undefined;
export type GetHealthResponse = HealthResponse;
export type CreateBatchParameters = { 'idempotency-key'?: string };
export type CreateBatchRequest = {
  cache?: { cacheOnly?: boolean; forceFresh?: boolean; maxAgeSeconds?: number };
  formats?: Array<'markdown' | 'links' | 'ir'>;
  metadata?: { [key: string]: string };
  projectId?: string;
  urls: Array<string>;
  webhook?:
    | string
    | {
        events?: Array<'job.ready' | 'job.failed' | 'job.cancelled' | 'crawl.page_completed'>;
        metadata?: { [key: string]: string };
        url: string;
      }
    | { endpointId: string };
};
export type CreateBatchResponse = {
  artifactExpiresAt: string | null;
  artifactState: 'not_applicable' | 'pending' | 'ingesting' | 'complete' | 'expired' | 'review';
  cancellationRequestedAt: string | null;
  createdAt: string;
  executionTerminalAt: string | null;
  id: string;
  kind: 'compile' | 'crawl' | 'batch';
  progress: {
    completedItems: number;
    etaSeconds: number | null;
    failedItems: number;
    queuedItems: number;
    ratePerMinute: number | null;
  } | null;
  projectId: string | null;
  readyAt: string | null;
  reviewReason: string | null;
  status: 'queued' | 'running' | 'ingesting' | 'ready' | 'failed' | 'cancelled';
  targetUrl?: string | null;
  updatedAt: string;
  workspaceId: string;
};
export type GetWorkspaceBootstrapParameters = Record<string, never>;
export type GetWorkspaceBootstrapRequest = undefined;
export type GetWorkspaceBootstrapResponse = {
  contractVersion: 'phase1-workspace-v1';
  defaultKeySecret?: string | null;
  onboardingHints?: { hasCreatedDefaultKey: boolean };
  user: { id: string };
  workspace: {
    createdAt: string;
    defaultProject: { id: string; name: string; slug: string } | null;
    id: string;
    isPrimary: boolean;
    name: string;
    planSnapshot: {
      features: Array<{ enabled: boolean; key: string }>;
      id: string;
      limits: Array<{ key: string; unit: string; value: number | null }>;
      plan: { code: string; version: number };
      schemaVersion: 1;
      snapshotVersion: number;
    };
    role: 'owner' | 'admin' | 'developer' | 'viewer';
    slug: string;
    status: 'active' | 'suspended' | 'deleting';
    updatedAt: string;
    version: number;
  };
};
export type CompileUrlParameters = { 'idempotency-key': string };
export type CompileUrlRequest = {
  cache?: { cacheOnly?: boolean; forceFresh?: boolean; maxAgeSeconds?: number };
  projectId?: string;
  url: string;
};
export type CompileUrlResponse =
  | {
      ir: {
        contentGraph: {
          nodes: {
            [key: string]: {
              attributes?: { [key: string]: string };
              children: Array<string>;
              chunkBoundary?: boolean;
              content?: string;
              contentHash?: string;
              id: string;
              language?: string;
              level?: number;
              parent: string;
              provenance?: { selector: string; tag: string };
              semanticRole?: string;
              type:
                | 'section'
                | 'heading'
                | 'paragraph'
                | 'list'
                | 'list-item'
                | 'table'
                | 'table-row'
                | 'table-cell'
                | 'code'
                | 'code-inline'
                | 'text'
                | 'metadata'
                | 'link'
                | 'image'
                | 'strong'
                | 'emphasis'
                | 'nav'
                | 'separator'
                | 'button'
                | 'search-input'
                | 'blockquote'
                | 'figure'
                | 'caption'
                | 'math'
                | 'definition-list'
                | 'definition-term'
                | 'definition-desc';
            };
          };
          readingOrder: Array<string>;
        };
        metadata: {
          author?: string;
          canonicalUrl: string;
          description?: string;
          documentHash?: string;
          extractionConfidence?: number;
          language?: string;
          publishedDate?: string | null;
          title: string;
        };
        version: string;
      };
      markdown: string;
      metadata: {
        author?: string;
        canonicalUrl: string;
        description?: string;
        documentHash?: string;
        extractionConfidence?: number;
        language?: string;
        publishedDate?: string | null;
        title: string;
      };
      usage: { credits: number };
    }
  | {
      artifactExpiresAt: string | null;
      artifactState: 'not_applicable' | 'pending' | 'ingesting' | 'complete' | 'expired' | 'review';
      cancellationRequestedAt: string | null;
      createdAt: string;
      executionTerminalAt: string | null;
      id: string;
      kind: 'compile' | 'crawl' | 'batch';
      progress: {
        completedItems: number;
        etaSeconds: number | null;
        failedItems: number;
        queuedItems: number;
        ratePerMinute: number | null;
      } | null;
      projectId: string | null;
      readyAt: string | null;
      reviewReason: string | null;
      status: 'queued' | 'running' | 'ingesting' | 'ready' | 'failed' | 'cancelled';
      targetUrl?: string | null;
      updatedAt: string;
      workspaceId: string;
    };
export type CreateCrawlParameters = { 'idempotency-key'?: string };
export type CreateCrawlRequest = {
  cache?: { cacheOnly?: boolean; forceFresh?: boolean; maxAgeSeconds?: number };
  excludePaths?: Array<string>;
  formats?: Array<'markdown' | 'links' | 'ir'>;
  ignoreQueryParameters?: boolean;
  includePaths?: Array<string>;
  includeSubdomains?: boolean;
  maxDepth?: number;
  maxPages?: number;
  metadata?: { [key: string]: string };
  projectId?: string;
  sitemap?: 'include' | 'skip' | 'only';
  url: string;
  webhook?:
    | string
    | {
        events?: Array<'job.ready' | 'job.failed' | 'job.cancelled' | 'crawl.page_completed'>;
        metadata?: { [key: string]: string };
        url: string;
      }
    | { endpointId: string };
};
export type CreateCrawlResponse = {
  artifactExpiresAt: string | null;
  artifactState: 'not_applicable' | 'pending' | 'ingesting' | 'complete' | 'expired' | 'review';
  cancellationRequestedAt: string | null;
  createdAt: string;
  executionTerminalAt: string | null;
  id: string;
  kind: 'compile' | 'crawl' | 'batch';
  progress: {
    completedItems: number;
    etaSeconds: number | null;
    failedItems: number;
    queuedItems: number;
    ratePerMinute: number | null;
  } | null;
  projectId: string | null;
  readyAt: string | null;
  reviewReason: string | null;
  status: 'queued' | 'running' | 'ingesting' | 'ready' | 'failed' | 'cancelled';
  targetUrl?: string | null;
  updatedAt: string;
  workspaceId: string;
};
export type AcceptInvitationParameters = { 'idempotency-key': string };
export type AcceptInvitationRequest = { token: string };
export type AcceptInvitationResponse = {
  createdAt: string;
  email: string;
  expiresAt: string | null;
  id: string;
  role: 'admin' | 'developer' | 'viewer';
  status: 'pending' | 'accepted' | 'revoked' | 'expired';
  updatedAt: string;
};
export type ListJobsParameters = {
  limit?: number;
  cursor?: string;
  status?: 'queued' | 'running' | 'ingesting' | 'ready' | 'failed' | 'cancelled';
  kind?: 'compile' | 'crawl' | 'batch';
  projectId?: string;
};
export type ListJobsRequest = undefined;
export type ListJobsResponse = {
  data: Array<{
    artifactExpiresAt: string | null;
    artifactState: 'not_applicable' | 'pending' | 'ingesting' | 'complete' | 'expired' | 'review';
    cancellationRequestedAt: string | null;
    createdAt: string;
    executionTerminalAt: string | null;
    id: string;
    kind: 'compile' | 'crawl' | 'batch';
    progress: {
      completedItems: number;
      etaSeconds: number | null;
      failedItems: number;
      queuedItems: number;
      ratePerMinute: number | null;
    } | null;
    projectId: string | null;
    readyAt: string | null;
    reviewReason: string | null;
    status: 'queued' | 'running' | 'ingesting' | 'ready' | 'failed' | 'cancelled';
    targetUrl?: string | null;
    updatedAt: string;
    workspaceId: string;
  }>;
  nextCursor: string | null;
};
export type BulkCancelJobsParameters = { 'idempotency-key': string };
export type BulkCancelJobsRequest = {
  jobIds?: Array<string>;
  projectId?: string;
  status?: Array<'queued' | 'running' | 'ingesting' | 'ready' | 'failed' | 'cancelled'>;
};
export type BulkCancelJobsResponse = {
  results: Array<{
    job?: {
      artifactExpiresAt: string | null;
      artifactState: 'not_applicable' | 'pending' | 'ingesting' | 'complete' | 'expired' | 'review';
      cancellationRequestedAt: string | null;
      createdAt: string;
      executionTerminalAt: string | null;
      id: string;
      kind: 'compile' | 'crawl' | 'batch';
      progress: {
        completedItems: number;
        etaSeconds: number | null;
        failedItems: number;
        queuedItems: number;
        ratePerMinute: number | null;
      } | null;
      projectId: string | null;
      readyAt: string | null;
      reviewReason: string | null;
      status: 'queued' | 'running' | 'ingesting' | 'ready' | 'failed' | 'cancelled';
      targetUrl?: string | null;
      updatedAt: string;
      workspaceId: string;
    };
    jobId: string;
    status: 'accepted' | 'terminal' | 'not_found';
  }>;
};
export type GetJobParameters = { jobId: string };
export type GetJobRequest = undefined;
export type GetJobResponse = {
  artifactExpiresAt: string | null;
  artifactState: 'not_applicable' | 'pending' | 'ingesting' | 'complete' | 'expired' | 'review';
  cancellationRequestedAt: string | null;
  createdAt: string;
  executionTerminalAt: string | null;
  id: string;
  kind: 'compile' | 'crawl' | 'batch';
  progress: {
    completedItems: number;
    etaSeconds: number | null;
    failedItems: number;
    queuedItems: number;
    ratePerMinute: number | null;
  } | null;
  projectId: string | null;
  readyAt: string | null;
  reviewReason: string | null;
  status: 'queued' | 'running' | 'ingesting' | 'ready' | 'failed' | 'cancelled';
  targetUrl?: string | null;
  updatedAt: string;
  workspaceId: string;
};
export type CancelJobParameters = { jobId: string; 'idempotency-key': string };
export type CancelJobRequest = undefined;
export type CancelJobResponse = {
  accepted: true;
  job: {
    artifactExpiresAt: string | null;
    artifactState: 'not_applicable' | 'pending' | 'ingesting' | 'complete' | 'expired' | 'review';
    cancellationRequestedAt: string | null;
    createdAt: string;
    executionTerminalAt: string | null;
    id: string;
    kind: 'compile' | 'crawl' | 'batch';
    progress: {
      completedItems: number;
      etaSeconds: number | null;
      failedItems: number;
      queuedItems: number;
      ratePerMinute: number | null;
    } | null;
    projectId: string | null;
    readyAt: string | null;
    reviewReason: string | null;
    status: 'queued' | 'running' | 'ingesting' | 'ready' | 'failed' | 'cancelled';
    targetUrl?: string | null;
    updatedAt: string;
    workspaceId: string;
  };
  reason: 'cancellation_requested';
};
export type ListJobErrorsParameters = { jobId: string; limit?: number; cursor?: string };
export type ListJobErrorsRequest = undefined;
export type ListJobErrorsResponse = {
  data: Array<{ code: string; detail: string; id: string; occurredAt: string; url: string | null }>;
  nextCursor: string | null;
};
export type ListJobResultsParameters = { jobId: string; limit?: number; cursor?: string };
export type ListJobResultsRequest = undefined;
export type ListJobResultsResponse = {
  data: Array<ExecutionResultArtifact>;
  nextCursor: string | null;
};
export type MapUrlParameters = { 'idempotency-key'?: string };
export type MapUrlRequest = {
  cache?: { cacheOnly?: boolean; forceFresh?: boolean; maxAgeSeconds?: number };
  exhaustive?: boolean;
  ignoreQueryParameters?: boolean;
  includeSubdomains?: boolean;
  limit?: number;
  projectId?: string;
  sitemap?: 'include' | 'skip' | 'only';
  timeout?: number;
  url: string;
};
export type MapUrlResponse = {
  links: Array<{
    confidence: number;
    depth: number;
    description: string | null;
    estimatedContent: string;
    incomingLinks: number;
    lastModified: string | null;
    parentUrl?: string | null;
    priority: number;
    recommended: boolean;
    sources: Array<'sitemap' | 'homepage' | 'navigation' | 'rss' | 'manifest'>;
    title: string | null;
    url: string;
  }>;
  success: boolean;
  summary: {
    discoveryConfidence: number;
    estimatedCompileTime: string;
    estimatedPages: number;
    estimatedTokens: string;
    framework: string | null;
    language: string;
    recommendedDepth: number;
    recommendedEntryPoint: string;
    sitemapCoverage: number;
    websiteType: string;
  };
  usage: { credits: number };
};
export type GetCurrentUserParameters = Record<string, never>;
export type GetCurrentUserRequest = undefined;
export type GetCurrentUserResponse = {
  createdAt: string;
  displayName: string | null;
  email: string | null;
  id: string;
  updatedAt: string;
};
export type ListPlansParameters = Record<string, never>;
export type ListPlansRequest = undefined;
export type ListPlansResponse = PlanCatalog;
export type ScrapeUrlParameters = { 'idempotency-key'?: string };
export type ScrapeUrlRequest = {
  cache?: { cacheOnly?: boolean; forceFresh?: boolean; maxAgeSeconds?: number };
  formats?: Array<'markdown' | 'links' | 'ir'>;
  projectId?: string;
  url: string;
};
export type ScrapeUrlResponse = {
  data: {
    ir?: {
      contentGraph: {
        nodes: {
          [key: string]: {
            attributes?: { [key: string]: string };
            children: Array<string>;
            chunkBoundary?: boolean;
            content?: string;
            contentHash?: string;
            id: string;
            language?: string;
            level?: number;
            parent: string;
            provenance?: { selector: string; tag: string };
            semanticRole?: string;
            type:
              | 'section'
              | 'heading'
              | 'paragraph'
              | 'list'
              | 'list-item'
              | 'table'
              | 'table-row'
              | 'table-cell'
              | 'code'
              | 'code-inline'
              | 'text'
              | 'metadata'
              | 'link'
              | 'image'
              | 'strong'
              | 'emphasis'
              | 'nav'
              | 'separator'
              | 'button'
              | 'search-input'
              | 'blockquote'
              | 'figure'
              | 'caption'
              | 'math'
              | 'definition-list'
              | 'definition-term'
              | 'definition-desc';
          };
        };
        readingOrder: Array<string>;
      };
      metadata: {
        author?: string;
        canonicalUrl: string;
        description?: string;
        documentHash?: string;
        extractionConfidence?: number;
        language?: string;
        publishedDate?: string | null;
        title: string;
      };
      version: string;
    };
    links?: Array<string>;
    markdown?: string;
  };
  metadata: {
    author?: string;
    canonicalUrl: string;
    description?: string;
    documentHash?: string;
    extractionConfidence?: number;
    language?: string;
    publishedDate?: string | null;
    title: string;
  };
  usage: { credits: number };
};
export type ListWorkspacesParameters = { limit?: number; cursor?: string };
export type ListWorkspacesRequest = undefined;
export type ListWorkspacesResponse = {
  data: Array<{
    createdAt: string;
    defaultProject: { id: string; name: string; slug: string } | null;
    id: string;
    isPrimary: boolean;
    name: string;
    planSnapshot: {
      features: Array<{ enabled: boolean; key: string }>;
      id: string;
      limits: Array<{ key: string; unit: string; value: number | null }>;
      plan: { code: string; version: number };
      schemaVersion: 1;
      snapshotVersion: number;
    };
    role: 'owner' | 'admin' | 'developer' | 'viewer';
    slug: string;
    status: 'active' | 'suspended' | 'deleting';
    updatedAt: string;
    version: number;
  }>;
  nextCursor: string | null;
};
export type CreateWorkspaceParameters = { 'idempotency-key': string };
export type CreateWorkspaceRequest = { name: string; slug: string };
export type CreateWorkspaceResponse = {
  createdAt: string;
  defaultProject: { id: string; name: string; slug: string } | null;
  id: string;
  isPrimary: boolean;
  name: string;
  planSnapshot: {
    features: Array<{ enabled: boolean; key: string }>;
    id: string;
    limits: Array<{ key: string; unit: string; value: number | null }>;
    plan: { code: string; version: number };
    schemaVersion: 1;
    snapshotVersion: number;
  };
  role: 'owner' | 'admin' | 'developer' | 'viewer';
  slug: string;
  status: 'active' | 'suspended' | 'deleting';
  updatedAt: string;
  version: number;
};
export type ResolveWorkspaceBySlugParameters = { workspaceSlug: string };
export type ResolveWorkspaceBySlugRequest = undefined;
export type ResolveWorkspaceBySlugResponse = {
  contractVersion: 'phase1-workspace-v1';
  workspace: {
    createdAt: string;
    defaultProject: { id: string; name: string; slug: string } | null;
    id: string;
    isPrimary: boolean;
    name: string;
    planSnapshot: {
      features: Array<{ enabled: boolean; key: string }>;
      id: string;
      limits: Array<{ key: string; unit: string; value: number | null }>;
      plan: { code: string; version: number };
      schemaVersion: 1;
      snapshotVersion: number;
    };
    role: 'owner' | 'admin' | 'developer' | 'viewer';
    slug: string;
    status: 'active' | 'suspended' | 'deleting';
    updatedAt: string;
    version: number;
  };
};
export type GetWorkspaceParameters = { workspaceId: string };
export type GetWorkspaceRequest = undefined;
export type GetWorkspaceResponse = {
  createdAt: string;
  defaultProject: { id: string; name: string; slug: string } | null;
  id: string;
  isPrimary: boolean;
  name: string;
  planSnapshot: {
    features: Array<{ enabled: boolean; key: string }>;
    id: string;
    limits: Array<{ key: string; unit: string; value: number | null }>;
    plan: { code: string; version: number };
    schemaVersion: 1;
    snapshotVersion: number;
  };
  role: 'owner' | 'admin' | 'developer' | 'viewer';
  slug: string;
  status: 'active' | 'suspended' | 'deleting';
  updatedAt: string;
  version: number;
};
export type DeleteWorkspaceParameters = { workspaceId: string; 'idempotency-key': string };
export type DeleteWorkspaceRequest = undefined;
export type DeleteWorkspaceResponse = {
  completedAt: string | null;
  id: string;
  requestedAt: string;
  stage:
    | 'requested'
    | 'execution_stopped'
    | 'webhooks_disabled'
    | 'billing_detached'
    | 'artifacts_deleted'
    | 'metadata_anonymized_or_deleted'
    | 'retention_records_preserved'
    | 'completed';
  updatedAt: string;
  workspaceId: string;
};
export type UpdateWorkspaceParameters = { workspaceId: string; 'idempotency-key': string };
export type UpdateWorkspaceRequest = { name: string };
export type UpdateWorkspaceResponse = {
  createdAt: string;
  defaultProject: { id: string; name: string; slug: string } | null;
  id: string;
  isPrimary: boolean;
  name: string;
  planSnapshot: {
    features: Array<{ enabled: boolean; key: string }>;
    id: string;
    limits: Array<{ key: string; unit: string; value: number | null }>;
    plan: { code: string; version: number };
    schemaVersion: 1;
    snapshotVersion: number;
  };
  role: 'owner' | 'admin' | 'developer' | 'viewer';
  slug: string;
  status: 'active' | 'suspended' | 'deleting';
  updatedAt: string;
  version: number;
};
export type ListApiKeysParameters = { workspaceId: string; limit?: number; cursor?: string };
export type ListApiKeysRequest = undefined;
export type ListApiKeysResponse = {
  data: Array<{
    createdAt: string;
    deprecatedAt: string | null;
    expiresAt: string | null;
    fingerprintSuffix: string | null;
    id: string;
    ipAllowlist: Array<string> | null;
    kind?: 'standard' | 'default' | 'test';
    lastUsedAt: string | null;
    name: string;
    prefix: string;
    projectId: string | null;
    revokedAt: string | null;
    scopes: Array<'execute' | 'jobs:read' | 'jobs:cancel' | 'projects:read' | 'usage:read'>;
    workspaceId: string;
  }>;
  nextCursor: string | null;
};
export type CreateApiKeyParameters = { workspaceId: string; 'idempotency-key': string };
export type CreateApiKeyRequest = {
  expiresAt?: string | null;
  ipAllowlist?: Array<string> | null;
  name: string;
  projectId?: string | null;
  scopes: Array<'execute' | 'jobs:read' | 'jobs:cancel' | 'projects:read' | 'usage:read'>;
};
export type CreateApiKeyResponse = {
  createdAt: string;
  deprecatedAt: string | null;
  expiresAt: string | null;
  fingerprintSuffix: string | null;
  id: string;
  ipAllowlist: Array<string> | null;
  kind?: 'standard' | 'default' | 'test';
  lastUsedAt: string | null;
  name: string;
  prefix: string;
  projectId: string | null;
  revokedAt: string | null;
  scopes: Array<'execute' | 'jobs:read' | 'jobs:cancel' | 'projects:read' | 'usage:read'>;
  secret: string;
  workspaceId: string;
};
export type GetApiKeyParameters = { workspaceId: string; keyId: string };
export type GetApiKeyRequest = undefined;
export type GetApiKeyResponse = {
  createdAt: string;
  deprecatedAt: string | null;
  expiresAt: string | null;
  fingerprintSuffix: string | null;
  id: string;
  ipAllowlist: Array<string> | null;
  kind?: 'standard' | 'default' | 'test';
  lastUsedAt: string | null;
  name: string;
  prefix: string;
  projectId: string | null;
  revokedAt: string | null;
  scopes: Array<'execute' | 'jobs:read' | 'jobs:cancel' | 'projects:read' | 'usage:read'>;
  workspaceId: string;
};
export type RevokeApiKeyParameters = {
  workspaceId: string;
  keyId: string;
  'idempotency-key': string;
};
export type RevokeApiKeyRequest = undefined;
export type RevokeApiKeyResponse = undefined;
export type RegenerateApiKeyParameters = {
  workspaceId: string;
  keyId: string;
  'idempotency-key': string;
};
export type RegenerateApiKeyRequest = undefined;
export type RegenerateApiKeyResponse = {
  createdAt: string;
  deprecatedAt: string | null;
  expiresAt: string | null;
  fingerprintSuffix: string | null;
  id: string;
  ipAllowlist: Array<string> | null;
  kind?: 'standard' | 'default' | 'test';
  lastUsedAt: string | null;
  name: string;
  prefix: string;
  projectId: string | null;
  revokedAt: string | null;
  scopes: Array<'execute' | 'jobs:read' | 'jobs:cancel' | 'projects:read' | 'usage:read'>;
  secret: string;
  workspaceId: string;
};
export type RollApiKeyParameters = {
  workspaceId: string;
  keyId: string;
  'idempotency-key': string;
};
export type RollApiKeyRequest = undefined;
export type RollApiKeyResponse = {
  createdAt: string;
  deprecatedAt: string | null;
  expiresAt: string | null;
  fingerprintSuffix: string | null;
  id: string;
  ipAllowlist: Array<string> | null;
  kind?: 'standard' | 'default' | 'test';
  lastUsedAt: string | null;
  name: string;
  prefix: string;
  projectId: string | null;
  revokedAt: string | null;
  scopes: Array<'execute' | 'jobs:read' | 'jobs:cancel' | 'projects:read' | 'usage:read'>;
  secret: string;
  workspaceId: string;
};
export type RotateApiKeyParameters = {
  workspaceId: string;
  keyId: string;
  'idempotency-key': string;
};
export type RotateApiKeyRequest = undefined;
export type RotateApiKeyResponse = {
  createdAt: string;
  deprecatedAt: string | null;
  expiresAt: string | null;
  fingerprintSuffix: string | null;
  id: string;
  ipAllowlist: Array<string> | null;
  kind?: 'standard' | 'default' | 'test';
  lastUsedAt: string | null;
  name: string;
  prefix: string;
  projectId: string | null;
  revokedAt: string | null;
  scopes: Array<'execute' | 'jobs:read' | 'jobs:cancel' | 'projects:read' | 'usage:read'>;
  secret: string;
  workspaceId: string;
};
export type CreateBillingCheckoutParameters = { workspaceId: string; 'idempotency-key': string };
export type CreateBillingCheckoutRequest = {
  billingCycle?: 'monthly' | 'annual';
  planCode: string;
};
export type CreateBillingCheckoutResponse = { url: string };
export type ReconcileBillingCheckoutParameters = { workspaceId: string; 'idempotency-key': string };
export type ReconcileBillingCheckoutRequest = {
  intentId?: string;
  paymentId?: string;
  sessionId?: string;
};
export type ReconcileBillingCheckoutResponse = {
  boostCode?: string;
  planCode: string;
  planVersion: number;
  reconciled: boolean;
  status: 'active' | 'pending' | 'failed' | 'canceled' | 'past_due' | 'succeeded' | 'paid';
  topupCredits?: number;
  type?: 'subscription' | 'topup';
};
export type GetBillingInvoicesParameters = { workspaceId: string };
export type GetBillingInvoicesRequest = undefined;
export type GetBillingInvoicesResponse = {
  invoices: Array<{
    amountPaidCents: number;
    createdAt: string;
    currency: string;
    hostedInvoiceUrl: string | null;
    id: string;
    paidAt: string | null;
    periodEnd: string | null;
    periodStart: string | null;
    providerInvoiceId: string;
    status: 'paid' | 'succeeded' | 'open' | 'failed' | 'refunded' | 'void' | 'uncollectible';
  }>;
};
export type CreateBillingPortalParameters = { workspaceId: string; 'idempotency-key': string };
export type CreateBillingPortalRequest = undefined;
export type CreateBillingPortalResponse = { url: string };
export type PreviewBillingParameters = { workspaceId: string; 'idempotency-key': string };
export type PreviewBillingRequest = { billingCycle?: 'monthly' | 'annual'; planCode: string };
export type PreviewBillingResponse = {
  amountDueNowCents: number;
  amountDueNowCurrency: string;
  billingCycle: 'monthly' | 'annual';
  creditDelta: number;
  effectiveAt: string;
};
export type GetBillingSubscriptionParameters = { workspaceId: string; sync?: 'true' | 'false' };
export type GetBillingSubscriptionRequest = undefined;
export type GetBillingSubscriptionResponse = {
  cancelAtPeriodEnd: boolean;
  graceExpiresAt: string | null;
  pendingPlan: { effectiveAt: string; planCode: string; planVersion: number } | null;
  periodEnd: string | null;
  periodStart: string | null;
  planCode: string;
  planVersion: number;
  status:
    | 'none'
    | 'incomplete'
    | 'incomplete_expired'
    | 'trialing'
    | 'active'
    | 'past_due'
    | 'canceled'
    | 'unpaid'
    | 'paused';
  updatedAt: string;
  workspaceId: string;
};
export type CreateBillingTopupCheckoutParameters = {
  workspaceId: string;
  'idempotency-key': string;
};
export type CreateBillingTopupCheckoutRequest = {
  boostCode: '5k' | '25k' | '100k' | '500k' | '1m';
};
export type CreateBillingTopupCheckoutResponse = { url: string };
export type GetBillingTopupCatalogParameters = { workspaceId: string };
export type GetBillingTopupCatalogRequest = undefined;
export type GetBillingTopupCatalogResponse = {
  activeTopupCredits: number;
  earliestExpiresAt: string | null;
  eligible: boolean;
  ineligibleReason: string | null;
  tiers: Array<{
    amountCents: number;
    boostCode: '5k' | '25k' | '100k' | '500k' | '1m';
    costPerCredit: number;
    credits: number;
    currency: string;
    providerProductId: string;
    savingsPercent: number;
  }>;
  workspaceId: string;
};
export type GetWorkspaceDeletionParameters = { workspaceId: string };
export type GetWorkspaceDeletionRequest = undefined;
export type GetWorkspaceDeletionResponse = {
  completedAt: string | null;
  id: string;
  requestedAt: string;
  stage:
    | 'requested'
    | 'execution_stopped'
    | 'webhooks_disabled'
    | 'billing_detached'
    | 'artifacts_deleted'
    | 'metadata_anonymized_or_deleted'
    | 'retention_records_preserved'
    | 'completed';
  updatedAt: string;
  workspaceId: string;
};
export type ListWorkspaceInvitationsParameters = {
  workspaceId: string;
  limit?: number;
  cursor?: string;
};
export type ListWorkspaceInvitationsRequest = undefined;
export type ListWorkspaceInvitationsResponse = {
  data: Array<{
    createdAt: string;
    email: string;
    expiresAt: string | null;
    id: string;
    role: 'admin' | 'developer' | 'viewer';
    status: 'pending' | 'accepted' | 'revoked' | 'expired';
    updatedAt: string;
  }>;
  nextCursor: string | null;
};
export type CreateWorkspaceInvitationParameters = {
  workspaceId: string;
  'idempotency-key': string;
};
export type CreateWorkspaceInvitationRequest = {
  email: string;
  expiresInHours?: number | null;
  role: 'admin' | 'developer' | 'viewer';
};
export type CreateWorkspaceInvitationResponse = {
  createdAt: string;
  email: string;
  expiresAt: string | null;
  id: string;
  role: 'admin' | 'developer' | 'viewer';
  status: 'pending' | 'accepted' | 'revoked' | 'expired';
  token: string;
  updatedAt: string;
};
export type AcceptWorkspaceInvitationParameters = {
  workspaceId: string;
  'idempotency-key': string;
};
export type AcceptWorkspaceInvitationRequest = { token: string };
export type AcceptWorkspaceInvitationResponse = {
  createdAt: string;
  email: string;
  expiresAt: string | null;
  id: string;
  role: 'admin' | 'developer' | 'viewer';
  status: 'pending' | 'accepted' | 'revoked' | 'expired';
  updatedAt: string;
};
export type RevokeWorkspaceInvitationParameters = {
  workspaceId: string;
  invitationId: string;
  'idempotency-key': string;
};
export type RevokeWorkspaceInvitationRequest = undefined;
export type RevokeWorkspaceInvitationResponse = undefined;
export type LeaveWorkspaceParameters = { workspaceId: string; 'idempotency-key': string };
export type LeaveWorkspaceRequest = undefined;
export type LeaveWorkspaceResponse = undefined;
export type ListWorkspaceMembersParameters = {
  workspaceId: string;
  limit?: number;
  cursor?: string;
};
export type ListWorkspaceMembersRequest = undefined;
export type ListWorkspaceMembersResponse = {
  data: Array<{
    createdAt: string;
    displayName: string | null;
    email: string | null;
    role: 'owner' | 'admin' | 'developer' | 'viewer';
    updatedAt: string;
    userId: string;
  }>;
  nextCursor: string | null;
};
export type RemoveWorkspaceMemberParameters = {
  workspaceId: string;
  userId: string;
  'idempotency-key': string;
};
export type RemoveWorkspaceMemberRequest = undefined;
export type RemoveWorkspaceMemberResponse = undefined;
export type UpdateWorkspaceMemberParameters = {
  workspaceId: string;
  userId: string;
  'idempotency-key': string;
};
export type UpdateWorkspaceMemberRequest = { role: 'admin' | 'developer' | 'viewer' };
export type UpdateWorkspaceMemberResponse = {
  createdAt: string;
  displayName: string | null;
  email: string | null;
  role: 'owner' | 'admin' | 'developer' | 'viewer';
  updatedAt: string;
  userId: string;
};
export type TransferWorkspaceOwnershipParameters = {
  workspaceId: string;
  userId: string;
  'idempotency-key': string;
};
export type TransferWorkspaceOwnershipRequest = undefined;
export type TransferWorkspaceOwnershipResponse = {
  createdAt: string;
  displayName: string | null;
  email: string | null;
  role: 'owner' | 'admin' | 'developer' | 'viewer';
  updatedAt: string;
  userId: string;
};
export type GetWorkspaceOverviewParameters = { workspaceId: string };
export type GetWorkspaceOverviewRequest = undefined;
export type GetWorkspaceOverviewResponse = {
  activeJobs: Array<{
    artifactExpiresAt: string | null;
    artifactState: 'not_applicable' | 'pending' | 'ingesting' | 'complete' | 'expired' | 'review';
    cancellationRequestedAt: string | null;
    createdAt: string;
    executionTerminalAt: string | null;
    id: string;
    kind: 'compile' | 'crawl' | 'batch';
    progress: {
      completedItems: number;
      etaSeconds: number | null;
      failedItems: number;
      queuedItems: number;
      ratePerMinute: number | null;
    } | null;
    projectId: string | null;
    readyAt: string | null;
    reviewReason: string | null;
    status: 'queued' | 'running' | 'ingesting' | 'ready' | 'failed' | 'cancelled';
    targetUrl?: string | null;
    updatedAt: string;
    workspaceId: string;
  }>;
  counts: { apiKeys: number; projects: number; webhooks: number };
  onboarding: {
    hasConfiguredWebhook: boolean;
    hasCreatedApiKey: boolean;
    hasInvitedTeammate: boolean;
    hasRunCompile: boolean;
  };
  plan: {
    cancelAtPeriodEnd: boolean | null;
    code: string;
    graceExpiresAt: string | null;
    renewalAt: string | null;
    status: string | null;
  };
  recentErrors: Array<{
    artifactExpiresAt: string | null;
    artifactState: 'not_applicable' | 'pending' | 'ingesting' | 'complete' | 'expired' | 'review';
    cancellationRequestedAt: string | null;
    createdAt: string;
    executionTerminalAt: string | null;
    id: string;
    kind: 'compile' | 'crawl' | 'batch';
    progress: {
      completedItems: number;
      etaSeconds: number | null;
      failedItems: number;
      queuedItems: number;
      ratePerMinute: number | null;
    } | null;
    projectId: string | null;
    readyAt: string | null;
    reviewReason: string | null;
    status: 'queued' | 'running' | 'ingesting' | 'ready' | 'failed' | 'cancelled';
    targetUrl?: string | null;
    updatedAt: string;
    workspaceId: string;
  }>;
  recentJobs: Array<{
    artifactExpiresAt: string | null;
    artifactState: 'not_applicable' | 'pending' | 'ingesting' | 'complete' | 'expired' | 'review';
    cancellationRequestedAt: string | null;
    createdAt: string;
    executionTerminalAt: string | null;
    id: string;
    kind: 'compile' | 'crawl' | 'batch';
    progress: {
      completedItems: number;
      etaSeconds: number | null;
      failedItems: number;
      queuedItems: number;
      ratePerMinute: number | null;
    } | null;
    projectId: string | null;
    readyAt: string | null;
    reviewReason: string | null;
    status: 'queued' | 'running' | 'ingesting' | 'ready' | 'failed' | 'cancelled';
    targetUrl?: string | null;
    updatedAt: string;
    workspaceId: string;
  }>;
  usage: {
    allowance: number;
    consumed: number;
    dailyConsumed: Array<{ consumed: number; day: number }>;
    grantCreditsRemaining: number;
    periodEnd: string;
    periodStart: string;
    reserved: number;
  };
  workspaceId: string;
};
export type ListProjectsParameters = { workspaceId: string; limit?: number; cursor?: string };
export type ListProjectsRequest = undefined;
export type ListProjectsResponse = {
  data: Array<{
    createdAt: string;
    deletedAt: string | null;
    id: string;
    name: string;
    slug: string;
    status: 'active' | 'deleted';
    updatedAt: string;
    version: number;
    workspaceId: string;
  }>;
  nextCursor: string | null;
};
export type CreateProjectParameters = { workspaceId: string; 'idempotency-key': string };
export type CreateProjectRequest = { name: string; slug: string };
export type CreateProjectResponse = {
  createdAt: string;
  deletedAt: string | null;
  id: string;
  name: string;
  slug: string;
  status: 'active' | 'deleted';
  updatedAt: string;
  version: number;
  workspaceId: string;
};
export type GetProjectsStatsParameters = { workspaceId: string };
export type GetProjectsStatsRequest = undefined;
export type GetProjectsStatsResponse = {
  [key: string]: {
    activeJobs: number;
    creditsConsumed: number;
    failedJobs: number;
    lastActivityAt: string | null;
    totalJobs: number;
  };
};
export type GetProjectParameters = { workspaceId: string; projectId: string };
export type GetProjectRequest = undefined;
export type GetProjectResponse = {
  createdAt: string;
  deletedAt: string | null;
  id: string;
  name: string;
  slug: string;
  status: 'active' | 'deleted';
  updatedAt: string;
  version: number;
  workspaceId: string;
};
export type DeleteProjectParameters = {
  workspaceId: string;
  projectId: string;
  'idempotency-key': string;
};
export type DeleteProjectRequest = undefined;
export type DeleteProjectResponse = undefined;
export type UpdateProjectParameters = {
  workspaceId: string;
  projectId: string;
  'idempotency-key': string;
};
export type UpdateProjectRequest = { name?: string; slug?: string };
export type UpdateProjectResponse = {
  createdAt: string;
  deletedAt: string | null;
  id: string;
  name: string;
  slug: string;
  status: 'active' | 'deleted';
  updatedAt: string;
  version: number;
  workspaceId: string;
};
export type GetUsageParameters = { workspaceId: string; periodStart?: string; projectId?: string };
export type GetUsageRequest = undefined;
export type GetUsageResponse = {
  accounts: Array<{
    allowance: number;
    blockReason: string | null;
    blockedAt: string | null;
    consumed: number;
    metric: 'credits';
    periodEnd: string;
    periodStart: string;
    reserved: number;
    updatedAt: string;
  }>;
  grants: Array<{
    consumed: number;
    expiresAt: string | null;
    id?: string;
    metric: 'credits';
    source?: string;
    units: number;
  }>;
  plan: { code: string; version: number };
};
export type ListUsageLedgerParameters = {
  workspaceId: string;
  limit?: number;
  cursor?: string;
  metric?: 'credits';
  projectId?: string;
};
export type ListUsageLedgerRequest = undefined;
export type ListUsageLedgerResponse = {
  data: Array<{
    consumedDelta: number;
    createdAt: string;
    entryType: 'reserve' | 'settle' | 'release' | 'adjustment' | 'credit';
    eventKey: string;
    id: string;
    metadata: { [key: string]: JsonValue } | null;
    metric: 'credits';
    periodStart: string;
    reservationId: string | null;
    reservedDelta: number;
    source: string;
  }>;
  nextCursor: string | null;
};
export type ListWorkspaceWebhookDeliveriesParameters = {
  workspaceId: string;
  limit?: number;
  cursor?: string;
  endpointId?: string;
  jobId?: string;
  status?: 'pending' | 'retrying' | 'succeeded' | 'dead';
};
export type ListWorkspaceWebhookDeliveriesRequest = undefined;
export type ListWorkspaceWebhookDeliveriesResponse = {
  data: Array<{
    attemptCount: number;
    createdAt: string;
    destinationUrl?: string;
    endpointId?: string | null;
    eventId: string;
    eventType:
      | 'job.created'
      | 'job.started'
      | 'job.ready'
      | 'job.failed'
      | 'job.cancelled'
      | 'job.results_ready'
      | 'crawl.page_completed'
      | 'api_key.created'
      | 'api_key.revoked'
      | 'workspace.member.invited'
      | 'workspace.member.removed'
      | 'billing.subscription.updated'
      | 'webhook.test';
    id: string;
    jobId?: string | null;
    lastError: string | null;
    lastStatusCode: number | null;
    nextAttemptAt: string | null;
    responseCompletedAt: string | null;
    sourceType?: 'endpoint' | 'inline';
    status: 'pending' | 'retrying' | 'succeeded' | 'dead';
    updatedAt: string;
  }>;
  nextCursor: string | null;
};
export type GetWorkspaceWebhookDeliveryParameters = { workspaceId: string; deliveryId: string };
export type GetWorkspaceWebhookDeliveryRequest = undefined;
export type GetWorkspaceWebhookDeliveryResponse = {
  attemptCount: number;
  createdAt: string;
  destinationUrl?: string;
  endpointId?: string | null;
  eventId: string;
  eventType:
    | 'job.created'
    | 'job.started'
    | 'job.ready'
    | 'job.failed'
    | 'job.cancelled'
    | 'job.results_ready'
    | 'crawl.page_completed'
    | 'api_key.created'
    | 'api_key.revoked'
    | 'workspace.member.invited'
    | 'workspace.member.removed'
    | 'billing.subscription.updated'
    | 'webhook.test';
  id: string;
  jobId?: string | null;
  lastError: string | null;
  lastStatusCode: number | null;
  nextAttemptAt: string | null;
  responseCompletedAt: string | null;
  sourceType?: 'endpoint' | 'inline';
  status: 'pending' | 'retrying' | 'succeeded' | 'dead';
  updatedAt: string;
};
export type ListWorkspaceWebhookDeliveryAttemptsParameters = {
  workspaceId: string;
  deliveryId: string;
};
export type ListWorkspaceWebhookDeliveryAttemptsRequest = undefined;
export type ListWorkspaceWebhookDeliveryAttemptsResponse = Array<{
  attemptNumber: number;
  completedAt: string | null;
  errorCode: string | null;
  outcome: string;
  responseExcerpt: string | null;
  startedAt: string;
  statusCode: number | null;
}>;
export type RedeliverWorkspaceWebhookDeliveryParameters = {
  workspaceId: string;
  deliveryId: string;
  'idempotency-key': string;
};
export type RedeliverWorkspaceWebhookDeliveryRequest = undefined;
export type RedeliverWorkspaceWebhookDeliveryResponse = { deliveryId: string };
export type GetWorkspaceWebhookSecretParameters = { workspaceId: string };
export type GetWorkspaceWebhookSecretRequest = undefined;
export type GetWorkspaceWebhookSecretResponse = { secret: string; version: number };
export type RotateWorkspaceWebhookSecretParameters = {
  workspaceId: string;
  'idempotency-key': string;
};
export type RotateWorkspaceWebhookSecretRequest = undefined;
export type RotateWorkspaceWebhookSecretResponse = {
  gracePeriodSeconds: number;
  secret: string;
  version: number;
};
export type ListWebhookEndpointsParameters = {
  workspaceId: string;
  limit?: number;
  cursor?: string;
};
export type ListWebhookEndpointsRequest = undefined;
export type ListWebhookEndpointsResponse = {
  data: Array<{
    configVersion: number;
    consecutiveFailureCount?: number;
    createdAt: string;
    events: Array<
      | 'job.created'
      | 'job.started'
      | 'job.ready'
      | 'job.failed'
      | 'job.cancelled'
      | 'job.results_ready'
      | 'crawl.page_completed'
      | 'api_key.created'
      | 'api_key.revoked'
      | 'workspace.member.invited'
      | 'workspace.member.removed'
      | 'billing.subscription.updated'
      | 'webhook.test'
    >;
    id: string;
    lastFailureAt?: string | null;
    lastSuccessAt?: string | null;
    projectId?: string | null;
    signingSecretVersion: number;
    status: 'active' | 'disabled';
    updatedAt: string;
    url: string;
    workspaceId: string;
  }>;
  nextCursor: string | null;
};
export type CreateWebhookEndpointParameters = { workspaceId: string; 'idempotency-key': string };
export type CreateWebhookEndpointRequest = {
  events: Array<
    | 'job.created'
    | 'job.started'
    | 'job.ready'
    | 'job.failed'
    | 'job.cancelled'
    | 'job.results_ready'
    | 'crawl.page_completed'
    | 'api_key.created'
    | 'api_key.revoked'
    | 'workspace.member.invited'
    | 'workspace.member.removed'
    | 'billing.subscription.updated'
    | 'webhook.test'
  >;
  projectId?: string;
  url: string;
};
export type CreateWebhookEndpointResponse = {
  configVersion: number;
  consecutiveFailureCount?: number;
  createdAt: string;
  events: Array<
    | 'job.created'
    | 'job.started'
    | 'job.ready'
    | 'job.failed'
    | 'job.cancelled'
    | 'job.results_ready'
    | 'crawl.page_completed'
    | 'api_key.created'
    | 'api_key.revoked'
    | 'workspace.member.invited'
    | 'workspace.member.removed'
    | 'billing.subscription.updated'
    | 'webhook.test'
  >;
  id: string;
  lastFailureAt?: string | null;
  lastSuccessAt?: string | null;
  projectId?: string | null;
  secret: string;
  signingSecretVersion: number;
  status: 'active' | 'disabled';
  updatedAt: string;
  url: string;
  workspaceId: string;
};
export type GetWebhookEndpointParameters = { workspaceId: string; endpointId: string };
export type GetWebhookEndpointRequest = undefined;
export type GetWebhookEndpointResponse = {
  configVersion: number;
  consecutiveFailureCount?: number;
  createdAt: string;
  events: Array<
    | 'job.created'
    | 'job.started'
    | 'job.ready'
    | 'job.failed'
    | 'job.cancelled'
    | 'job.results_ready'
    | 'crawl.page_completed'
    | 'api_key.created'
    | 'api_key.revoked'
    | 'workspace.member.invited'
    | 'workspace.member.removed'
    | 'billing.subscription.updated'
    | 'webhook.test'
  >;
  id: string;
  lastFailureAt?: string | null;
  lastSuccessAt?: string | null;
  projectId?: string | null;
  signingSecretVersion: number;
  status: 'active' | 'disabled';
  updatedAt: string;
  url: string;
  workspaceId: string;
};
export type DeleteWebhookEndpointParameters = {
  workspaceId: string;
  endpointId: string;
  'idempotency-key': string;
};
export type DeleteWebhookEndpointRequest = undefined;
export type DeleteWebhookEndpointResponse = undefined;
export type UpdateWebhookEndpointParameters = {
  workspaceId: string;
  endpointId: string;
  'idempotency-key': string;
};
export type UpdateWebhookEndpointRequest =
  | {
      configVersion: number;
      events?: Array<
        | 'job.created'
        | 'job.started'
        | 'job.ready'
        | 'job.failed'
        | 'job.cancelled'
        | 'job.results_ready'
        | 'crawl.page_completed'
        | 'api_key.created'
        | 'api_key.revoked'
        | 'workspace.member.invited'
        | 'workspace.member.removed'
        | 'billing.subscription.updated'
        | 'webhook.test'
      >;
      rotateSecret?: boolean;
      status?: 'active' | 'disabled';
      url: string;
    }
  | {
      configVersion: number;
      events: Array<
        | 'job.created'
        | 'job.started'
        | 'job.ready'
        | 'job.failed'
        | 'job.cancelled'
        | 'job.results_ready'
        | 'crawl.page_completed'
        | 'api_key.created'
        | 'api_key.revoked'
        | 'workspace.member.invited'
        | 'workspace.member.removed'
        | 'billing.subscription.updated'
        | 'webhook.test'
      >;
      rotateSecret?: boolean;
      status?: 'active' | 'disabled';
      url?: string;
    }
  | {
      configVersion: number;
      events?: Array<
        | 'job.created'
        | 'job.started'
        | 'job.ready'
        | 'job.failed'
        | 'job.cancelled'
        | 'job.results_ready'
        | 'crawl.page_completed'
        | 'api_key.created'
        | 'api_key.revoked'
        | 'workspace.member.invited'
        | 'workspace.member.removed'
        | 'billing.subscription.updated'
        | 'webhook.test'
      >;
      rotateSecret?: boolean;
      status: 'active' | 'disabled';
      url?: string;
    }
  | {
      configVersion: number;
      events?: Array<
        | 'job.created'
        | 'job.started'
        | 'job.ready'
        | 'job.failed'
        | 'job.cancelled'
        | 'job.results_ready'
        | 'crawl.page_completed'
        | 'api_key.created'
        | 'api_key.revoked'
        | 'workspace.member.invited'
        | 'workspace.member.removed'
        | 'billing.subscription.updated'
        | 'webhook.test'
      >;
      rotateSecret: true;
      status?: 'active' | 'disabled';
      url?: string;
    };
export type UpdateWebhookEndpointResponse = {
  configVersion: number;
  consecutiveFailureCount?: number;
  createdAt: string;
  events: Array<
    | 'job.created'
    | 'job.started'
    | 'job.ready'
    | 'job.failed'
    | 'job.cancelled'
    | 'job.results_ready'
    | 'crawl.page_completed'
    | 'api_key.created'
    | 'api_key.revoked'
    | 'workspace.member.invited'
    | 'workspace.member.removed'
    | 'billing.subscription.updated'
    | 'webhook.test'
  >;
  id: string;
  lastFailureAt?: string | null;
  lastSuccessAt?: string | null;
  projectId?: string | null;
  secret?: string;
  signingSecretVersion: number;
  status: 'active' | 'disabled';
  updatedAt: string;
  url: string;
  workspaceId: string;
};
export type ListWebhookDeliveriesParameters = {
  workspaceId: string;
  endpointId: string;
  limit?: number;
  cursor?: string;
};
export type ListWebhookDeliveriesRequest = undefined;
export type ListWebhookDeliveriesResponse = {
  data: Array<{
    attemptCount: number;
    createdAt: string;
    destinationUrl?: string;
    endpointId?: string | null;
    eventId: string;
    eventType:
      | 'job.created'
      | 'job.started'
      | 'job.ready'
      | 'job.failed'
      | 'job.cancelled'
      | 'job.results_ready'
      | 'crawl.page_completed'
      | 'api_key.created'
      | 'api_key.revoked'
      | 'workspace.member.invited'
      | 'workspace.member.removed'
      | 'billing.subscription.updated'
      | 'webhook.test';
    id: string;
    jobId?: string | null;
    lastError: string | null;
    lastStatusCode: number | null;
    nextAttemptAt: string | null;
    responseCompletedAt: string | null;
    sourceType?: 'endpoint' | 'inline';
    status: 'pending' | 'retrying' | 'succeeded' | 'dead';
    updatedAt: string;
  }>;
  nextCursor: string | null;
};
export type RedeliverWebhookDeliveryParameters = {
  workspaceId: string;
  endpointId: string;
  deliveryId: string;
  'idempotency-key': string;
};
export type RedeliverWebhookDeliveryRequest = undefined;
export type RedeliverWebhookDeliveryResponse = { deliveryId: string };
export type SendWebhookTestEventParameters = {
  workspaceId: string;
  endpointId: string;
  'idempotency-key': string;
};
export type SendWebhookTestEventRequest = {
  eventType:
    | 'job.created'
    | 'job.started'
    | 'job.ready'
    | 'job.failed'
    | 'job.cancelled'
    | 'job.results_ready'
    | 'crawl.page_completed'
    | 'api_key.created'
    | 'api_key.revoked'
    | 'workspace.member.invited'
    | 'workspace.member.removed'
    | 'billing.subscription.updated'
    | 'webhook.test';
};
export type SendWebhookTestEventResponse = { deliveryId: string; eventId: string };
export interface OperationTypes {
  createBatch: {
    parameters: CreateBatchParameters;
    request: CreateBatchRequest;
    response: CreateBatchResponse;
  };
  compileUrl: {
    parameters: CompileUrlParameters;
    request: CompileUrlRequest;
    response: CompileUrlResponse;
  };
  createCrawl: {
    parameters: CreateCrawlParameters;
    request: CreateCrawlRequest;
    response: CreateCrawlResponse;
  };
  listJobs: {
    parameters: ListJobsParameters;
    request: ListJobsRequest;
    response: ListJobsResponse;
  };
  bulkCancelJobs: {
    parameters: BulkCancelJobsParameters;
    request: BulkCancelJobsRequest;
    response: BulkCancelJobsResponse;
  };
  getJob: { parameters: GetJobParameters; request: GetJobRequest; response: GetJobResponse };
  cancelJob: {
    parameters: CancelJobParameters;
    request: CancelJobRequest;
    response: CancelJobResponse;
  };
  listJobErrors: {
    parameters: ListJobErrorsParameters;
    request: ListJobErrorsRequest;
    response: ListJobErrorsResponse;
  };
  listJobResults: {
    parameters: ListJobResultsParameters;
    request: ListJobResultsRequest;
    response: ListJobResultsResponse;
  };
  mapUrl: { parameters: MapUrlParameters; request: MapUrlRequest; response: MapUrlResponse };
  scrapeUrl: {
    parameters: ScrapeUrlParameters;
    request: ScrapeUrlRequest;
    response: ScrapeUrlResponse;
  };
  getWorkspaceOverview: {
    parameters: GetWorkspaceOverviewParameters;
    request: GetWorkspaceOverviewRequest;
    response: GetWorkspaceOverviewResponse;
  };
  listProjects: {
    parameters: ListProjectsParameters;
    request: ListProjectsRequest;
    response: ListProjectsResponse;
  };
  getProjectsStats: {
    parameters: GetProjectsStatsParameters;
    request: GetProjectsStatsRequest;
    response: GetProjectsStatsResponse;
  };
  getProject: {
    parameters: GetProjectParameters;
    request: GetProjectRequest;
    response: GetProjectResponse;
  };
  getUsage: {
    parameters: GetUsageParameters;
    request: GetUsageRequest;
    response: GetUsageResponse;
  };
  listUsageLedger: {
    parameters: ListUsageLedgerParameters;
    request: ListUsageLedgerRequest;
    response: ListUsageLedgerResponse;
  };
}
export type OperationId = keyof OperationTypes;
export const operationMetadata = {
  createBatch: {
    method: 'POST',
    path: '/v1/batches',
    parameters: [
      {
        name: 'idempotency-key',
        in: 'header',
        required: false,
      },
    ],
  },
  compileUrl: {
    method: 'POST',
    path: '/v1/compile',
    parameters: [
      {
        name: 'idempotency-key',
        in: 'header',
        required: true,
      },
    ],
  },
  createCrawl: {
    method: 'POST',
    path: '/v1/crawls',
    parameters: [
      {
        name: 'idempotency-key',
        in: 'header',
        required: false,
      },
    ],
  },
  listJobs: {
    method: 'GET',
    path: '/v1/jobs',
    parameters: [
      {
        name: 'limit',
        in: 'query',
        required: false,
      },
      {
        name: 'cursor',
        in: 'query',
        required: false,
      },
      {
        name: 'status',
        in: 'query',
        required: false,
      },
      {
        name: 'kind',
        in: 'query',
        required: false,
      },
      {
        name: 'projectId',
        in: 'query',
        required: false,
      },
    ],
  },
  bulkCancelJobs: {
    method: 'POST',
    path: '/v1/jobs/cancel',
    parameters: [
      {
        name: 'idempotency-key',
        in: 'header',
        required: true,
      },
    ],
  },
  getJob: {
    method: 'GET',
    path: '/v1/jobs/{jobId}',
    parameters: [
      {
        name: 'jobId',
        in: 'path',
        required: true,
      },
    ],
  },
  cancelJob: {
    method: 'DELETE',
    path: '/v1/jobs/{jobId}',
    parameters: [
      {
        name: 'jobId',
        in: 'path',
        required: true,
      },
      {
        name: 'idempotency-key',
        in: 'header',
        required: true,
      },
    ],
  },
  listJobErrors: {
    method: 'GET',
    path: '/v1/jobs/{jobId}/errors',
    parameters: [
      {
        name: 'jobId',
        in: 'path',
        required: true,
      },
      {
        name: 'limit',
        in: 'query',
        required: false,
      },
      {
        name: 'cursor',
        in: 'query',
        required: false,
      },
    ],
  },
  listJobResults: {
    method: 'GET',
    path: '/v1/jobs/{jobId}/results',
    parameters: [
      {
        name: 'jobId',
        in: 'path',
        required: true,
      },
      {
        name: 'limit',
        in: 'query',
        required: false,
      },
      {
        name: 'cursor',
        in: 'query',
        required: false,
      },
    ],
  },
  mapUrl: {
    method: 'POST',
    path: '/v1/map',
    parameters: [
      {
        name: 'idempotency-key',
        in: 'header',
        required: false,
      },
    ],
  },
  scrapeUrl: {
    method: 'POST',
    path: '/v1/scrape',
    parameters: [
      {
        name: 'idempotency-key',
        in: 'header',
        required: false,
      },
    ],
  },
  getWorkspaceOverview: {
    method: 'GET',
    path: '/v1/workspaces/{workspaceId}/overview',
    parameters: [
      {
        name: 'workspaceId',
        in: 'path',
        required: true,
      },
    ],
  },
  listProjects: {
    method: 'GET',
    path: '/v1/workspaces/{workspaceId}/projects',
    parameters: [
      {
        name: 'workspaceId',
        in: 'path',
        required: true,
      },
      {
        name: 'limit',
        in: 'query',
        required: false,
      },
      {
        name: 'cursor',
        in: 'query',
        required: false,
      },
    ],
  },
  getProjectsStats: {
    method: 'GET',
    path: '/v1/workspaces/{workspaceId}/projects-stats',
    parameters: [
      {
        name: 'workspaceId',
        in: 'path',
        required: true,
      },
    ],
  },
  getProject: {
    method: 'GET',
    path: '/v1/workspaces/{workspaceId}/projects/{projectId}',
    parameters: [
      {
        name: 'workspaceId',
        in: 'path',
        required: true,
      },
      {
        name: 'projectId',
        in: 'path',
        required: true,
      },
    ],
  },
  getUsage: {
    method: 'GET',
    path: '/v1/workspaces/{workspaceId}/usage',
    parameters: [
      {
        name: 'workspaceId',
        in: 'path',
        required: true,
      },
      {
        name: 'periodStart',
        in: 'query',
        required: false,
      },
      {
        name: 'projectId',
        in: 'query',
        required: false,
      },
    ],
  },
  listUsageLedger: {
    method: 'GET',
    path: '/v1/workspaces/{workspaceId}/usage/ledger',
    parameters: [
      {
        name: 'workspaceId',
        in: 'path',
        required: true,
      },
      {
        name: 'limit',
        in: 'query',
        required: false,
      },
      {
        name: 'cursor',
        in: 'query',
        required: false,
      },
      {
        name: 'metric',
        in: 'query',
        required: false,
      },
      {
        name: 'projectId',
        in: 'query',
        required: false,
      },
    ],
  },
} as const;
export interface RawArguments<I extends OperationId> {
  parameters: OperationTypes[I]['parameters'];
  body?: OperationTypes[I]['request'];
}
export interface TransportResponse<T> {
  status: number;
  value: T;
  location?: string;
  retryAfterSeconds?: number;
  replayed: boolean;
  data?: any;
  markdown?: any;
  metadata?: any;
  links?: any;
}
export interface AtlasConfig {
  apiKey?: string;
  workspaceId?: string;
  baseUrl?: string;
  timeout?: number;
}
export class AtlasApiError extends Error {
  constructor(public readonly problem: Problem) {
    super(problem.detail || problem.title);
    this.name = 'AtlasApiError';
  }
  get code(): string {
    return this.problem.code;
  }
  get status(): number {
    return this.problem.status;
  }
  get requestId(): string {
    return this.problem.requestId;
  }
  get retryable(): boolean {
    return this.problem.retryable;
  }
  get invalidParams(): Problem['invalidParams'] {
    return this.problem.invalidParams;
  }
}
export const AtlasError = AtlasApiError;
export type AtlasError = AtlasApiError;
export function isCompleted(job: { status: string; artifactState?: string | null }): boolean {
  return (
    job.status === 'ready' ||
    job.status === 'failed' ||
    job.status === 'cancelled' ||
    job.artifactState === 'review'
  );
}
export class AtlasClient {
  private readonly config: {
    apiKey?: string;
    workspaceId?: string;
    baseUrl: string;
    timeout: number;
  };
  constructor(config: AtlasConfig = {}) {
    const env = typeof process !== 'undefined' && process?.env ? process.env : {};
    this.config = {
      apiKey: config.apiKey ?? env.ATLAS_API_KEY,
      workspaceId: config.workspaceId ?? env.ATLAS_WORKSPACE_ID,
      baseUrl: (config.baseUrl ?? env.ATLAS_BASE_URL ?? 'https://api.atlas-compiler.com').replace(
        /[/]$/,
        '',
      ),
      timeout: config.timeout ?? 30000,
    };
  }
  raw<I extends OperationId>(
    id: I,
    args: RawArguments<I>,
  ): Promise<TransportResponse<OperationTypes[I]['response']>> {
    return this.request(id, args);
  }
  scrape(input: ScrapeUrlRequest, idempotencyKey?: string) {
    return this.raw('scrapeUrl', {
      parameters: idempotencyKey ? { 'idempotency-key': idempotencyKey } : {},
      body: input,
    });
  }
  compile(input: CompileUrlRequest, idempotencyKey?: string) {
    const key =
      idempotencyKey ||
      (typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : ['req_', Math.random().toString(36).slice(2), Date.now().toString(36)].join(''));
    return this.raw('compileUrl', { parameters: { 'idempotency-key': key }, body: input });
  }
  map(input: MapUrlRequest, idempotencyKey?: string) {
    return this.raw('mapUrl', {
      parameters: idempotencyKey ? { 'idempotency-key': idempotencyKey } : {},
      body: input,
    });
  }
  createCrawl(input: CreateCrawlRequest, idempotencyKey?: string) {
    return this.raw('createCrawl', {
      parameters: idempotencyKey ? { 'idempotency-key': idempotencyKey } : {},
      body: input,
    });
  }
  createBatch(input: CreateBatchRequest, idempotencyKey?: string) {
    return this.raw('createBatch', {
      parameters: idempotencyKey ? { 'idempotency-key': idempotencyKey } : {},
      body: input,
    });
  }
  getJob(jobId: string) {
    return this.raw('getJob', { parameters: { jobId } });
  }
  cancelJob(jobId: string, idempotencyKey?: string) {
    const key =
      idempotencyKey ||
      (typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : ['req_', Math.random().toString(36).slice(2), Date.now().toString(36)].join(''));
    return this.raw('cancelJob', { parameters: { jobId, 'idempotency-key': key } });
  }
  listJobs(query: ListJobsParameters = {}) {
    return this.raw('listJobs', { parameters: query });
  }
  bulkCancelJobs(input: BulkCancelJobsRequest, idempotencyKey?: string) {
    const key =
      idempotencyKey ||
      (typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : ['req_', Math.random().toString(36).slice(2), Date.now().toString(36)].join(''));
    return this.raw('bulkCancelJobs', { parameters: { 'idempotency-key': key }, body: input });
  }
  listJobResults(jobId: string, query: { cursor?: string; limit?: number } = {}) {
    return this.raw('listJobResults', { parameters: { jobId, ...query } });
  }
  listJobErrors(jobId: string, query: { cursor?: string; limit?: number } = {}) {
    return this.raw('listJobErrors', { parameters: { jobId, ...query } });
  }
  getWorkspaceOverview(workspaceId = this.config.workspaceId) {
    if (!workspaceId) throw new TypeError('workspaceId is required for getWorkspaceOverview');
    return this.raw('getWorkspaceOverview', { parameters: { workspaceId } });
  }
  listProjects(
    workspaceId = this.config.workspaceId,
    query: { cursor?: string; limit?: number } = {},
  ) {
    if (!workspaceId) throw new TypeError('workspaceId is required for listProjects');
    return this.raw('listProjects', { parameters: { workspaceId, ...query } });
  }
  getProject(projectId: string, workspaceId = this.config.workspaceId) {
    if (!workspaceId) throw new TypeError('workspaceId is required for getProject');
    return this.raw('getProject', { parameters: { workspaceId, projectId } });
  }
  getUsage(workspaceId = this.config.workspaceId) {
    if (!workspaceId) throw new TypeError('workspaceId is required for getUsage');
    return this.raw('getUsage', { parameters: { workspaceId } });
  }
  listUsageLedger(
    workspaceId = this.config.workspaceId,
    query: { cursor?: string; limit?: number } = {},
  ) {
    if (!workspaceId) throw new TypeError('workspaceId is required for listUsageLedger');
    return this.raw('listUsageLedger', { parameters: { workspaceId, ...query } });
  }
  async waitForJob(jobId: string, intervalMs = 1000, maxWaitMs = 60000): Promise<GetJobResponse> {
    if (intervalMs <= 0 || maxWaitMs <= 0) throw new Error('Polling intervals must be positive');
    const deadline = Date.now() + maxWaitMs;
    while (Date.now() < deadline) {
      const result = await this.getJob(jobId);
      if (isCompleted(result.value)) return result.value;
      const delay = result.retryAfterSeconds ? result.retryAfterSeconds * 1000 : intervalMs;
      const remaining = deadline - Date.now();
      if (remaining <= 0) break;
      await new Promise((resolve) => setTimeout(resolve, Math.min(delay, remaining)));
    }
    throw new Error(['Job ', jobId, ' did not complete within ', maxWaitMs, 'ms'].join(''));
  }
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: generated transport covers all OpenAPI parameter locations.
  private async request<I extends OperationId>(
    id: I,
    args: RawArguments<I>,
  ): Promise<TransportResponse<OperationTypes[I]['response']>> {
    const operation = operationMetadata[id];
    let path: string = operation.path;
    const query = new URLSearchParams();
    const headers: Record<string, string> = { accept: 'application/json' };
    for (const parameter of operation.parameters) {
      const value = (args.parameters as Record<string, unknown>)[parameter.name];
      if (value === undefined) {
        if (parameter.required)
          throw new TypeError(['Missing required parameter ', parameter.name].join(''));
        continue;
      }
      if (parameter.in === 'path')
        path = path.replace(['{', parameter.name, '}'].join(''), encodeURIComponent(String(value)));
      else if (parameter.in === 'query') query.set(parameter.name, String(value));
      else if (parameter.in === 'header') headers[parameter.name] = String(value);
    }
    if (this.config.apiKey) headers.authorization = ['Bearer ', this.config.apiKey].join('');
    if (args.body !== undefined) headers['content-type'] = 'application/json';
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeout ?? 30000);
    try {
      const suffix = query.size ? ['?', query].join('') : '';
      const requestUrl = [this.config.baseUrl, path, suffix].join('');
      const response = await fetch(requestUrl, {
        method: operation.method,
        headers,
        body: args.body === undefined ? undefined : JSON.stringify(args.body),
        signal: controller.signal,
      });
      const text = response.status === 204 ? '' : await response.text();
      let value: unknown;
      try {
        value = text ? JSON.parse(text) : undefined;
      } catch {
        value = undefined;
      }
      if (!response.ok) {
        const candidate =
          value && typeof value === 'object' && !Array.isArray(value)
            ? (value as Partial<Problem>)
            : undefined;
        const problem =
          candidate &&
          typeof candidate.type === 'string' &&
          typeof candidate.title === 'string' &&
          typeof candidate.status === 'number' &&
          typeof candidate.detail === 'string' &&
          typeof candidate.code === 'string' &&
          typeof candidate.instance === 'string' &&
          typeof candidate.requestId === 'string' &&
          typeof candidate.retryable === 'boolean'
            ? (candidate as Problem)
            : {
                type: 'about:blank',
                title: 'HTTP request failed',
                status: response.status,
                detail: text || response.statusText,
                code: 'http_error',
                instance: '',
                requestId: '',
                retryable: false,
              };
        throw new AtlasApiError(problem);
      }
      if (response.status !== 204 && !text)
        throw new Error('Atlas returned an empty success response');
      if (text && value === undefined)
        throw new Error('Atlas returned a non-JSON success response');
      const resultObj: TransportResponse<OperationTypes[I]['response']> = {
        status: response.status,
        value: value as OperationTypes[I]['response'],
        location: response.headers.get('location') ?? undefined,
        retryAfterSeconds: Number(response.headers.get('retry-after')) || undefined,
        replayed: response.headers.get('idempotent-replayed') === 'true',
      };
      if (value && typeof value === 'object') {
        if ('data' in value)
          Object.defineProperty(resultObj, 'data', {
            get: () => (value as Record<string, unknown>).data,
            enumerable: false,
          });
        if ('markdown' in value)
          Object.defineProperty(resultObj, 'markdown', {
            get: () => (value as Record<string, unknown>).markdown,
            enumerable: false,
          });
        else if (
          'data' in value &&
          typeof (value as Record<string, unknown>).data === 'object' &&
          (value as Record<string, unknown>).data !== null &&
          'markdown' in ((value as Record<string, unknown>).data as Record<string, unknown>)
        )
          Object.defineProperty(resultObj, 'markdown', {
            get: () =>
              ((value as Record<string, unknown>).data as Record<string, unknown>).markdown,
            enumerable: false,
          });
        if ('metadata' in value)
          Object.defineProperty(resultObj, 'metadata', {
            get: () => (value as Record<string, unknown>).metadata,
            enumerable: false,
          });
      }
      return resultObj;
    } finally {
      clearTimeout(timer);
    }
  }
}

export * from './webhooks.js';
