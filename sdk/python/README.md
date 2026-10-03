# Atlas Python SDK

The official Python client library for the [Atlas](https://atlas-compiler.com) API.

Supports both synchronous and asynchronous workflows with full type annotations, automatic idempotency protection, polling helpers, and constant-time webhook signature verification.

## Installation

```bash
pip install atlascompiler
```

## Quick Start

### Synchronous Client (`AtlasClient`)

```python
import os
from atlascompiler import AtlasClient, CompileUrlRequest

# Initializes using explicit args or ambient environment (ATLAS_API_KEY, ATLAS_WORKSPACE_ID)
with AtlasClient(os.getenv("ATLAS_API_KEY"), workspace_id=os.getenv("ATLAS_WORKSPACE_ID")) as client:
    # Compile: Automatically generates UUIDv4 idempotency key when omitted
    response = client.compile({"url": "https://example.com/article"})

    if response.status == 200:
        print("Compiled Markdown:", response.value["markdown"])
    else:
        # 202 Accepted: Asynchronous compilation job
        job_id = response.value["id"]
        job = client.wait_for_job(job_id, interval_seconds=1.0, max_wait_seconds=60.0)
        results = client.list_job_results(job_id)
        print("Results:", results.value["data"][0]["markdown"])
```

### Asynchronous Client (`AsyncAtlasClient`)

```python
import asyncio
import os
from atlascompiler import AsyncAtlasClient

async def main():
    async with AsyncAtlasClient(os.getenv("ATLAS_API_KEY")) as client:
        response = await client.compile({"url": "https://example.com/article"})
        if response.status == 200:
            print("Markdown:", response.value["markdown"])
        else:
            job = await client.wait_for_job(response.value["id"])
            results = await client.list_job_results(job["id"])
            print("Results:", results.value["data"][0]["markdown"])

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
