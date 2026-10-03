import { InMemoryTransport } from '@modelcontextprotocol/server';
import { describe, expect, it } from 'vitest';
import { AtlasMcpError } from '../src/errors';
import { createAtlasMcpServer } from '../src/server';

describe('MCP Resources & Tenant Isolation Suite', () => {
  it('resolves compilation artifact when authorized in caller workspace', async () => {
    const mockResourceReader = async (uri: string, vars: Record<string, string>) => {
      if (vars.id === 'comp_allowed') {
        return {
          contents: [
            {
              uri,
              mimeType: 'text/markdown',
              text: '# Compiled Document\nAuthorized content.',
            },
          ],
        };
      }
      throw new AtlasMcpError({
        code: 'ATLAS_RESOURCE_NOT_FOUND',
        message: `Resource not found or unauthorized: ${uri}`,
        retryable: false,
      });
    };

    const server = createAtlasMcpServer({
      resourceReader: mockResourceReader,
    });

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await server.connect(serverTransport);
    await clientTransport.start();

    const readPromise = new Promise<any>((resolve) => {
      clientTransport.onmessage = (msg) => resolve(msg);
    });

    await clientTransport.send({
      jsonrpc: '2.0',
      id: 20,
      method: 'resources/read',
      params: {
        uri: 'atlas://compilations/comp_allowed',
      },
    });

    const res = await readPromise;
    expect(res.result?.contents).toBeDefined();
    expect(res.result.contents[0].text).toContain('Authorized content.');

    await server.close();
  });

  it('strictly blocks cross-tenant resource reading (fails closed without data leakage)', async () => {
    const mockResourceReader = async (uri: string, vars: Record<string, string>) => {
      // Simulates database query: WHERE workspace_id = caller_workspace AND id = vars.id
      // In this case, comp_foreign belongs to another tenant, returning 0 rows
      if (vars.id === 'comp_foreign') {
        throw new AtlasMcpError({
          code: 'ATLAS_RESOURCE_NOT_FOUND',
          message: `Resource not found or unauthorized: ${uri}`,
          retryable: false,
        });
      }
      return { contents: [] };
    };

    const server = createAtlasMcpServer({
      resourceReader: mockResourceReader,
    });

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await server.connect(serverTransport);
    await clientTransport.start();

    const readPromise = new Promise<any>((resolve) => {
      clientTransport.onmessage = (msg) => resolve(msg);
    });

    await clientTransport.send({
      jsonrpc: '2.0',
      id: 21,
      method: 'resources/read',
      params: {
        uri: 'atlas://compilations/comp_foreign',
      },
    });

    const res = await readPromise;
    // MCP Error response
    expect(res.error).toBeDefined();
    expect(res.error.message).toContain('Resource not found or unauthorized');

    await server.close();
  });

  it('delegates createRemoteResourceReader to POST /mcp and handles JSON response', async () => {
    const { createRemoteResourceReader } = await import('../src/resources');
    const mockFetch = async (url: string | URL | Request, init?: RequestInit) => {
      expect(String(url)).toBe('https://api.atlas-compiler.com/mcp');
      expect(init?.method).toBe('POST');
      const headers = init?.headers as Record<string, string>;
      expect(headers.Authorization).toBe('Bearer at_live_test123');
      const body = JSON.parse(init?.body as string);
      expect(body.method).toBe('resources/read');
      expect(body.params.uri).toBe('atlas://compilations/comp_remote_1');

      return new Response(
        JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          result: {
            contents: [
              {
                uri: 'atlas://compilations/comp_remote_1',
                mimeType: 'text/markdown',
                text: '# Remote Document Content',
              },
            ],
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    };

    const reader = createRemoteResourceReader({
      apiKey: 'at_live_test123',
      fetch: mockFetch as any,
    });

    const result = await reader('atlas://compilations/comp_remote_1', {});
    expect((result.contents[0] as { text: string }).text).toBe('# Remote Document Content');
  });

  it('handles SSE streaming responses in createRemoteResourceReader', async () => {
    const { createRemoteResourceReader } = await import('../src/resources');
    const sseBody = `event: message\ndata: {"jsonrpc":"2.0","id":1,"result":{"contents":[{"uri":"atlas://compilations/comp_sse_1","mimeType":"text/markdown","text":"# SSE Content"}]}}\n\n`;

    const mockFetch = async () => {
      return new Response(sseBody, {
        status: 200,
        headers: { 'Content-Type': 'text/event-stream' },
      });
    };

    const reader = createRemoteResourceReader({
      apiKey: 'at_live_test123',
      fetch: mockFetch as any,
    });

    const result = await reader('atlas://compilations/comp_sse_1', {});
    expect((result.contents[0] as { text: string }).text).toBe('# SSE Content');
  });

  it('throws ATLAS_RESOURCE_NOT_FOUND when remote resource returns 404', async () => {
    const { createRemoteResourceReader } = await import('../src/resources');
    const mockFetch = async () => new Response('Not Found', { status: 404 });

    const reader = createRemoteResourceReader({
      apiKey: 'at_live_test123',
      fetch: mockFetch as any,
    });

    await expect(reader('atlas://compilations/comp_nonexistent', {})).rejects.toThrow(
      'Resource not found or unauthorized'
    );
  });
});
