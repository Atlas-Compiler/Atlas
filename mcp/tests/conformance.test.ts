import { InMemoryTransport } from '@modelcontextprotocol/server';
import { describe, expect, it } from 'vitest';
import { createAtlasMcpServer } from '../src/server';

describe('MCP Protocol Conformance Suite', () => {
  it('registers all 5 core tools with valid schemas and annotations', async () => {
    const server = createAtlasMcpServer();
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await server.connect(serverTransport);
    await clientTransport.start();

    const responsePromise = new Promise<any>((resolve) => {
      clientTransport.onmessage = (msg) => resolve(msg);
    });

    await clientTransport.send({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list',
      params: {},
    });

    const response = await responsePromise;
    expect(response.jsonrpc).toBe('2.0');
    expect(response.id).toBe(1);

    const tools = response.result?.tools;
    expect(tools).toBeDefined();
    expect(tools.length).toBe(5);

    const toolNames = tools.map((t: any) => t.name);
    expect(toolNames).toContain('atlas_scrape');
    expect(toolNames).toContain('atlas_compile');
    expect(toolNames).toContain('atlas_map');
    expect(toolNames).toContain('atlas_batch_compile');
    expect(toolNames).toContain('atlas_crawl');

    // Validate annotations
    for (const tool of tools) {
      expect(tool.annotations?.readOnlyHint).toBe(true);
      expect(tool.annotations?.openWorldHint).toBe(true);
      expect(tool.annotations?.idempotentHint).toBe(true);
      expect(tool.inputSchema).toBeDefined();
      expect(tool.inputSchema.type).toBe('object');
    }

    await server.close();
  });

  it('dispatches tools/call and returns dual content and structuredContent', async () => {
    const mockScrapeExecutor = async (args: any) => ({
      url: args.url,
      title: 'Documentation Example',
      markdown: '# Hello World\nThis is scraped content.',
      stats: {
        character_count: 36,
        word_count: 6,
        read_time_seconds: 2,
      },
      truncated: false,
    });

    const server = createAtlasMcpServer({
      scrapeExecutor: mockScrapeExecutor,
    });

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await server.connect(serverTransport);
    await clientTransport.start();

    const responsePromise = new Promise<any>((resolve) => {
      clientTransport.onmessage = (msg) => resolve(msg);
    });

    await clientTransport.send({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: {
        name: 'atlas_scrape',
        arguments: {
          url: 'https://docs.example.com/api',
          formats: ['markdown'],
        },
      },
    });

    const response = await responsePromise;
    expect(response.result).toBeDefined();
    expect(response.result.content).toBeDefined();
    expect(response.result.content[0].type).toBe('text');
    expect(response.result.content[0].text).toContain('# Documentation Example');

    expect(response.result.structuredContent).toBeDefined();
    expect(response.result.structuredContent.title).toBe('Documentation Example');
    expect(response.result.structuredContent.stats.word_count).toBe(6);

    await server.close();
  });

  it('registers and resolves resource templates', async () => {
    const mockResourceReader = async (uri: string, vars: Record<string, string>) => ({
      contents: [
        {
          uri,
          mimeType: 'text/markdown',
          text: `# Resource Content for ${vars.id}`,
        },
      ],
    });

    const server = createAtlasMcpServer({
      resourceReader: mockResourceReader,
    });

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await server.connect(serverTransport);
    await clientTransport.start();

    // 1. List resource templates
    const listPromise = new Promise<any>((resolve) => {
      clientTransport.onmessage = (msg) => resolve(msg);
    });

    await clientTransport.send({
      jsonrpc: '2.0',
      id: 3,
      method: 'resources/templates/list',
      params: {},
    });

    const listResponse = await listPromise;
    const templates = listResponse.result?.resourceTemplates;
    expect(templates).toBeDefined();
    expect(templates.some((t: any) => t.uriTemplate === 'atlas://compilations/{id}')).toBe(true);

    // 2. Read resource
    const readPromise = new Promise<any>((resolve) => {
      clientTransport.onmessage = (msg) => resolve(msg);
    });

    await clientTransport.send({
      jsonrpc: '2.0',
      id: 4,
      method: 'resources/read',
      params: {
        uri: 'atlas://compilations/comp_12345',
      },
    });

    const readResponse = await readPromise;
    expect(readResponse.result?.contents).toBeDefined();
    expect(readResponse.result.contents[0].text).toContain('Resource Content for comp_12345');

    await server.close();
  });
});
