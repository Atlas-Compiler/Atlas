# Atlas JavaScript & TypeScript SDK

The official JavaScript and TypeScript client library for the [Atlas](https://atlas-compiler.com) API.

Provides full TypeScript types, automatic idempotency protection, polling helpers, and constant-time webhook signature verification.

## Installation

```bash
pnpm add @atlascompiler/sdk
# or
npm install @atlascompiler/sdk
# or
yarn add @atlascompiler/sdk
```

## Authentication

Get your API key from the [Atlas Dashboard](https://dashboard.atlas-compiler.com).

All Atlas SDKs automatically read the `ATLAS_API_KEY` environment variable:

```bash
export ATLAS_API_KEY="atlas_your_api_key_here"
```

You can also pass your API key directly to the client constructor:

```ts
import { AtlasClient } from '@atlascompiler/sdk';

// Option A: Explicit manual API key
const client = new AtlasClient({
  apiKey: 'atlas_your_api_key_here',
  // workspaceId: 'ws_...', // optional
});

// Option B: Automatically loaded from process.env.ATLAS_API_KEY
// const client = new AtlasClient();
```

## Usage

### Scrape a page

Extract clean Markdown and discovered links from any web page in real-time (sub-1.5s):

```ts
const response = await client.scrape({
  url: 'https://atlas-compiler.com',
  formats: ['markdown', 'links'],
});

if (response.status === 200) {
  console.log('Title:', response.value.metadata?.title);
  console.log('Markdown:\n', response.value.data.markdown);
}
```

### Compile a page

Perform deep semantic AST compilation to extract clean Markdown, structure multi-column tables, and resolve links:

```ts
// Automatically generates an execution-scoped UUIDv4 idempotency key if omitted
const response = await client.compile({
  url: 'https://docs.github.com/en/rest',
});

if (response.status === 200) {
  console.log('Markdown:\n', response.value.markdown);
}
```

### Handle asynchronous jobs

For deep crawls or complex pages that return HTTP 202 Accepted, poll for completion:

```ts
const response = await client.compile({
  url: 'https://docs.github.com/en/rest',
});

if (response.status === 202) {
  const jobId = response.value.id;
  const job = await client.waitForJob(jobId, 1000, 60000);
  const results = await client.listJobResults(jobId);
  console.log('Results:', results.value.data[0]?.markdown);
}
```

### Idempotency Semantics

- **Implicit Execution Safety**: Mutation methods (`compile`, `cancelJob`, `bulkCancelJobs`) automatically generate an RFC 4122 UUIDv4 idempotency key if omitted, protecting against retries.
- **Explicit Deterministic Deduplication**: When cross-call deduplication is needed, pass your custom key as the second argument:

```ts
await client.compile({ url: 'https://example.com' }, 'my-deterministic-key-123');
```

## Error Handling (RFC 9457)

All non-2xx responses reject with `AtlasApiError` containing the complete RFC 9457 Problem Details object:

```ts
import { AtlasApiError } from '@atlascompiler/sdk';

try {
  await client.getJob('invalid-job-id');
} catch (error) {
  if (error instanceof AtlasApiError) {
    console.error(`Atlas Error [${error.problem.status}] ${error.problem.code}: ${error.problem.detail}`);
    console.error('Request ID:', error.problem.requestId);
  }
}
```

## Webhook Verification

Verify incoming webhooks, prevent replay attacks via configurable timestamp tolerance, and support dual-secret rotation grace periods:

```ts
import { verifyWebhookSignature } from '@atlascompiler/sdk';

const result = await verifyWebhookSignature({
  payload: rawRequestBody, // string or Uint8Array
  headers: req.headers,    // Record<string, string> or Headers instance
  secret: process.env.ATLAS_WEBHOOK_SECRET!,
  previousSecret: process.env.ATLAS_WEBHOOK_PREVIOUS_SECRET, // optional rotation secret
  toleranceSeconds: 300,   // 5 minutes
});

if (!result.valid) {
  res.status(401).send(`Webhook verification failed: ${result.error}`);
  return;
}

console.log('Verified event:', result.event.type, result.event.data);
res.status(200).send('OK');
```

## Configuration Precedence

1. Explicit constructor arguments (`new AtlasClient({ apiKey, workspaceId, baseUrl })`)
2. Ambient environment variables (`ATLAS_API_KEY`, `ATLAS_WORKSPACE_ID`, `ATLAS_BASE_URL`)
3. Defaults (`https://api.atlas-compiler.com`, 30s timeout)

## License

MIT
