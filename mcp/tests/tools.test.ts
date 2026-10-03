import { InMemoryTransport } from '@modelcontextprotocol/server';
import { describe, expect, it } from 'vitest';
import { createAtlasMcpServer } from '../src/server';

describe('Atlas MCP Tools Logic & Formatting Suite', () => {
  it('truncates atlas_compile output cleanly and appends TOC when exceeding character limit', async () => {
    // Generate a long markdown text exceeding 2000 chars
    const sections: string[] = ['# Comprehensive API Guide', 'Introduction text.\n'];
    for (let i = 1; i <= 20; i++) {
      sections.push(`## Section ${i}: Deep Dive Details`);
      sections.push('Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(10));
    }
    const fullMarkdown = sections.join('\n\n');

    let receivedArgs: any;
    const mockCompile = async (args: any) => {
      receivedArgs = args;
      return {
        url: args.url,
        compilation_id: 'comp_test_123',
        title: 'Comprehensive API Guide',
        markdown: fullMarkdown,
        resources: {
          compiled_artifact_uri: 'atlas://compilations/comp_test_123',
          ast_uri: 'atlas://compilations/comp_test_123/ast',
        },
        stats: {
          character_count: fullMarkdown.length,
          tokens_saved_pct: 72.4,
          compilation_time_ms: 120,
        },
        truncated: false,
      };
    };

    const server = createAtlasMcpServer({
      compileExecutor: mockCompile,
    });

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await server.connect(serverTransport);
    await clientTransport.start();

    const responsePromise = new Promise<any>((resolve) => {
      clientTransport.onmessage = (msg) => resolve(msg);
    });

    await clientTransport.send({
      jsonrpc: '2.0',
      id: 10,
      method: 'tools/call',
      params: {
        name: 'atlas_compile',
        arguments: {
          url: 'https://docs.stripe.com/api',
          format: 'markdown',
          max_output_chars: 2500,
        },
      },
    });

    const res = await responsePromise;
    expect(res.result).toBeDefined();
    const textOutput = res.result.content[0].text;
    expect(textOutput).toContain('Comprehensive API Guide');
    expect(textOutput).toContain('Output Truncated');
    expect(textOutput).toContain('Document Sections');
    expect(textOutput).toContain('atlas://compilations/comp_test_123');

    await server.close();
  });

  it('validates atlas_map link limit and sitemap options', async () => {
    let capturedArgs: any;
    const mockMap = async (args: any) => {
      capturedArgs = args;
      return {
        root_url: args.url,
        urls: ['https://example.com/docs', 'https://example.com/api'],
        count: 2,
        sitemaps_found: ['https://example.com/sitemap.xml'],
        duration_ms: 45,
      };
    };

    const server = createAtlasMcpServer({
      mapExecutor: mockMap,
    });

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await server.connect(serverTransport);
    await clientTransport.start();

    const responsePromise = new Promise<any>((resolve) => {
      clientTransport.onmessage = (msg) => resolve(msg);
    });

    await clientTransport.send({
      jsonrpc: '2.0',
      id: 11,
      method: 'tools/call',
      params: {
        name: 'atlas_map',
        arguments: {
          url: 'https://example.com',
          limit: 50,
          sitemap: 'only',
        },
      },
    });

    const res = await responsePromise;
    expect(capturedArgs.limit).toBe(50);
    expect(capturedArgs.sitemap).toBe('only');
    expect(res.result.structuredContent.count).toBe(2);
    expect(res.result.content[0].text).toContain('Site Topology Map for https://example.com');

    await server.close();
  });

  it('handles atlas_crawl with uniform result structure', async () => {
    const mockCrawl = async (args: any) => ({
      crawl_id: 'crawl_xyz789',
      root_url: args.url,
      pages_crawled: 3,
      pages_failed: 0,
      summary_markdown: '| Title | Depth | Resource |\n| Page A | 1 | atlas://compilations/1 |',
      pages: [
        {
          url: 'https://example.com/a',
          title: 'Page A',
          depth: 1,
          compilation_id: 'comp_a',
          resource_uri: 'atlas://compilations/comp_a',
        },
      ],
      duration_ms: 320,
    });

    const server = createAtlasMcpServer({
      crawlExecutor: mockCrawl,
    });

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await server.connect(serverTransport);
    await clientTransport.start();

    const responsePromise = new Promise<any>((resolve) => {
      clientTransport.onmessage = (msg) => resolve(msg);
    });

    await clientTransport.send({
      jsonrpc: '2.0',
      id: 12,
      method: 'tools/call',
      params: {
        name: 'atlas_crawl',
        arguments: {
          url: 'https://example.com/docs',
          max_pages: 5,
          max_depth: 2,
        },
      },
    });

    const res = await responsePromise;
    expect(res.result.structuredContent.crawl_id).toBe('crawl_xyz789');
    expect(res.result.structuredContent.pages_crawled).toBe(3);
    expect(res.result.content[0].text).toContain('Atlas Crawl Completed');

    await server.close();
  });

  it('verifies all tools declare destructiveHint: false and readOnlyHint: true in tools/list', async () => {
    const server = createAtlasMcpServer({});
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await server.connect(serverTransport);
    await clientTransport.start();

    const responsePromise = new Promise<any>((resolve) => {
      clientTransport.onmessage = (msg) => resolve(msg);
    });

    await clientTransport.send({
      jsonrpc: '2.0',
      id: 99,
      method: 'tools/list',
      params: {},
    });

    const res = await responsePromise;
    expect(res.result?.tools).toBeDefined();
    expect(res.result.tools.length).toBe(5);

    for (const tool of res.result.tools) {
      expect(tool.annotations?.destructiveHint).toBe(false);
      expect(tool.annotations?.readOnlyHint).toBe(true);
    }

    await server.close();
  });

  it('formats backend Problem error responses with appropriate Atlas error codes', async () => {
    const { formatErrorToToolResult } = await import('../src/errors');

    // 401 unauthorized Problem
    const unauthErr = new Error('{"code":"unauthorized","status":401,"detail":"Invalid token"}');
    const unauthRes = formatErrorToToolResult(unauthErr);
    expect(unauthRes.isError).toBe(true);
    expect(unauthRes.content[0].text).toContain('ATLAS_UNAUTHORIZED');

    // 429 rate limit Problem
    const rateLimitErr = new Error('{"code":"rate_limit_exceeded","status":429,"detail":"Too many requests"}');
    const rateLimitRes = formatErrorToToolResult(rateLimitErr);
    expect(rateLimitRes.isError).toBe(true);
    expect(rateLimitRes.content[0].text).toContain('ATLAS_RATE_LIMITED');

    // 402 quota exceeded Problem
    const quotaErr = new Error('{"code":"insufficient_credits","status":402,"detail":"Out of credits"}');
    const quotaRes = formatErrorToToolResult(quotaErr);
    expect(quotaRes.isError).toBe(true);
    expect(quotaRes.content[0].text).toContain('ATLAS_QUOTA_EXCEEDED');

    // SSRF blocked Problem
    const ssrfErr = new Error('{"code":"host_not_permitted","status":403,"detail":"Private IP range blocked"}');
    const ssrfRes = formatErrorToToolResult(ssrfErr);
    expect(ssrfRes.isError).toBe(true);
    expect(ssrfRes.content[0].text).toContain('ATLAS_SSRF_BLOCKED');
  });
});
