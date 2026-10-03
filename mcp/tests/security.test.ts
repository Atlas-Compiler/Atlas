import { InMemoryTransport } from '@modelcontextprotocol/server';
import { describe, expect, it } from 'vitest';
import { AtlasMcpError } from '../src/errors';
import { createAtlasMcpServer } from '../src/server';

describe('MCP SSRF & Network Hardening Suite', () => {
  it('blocks SSRF attempts to cloud metadata and RFC1918 addresses', async () => {
    const mockBlockedScrape = async (args: any) => {
      const url = new URL(args.url);
      const host = url.hostname;
      if (
        host === '127.0.0.1' ||
        host === 'localhost' ||
        host === '169.254.169.254' ||
        host === '10.0.0.1' ||
        host === '[::1]'
      ) {
        throw new AtlasMcpError({
          code: 'ATLAS_SSRF_BLOCKED',
          message: `Egress to internal or private IP address (${host}) is strictly blocked.`,
          retryable: false,
        });
      }
      return {
        url: args.url,
        title: 'Safe Web Page',
        markdown: 'Safe content',
        stats: { character_count: 12, word_count: 2, read_time_seconds: 1 },
        truncated: false,
      };
    };

    const server = createAtlasMcpServer({
      scrapeExecutor: mockBlockedScrape,
    });

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await server.connect(serverTransport);
    await clientTransport.start();

    const targets = [
      'http://169.254.169.254/latest/meta-data/',
      'http://127.0.0.1:8787/internal/admin',
      'http://localhost:8080/metrics',
    ];

    for (let i = 0; i < targets.length; i++) {
      const responsePromise = new Promise<any>((resolve) => {
        clientTransport.onmessage = (msg) => resolve(msg);
      });

      await clientTransport.send({
        jsonrpc: '2.0',
        id: 30 + i,
        method: 'tools/call',
        params: {
          name: 'atlas_scrape',
          arguments: {
            url: targets[i],
          },
        },
      });

      const res = await responsePromise;
      expect(res.result?.isError).toBe(true);
      expect(res.result.content[0].text).toContain('ATLAS_SSRF_BLOCKED');
      expect(res.result.structuredContent.error.code).toBe('ATLAS_SSRF_BLOCKED');
    }

    await server.close();
  });
});
