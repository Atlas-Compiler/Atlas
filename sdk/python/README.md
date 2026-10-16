# Atlas Python SDK

The official Python client library for the [Atlas](https://atlas-compiler.com) API.

Supports both synchronous and asynchronous workflows with full type annotations, automatic idempotency protection, polling helpers, and constant-time webhook signature verification.

## Installation

```bash
pip install atlascompiler
```

## Authentication

Get your API key from the [Atlas Dashboard](https://dashboard.atlas-compiler.com).

All Atlas SDKs automatically read the `ATLAS_API_KEY` environment variable:

```bash
export ATLAS_API_KEY="atlas_your_api_key_here"
```

You can also pass your API key directly to the client constructor:

```python
from atlascompiler import AtlasClient

# Option A: Explicit manual API key
client = AtlasClient("atlas_your_api_key_here")

# Option B: Automatically loaded from os.environ["ATLAS_API_KEY"]
# client = AtlasClient()
```

## Usage

### Scrape a page

Extract clean Markdown and discovered links from any web page in real-time (sub-1.5s):

```python
response = client.scrape({
    "url": "https://atlas-compiler.com",
    "formats": ["markdown", "links"],
})

if response.status == 200:
    print("Title:", response.metadata.get("title"))
    print("Markdown:\n", response.markdown)
```

### Compile a page

Perform deep semantic AST compilation to extract clean Markdown, structure multi-column tables, and resolve links:

```python
# Automatically generates an execution-scoped UUIDv4 idempotency key if omitted
response = client.compile({"url": "https://docs.github.com/en/rest"})

if response.status == 200:
    print("Compiled Markdown:\n", response.markdown)
```

### Handle asynchronous jobs

For deep crawls or complex pages that return HTTP 202 Accepted, poll for completion:

```python
response = client.compile({"url": "https://docs.github.com/en/rest"})

if response.status == 202:
    job_id = response.value["id"]
    job = client.wait_for_job(job_id, interval_seconds=1.0, max_wait_seconds=60.0)
    results = client.list_job_results(job_id)
    print("Results:", results.value["data"][0]["markdown"])
```

### Asynchronous client (`AsyncAtlasClient`)

```python
import asyncio
from atlascompiler import AsyncAtlasClient

async def main():
    # Automatically reads ATLAS_API_KEY from environment
    async with AsyncAtlasClient() as client:
        response = await client.compile({"url": "https://docs.github.com/en/rest"})
        if response.status == 200:
            print("Markdown:\n", response.markdown)

asyncio.run(main())
```

## Idempotency Semantics

- **Implicit Execution Safety**: For mutation endpoints (`compile`, `cancel_job`, `bulk_cancel_jobs`), an RFC 4122 UUIDv4 is automatically generated when `idempotency_key` is omitted.
- **Explicit Deterministic Deduplication**: When deduplication across distinct attempts is required, pass your custom string:

```python
client.compile({"url": "https://example.com"}, idempotency_key="my-deterministic-key-123")
```

## Error Handling (RFC 9457)

All non-2xx API errors raise `AtlasApiError` containing the parsed RFC 9457 Problem Details object:

```python
from atlascompiler import AtlasApiError

try:
    client.get_job("job_invalid_id")
except AtlasApiError as e:
    print(f"Error [{e.status}] {e.code}: {e.detail}")
    print(f"Request ID: {e.problem.get('requestId')}")
```

## Webhook Signature Verification

Verify webhook payloads, guard against replay attacks with configurable clock drift tolerance, and support zero-downtime secret rotation:

```python
from atlascompiler import verify_webhook_signature

result = verify_webhook_signature(
    payload=raw_body,  # bytes or str
    headers=request.headers,
    secret=os.getenv("ATLAS_WEBHOOK_SECRET"),
    previous_secret=os.getenv("ATLAS_WEBHOOK_PREVIOUS_SECRET"),  # optional rotation grace
    tolerance_seconds=300,  # 5 minutes
)

if not result.valid:
    print(f"Webhook verification failed: {result.error}")
else:
    event = result.event
    print(f"Received event: {event['type']}")
```

## Configuration Precedence

1. Explicit constructor arguments (`api_key`, `workspace_id`, `base_url`, `timeout`)
2. Ambient environment variables (`ATLAS_API_KEY`, `ATLAS_WORKSPACE_ID`, `ATLAS_BASE_URL`)
3. Defaults (`https://api.atlas-compiler.com`, 30.0s timeout)

## License

MIT
