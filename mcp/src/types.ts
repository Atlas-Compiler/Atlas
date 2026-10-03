/**
 * Atlas Model Context Protocol (MCP) Shared Types
 */

export interface AtlasClientContext {
  apiKey?: string;
  workspaceId?: string;
  userId?: string;
  baseUrl?: string;
  fetch?: typeof fetch;
}

export interface AtlasScrapeArgs {
  url: string;
  formats?: ('markdown' | 'links' | 'text')[];
  max_output_chars?: number;
  timeout_ms?: number;
}

export interface AtlasScrapeResult {
  url: string;
  title: string;
  markdown?: string;
  text?: string;
  links?: Array<{ url: string; text: string }>;
  stats: {
    character_count: number;
    word_count: number;
    read_time_seconds: number;
  };
  truncated: boolean;
  resource_uri?: string;
}

export interface AtlasCompileArgs {
  url: string;
  format?: 'markdown' | 'semantic' | 'markdown+links';
  max_output_chars?: number;
  force_fresh?: boolean;
}

export interface AtlasHeading {
  level: number;
  text: string;
  id?: string;
  resource_uri?: string;
}

export interface AtlasCompileResult {
  url: string;
  compilation_id: string;
  title: string;
  markdown?: string;
  ast?: Record<string, unknown>;
  headings?: AtlasHeading[];
  resources: {
    compiled_artifact_uri: string;
    ast_uri?: string;
  };
  stats: {
    character_count: number;
    tokens_saved_pct?: number;
    compilation_time_ms: number;
  };
  truncated: boolean;
}

export interface AtlasMapArgs {
  url: string;
  limit?: number;
  include_subdomains?: boolean;
  sitemap?: 'include' | 'skip' | 'only';
}

export interface AtlasMapResult {
  root_url: string;
  urls: string[];
  count: number;
  sitemaps_found: string[];
  duration_ms: number;
}

export interface AtlasBatchCompileArgs {
  urls: string[];
  format?: 'markdown' | 'semantic' | 'markdown+links';
  max_output_chars_per_page?: number;
}

export interface AtlasBatchItemResult {
  url: string;
  status: 'success' | 'failed';
  compilation_id?: string;
  title?: string;
  markdown?: string;
  resource_uri?: string;
  character_count?: number;
  error?: string;
}

export interface AtlasBatchCompileResult {
  total_requested: number;
  successful: number;
  failed: number;
  results: AtlasBatchItemResult[];
}

export interface AtlasCrawlArgs {
  url: string;
  max_pages?: number;
  max_depth?: number;
  include_paths?: string[];
  exclude_paths?: string[];
}

export interface AtlasCrawlPageResult {
  url: string;
  title: string;
  depth: number;
  compilation_id?: string;
  resource_uri: string;
  character_count?: number;
}

export interface AtlasCrawlResult {
  crawl_id: string;
  root_url: string;
  pages_crawled: number;
  pages_failed: number;
  summary_markdown: string;
  pages: AtlasCrawlPageResult[];
  duration_ms: number;
}
