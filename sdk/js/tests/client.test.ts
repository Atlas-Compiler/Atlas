import { readFileSync } from 'node:fs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AtlasApiError, AtlasClient, isCompleted, operationMetadata } from '../src/index';

const fixture = JSON.parse(
  readFileSync(new URL('../../../contracts/fixtures/v1-conformance.json', import.meta.url), 'utf8'),
);

describe('generated v1 client', () => {
  afterEach(() => vi.restoreAllMocks());

  it('addresses every canonical customer operation and isolates customer surface', () => {
    expect(Object.keys(operationMetadata)).toHaveLength(17);
    const developerOps = [
      'compileUrl',
      'scrapeUrl',
      'mapUrl',
      'createCrawl',
      'createBatch',
      'getJob',
      'cancelJob',
      'listJobs',
      'bulkCancelJobs',
      'listJobResults',
      'listJobErrors',
      'getWorkspaceOverview',
      'listProjects',
      'getProjectsStats',
      'getProject',
      'getUsage',
      'listUsageLedger',
    ];
    for (const op of developerOps) {
      expect(operationMetadata).toHaveProperty(op);
    }
    // Verify Clerk-only routes are not exposed in developer SDK
    expect(operationMetadata).not.toHaveProperty('getApiKey');
    expect(operationMetadata).not.toHaveProperty('getWebhookEndpoint');
    expect(operationMetadata).not.toHaveProperty('listApiKeys');
    expect(operationMetadata).not.toHaveProperty('getBillingSubscription');
    expect(operationMetadata).not.toHaveProperty('getCurrentUser');
  });

  it('scopes execution, sends idempotency, and decodes the cancellation envelope', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify(fixture.cancellation), { status: 202 }));
    const client = new AtlasClient({
      workspaceId: 'ws_1',
      apiKey: 'key',
      baseUrl: 'https://api.test/',
    });
    const response = await client.cancelJob('job_1', 'request-123');
    expect(response.value.job.status).toBe('cancelled');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.test/v1/jobs/job_1',
      expect.objectContaining({
        method: 'DELETE',
        headers: expect.objectContaining({
          authorization: 'Bearer key',
          'idempotency-key': 'request-123',
        }),
      }),
    );
  });

  it('keeps typed result and error pages separate', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(fixture.resultPage)));
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(fixture.errorPage)));
    const client = new AtlasClient({ workspaceId: 'ws_1' });
    expect((await client.listJobResults('job_1')).value.data[0].markdown).toBe('# Result');
    expect(Object.keys(fixture.resultPage.data[0].ir.contentGraph.nodes)).toHaveLength(2);
    expect((await client.listJobErrors('job_1')).value.data[0].code).toBe('fetch_failed');
  });

  it('consumes every governed fixture section', () => {
    expect(Object.keys(fixture).sort()).toEqual([
      'apiKey',
      'apiKeyPage',
      'cancellation',
      'compileRequest',
      'errorPage',
      'invitationPage',
      'job',
      'ledgerPage',
      'memberPage',
      'problem',
      'projectPage',
      'resolvedWorkspace',
      'resultPage',
      'subscription',
      'usage',
      'user',
      'webhookDeliveryPage',
      'webhookEndpoint',
      'webhookEndpointPage',
      'workspaceBootstrap',
      'workspaceDeletion',
      'workspacePage',
    ]);
    expect(fixture.apiKey.id).toBe('key_01J00000000000000000000000');
    expect(fixture.webhookEndpoint.id).toBe('whk_01J00000000000000000000000');
    expect(fixture.compileRequest.cache).toEqual({ forceFresh: false, maxAgeSeconds: 60 });
    expect(fixture.user.email).toBe('user@example.com');
    expect(fixture.workspacePage.data).toHaveLength(1);
    expect(fixture.workspaceBootstrap.workspace.isPrimary).toBe(true);
    expect(fixture.resolvedWorkspace.workspace.role).toBe('owner');
    expect(fixture.workspaceDeletion.stage).toBe('requested');
    expect(fixture.memberPage.data).toHaveLength(1);
    expect(fixture.invitationPage.data).toHaveLength(1);
    expect(fixture.projectPage.data).toHaveLength(1);
    expect(fixture.apiKeyPage.data).toHaveLength(1);
    expect(fixture.usage.accounts).toHaveLength(1);
    expect(fixture.ledgerPage.data[0].metadata.nested.source).toBe('fixture');
    expect(fixture.subscription.status).toBe('active');
    expect(fixture.webhookEndpointPage.data).toHaveLength(1);
    expect(fixture.webhookDeliveryPage.data).toHaveLength(1);
  });

  it('decodes the complete Problem fixture', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(fixture.problem), { status: 400 }),
    );
    const error = await new AtlasClient({ workspaceId: 'ws_1' })
      .getJob('job_1')
      .catch((value) => value);
    expect(error).toBeInstanceOf(AtlasApiError);
    expect(error.problem.requestId).toBe(fixture.problem.requestId);
  });

  it('preserves status and body for a non-JSON gateway failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('upstream unavailable', { status: 502, statusText: 'Bad Gateway' }),
    );
    const error = await new AtlasClient({ workspaceId: 'ws_1' })
      .getJob('job_1')
      .catch((value) => value);
    expect(error).toBeInstanceOf(AtlasApiError);
    expect(error.problem).toMatchObject({ status: 502, detail: 'upstream unavailable' });
  });

  it('normalizes malformed JSON errors and rejects empty successes', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ error: 'upstream unavailable' }), { status: 502 }),
    );
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 200 }));
    const client = new AtlasClient({ workspaceId: 'ws_1' });

    const error = await client.getJob('job_1').catch((value) => value);
    expect(error).toBeInstanceOf(AtlasApiError);
    expect(error.problem).toMatchObject({ status: 502, code: 'http_error' });
    await expect(client.getJob('job_1')).rejects.toThrow('empty success response');
  });

  it('correctly evaluates completion states with isCompleted helper', () => {
    expect(isCompleted({ status: 'ready' })).toBe(true);
    expect(isCompleted({ status: 'failed' })).toBe(true);
    expect(isCompleted({ status: 'cancelled' })).toBe(true);
    expect(isCompleted({ status: 'running', artifactState: 'review' })).toBe(true);
    expect(isCompleted({ status: 'running', artifactState: 'pending' })).toBe(false);
    expect(isCompleted({ status: 'queued' })).toBe(false);
    expect(isCompleted({ status: 'ingesting' })).toBe(false);
  });

  it('auto-generates UUID idempotency key for compile when omitted, uses explicit key when supplied', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementation(() =>
        Promise.resolve(new Response(JSON.stringify({ markdown: '# Compiled' }), { status: 200 })),
      );
    const client = new AtlasClient({ apiKey: 'key', baseUrl: 'https://api.test/' });

    // Auto-generated key
    await client.compile({ url: 'https://example.com' });
    const firstCallHeaders = fetchMock.mock.calls[0][1]?.headers as Record<string, string>;
    const autoKey = firstCallHeaders?.['idempotency-key'];
    expect(autoKey).toBeDefined();
    expect(autoKey.length).toBeGreaterThan(10);

    // Explicit key
    await client.compile({ url: 'https://example.com' }, 'custom-key-123');
    const secondCallHeaders = fetchMock.mock.calls[1][1]?.headers as Record<string, string>;
    expect(secondCallHeaders?.['idempotency-key']).toBe('custom-key-123');
  });

  it('supports scrape, listJobs, bulkCancelJobs, and requires workspaceId only where applicable', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ markdown: '# Scraped' }), { status: 200 }),
    );
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ data: [], nextCursor: null }), { status: 200 }),
    );
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ results: [] }), { status: 200 }));

    const client = new AtlasClient({ apiKey: 'key', baseUrl: 'https://api.test/' });

    // Scrape succeeds without workspaceId
    const scrapeRes = await client.scrape({ url: 'https://example.com' });
    expect(scrapeRes.value).toEqual({ markdown: '# Scraped' });

    // listJobs succeeds without workspaceId
    const jobsRes = await client.listJobs({ limit: 10 });
    expect(jobsRes.value).toEqual({ data: [], nextCursor: null });

    // bulkCancelJobs succeeds without workspaceId
    const bulkRes = await client.bulkCancelJobs({ jobIds: ['job_1'] });
    expect(bulkRes.value).toEqual({ results: [] });

    // getWorkspaceOverview throws TypeError without workspaceId
    expect(() => client.getWorkspaceOverview()).toThrow(TypeError);

    // getWorkspaceOverview succeeds when passed explicitly
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(fixture.usage), { status: 200 }));
    await client.getWorkspaceOverview('ws_custom');
    expect(fetchMock).toHaveBeenLastCalledWith(
      'https://api.test/v1/workspaces/ws_custom/overview',
      expect.objectContaining({ method: 'GET' }),
    );
  });
});
