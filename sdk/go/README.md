# Atlas Go SDK

The official Go client library for the [Atlas](https://atlas-compiler.com) API.

## Installation

```bash
go get go.atlas-compiler.com/sdk
```

## Quick Start

### Initialize Client

```go
package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"go.atlas-compiler.com/sdk"
)

func main() {
	// Canonical functional constructor
	client := atlas.New(
		os.Getenv("ATLAS_API_KEY"),
		atlas.WithWorkspaceID(os.Getenv("ATLAS_WORKSPACE_ID")),
		atlas.WithTimeout(30*time.Second),
	)

	// Or rely on ambient environment variables (ATLAS_API_KEY, ATLAS_WORKSPACE_ID, ATLAS_BASE_URL):
	// client := atlas.New("")
}
```

### Compile or Scrape a Web Page

```go
ctx := context.Background()

// Compile: Automatically generates an execution-scoped UUIDv4 idempotency key
// if none is explicitly provided.
res, meta, err := client.Compile(ctx, atlas.CompileUrlRequest{
	Url: "https://example.com/article",
})
if err != nil {
	log.Fatalf("Compile error: %v", err)
}

if res.Response200 != nil {
	// Synchronous instant compilation
	fmt.Println("Compiled markdown:\n", res.Response200.Markdown)
} else if res.Response202 != nil {
	// Asynchronous compilation job
	jobID := res.Response202.Id
	fmt.Printf("Job queued with ID %s. Polling for completion...\n", jobID)

	job, _, err := client.WaitForJob(ctx, jobID, 1*time.Second, 60*time.Second)
	if err != nil {
		log.Fatalf("WaitForJob error: %v", err)
	}

	results, _, err := client.ListJobResults(ctx, jobID, nil, nil)
	if err != nil {
		log.Fatalf("ListJobResults error: %v", err)
	}
	for _, item := range results.Data {
		if item.Markdown != nil {
			fmt.Println(*item.Markdown)
		}
	}
}
```

### Idempotency Semantics

- **Implicit Execution Safety**: When omitted, `Compile`, `CancelJob`, and `BulkCancelJobs` automatically generate a standard RFC 4122 UUIDv4 to protect against execution-level transient retries.
- **Explicit Deterministic Deduplication**: When cross-call deduplication is needed, pass your custom key as an optional argument:

```go
res, meta, err := client.Compile(ctx, req, "my-deterministic-key-123")
```

## Error Handling (RFC 9457)

All non-2xx responses from Atlas conform to [RFC 9457 Problem Details](https://datatracker.ietf.org/doc/html/rfc9457). Use standard Go `errors.As` to inspect structured error details:

```go
var problem *atlas.Problem
if errors.As(err, &problem) {
	fmt.Printf("Atlas API Error [%d] %s: %s (Request ID: %s)\n",
		problem.Status, problem.Code, problem.Detail, problem.RequestId)
	for _, p := range problem.InvalidParams {
		fmt.Printf(" - Parameter %s: %s\n", p.Name, p.Reason)
	}
}
```

## Webhook Verification

Verify webhook authenticity, defend against replay attacks, and support zero-downtime secret rotation:

```go
http.HandleFunc("/webhooks/atlas", func(w http.ResponseWriter, r *http.Request) {
	payload, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	result, err := atlas.VerifyWebhookSignature(atlas.WebhookVerifyOptions{
		Payload:        payload,
		Headers:        r.Header,
		Secret:         os.Getenv("ATLAS_WEBHOOK_SECRET"),
		PreviousSecret: os.Getenv("ATLAS_WEBHOOK_PREVIOUS_SECRET"), // optional grace period secret
		Tolerance:      nil, // defaults to 300s (5 minutes)
	})
	if err != nil || !result.Valid {
		http.Error(w, fmt.Sprintf("Unauthorized: %s", result.Error), http.StatusUnauthorized)
		return
	}

	fmt.Printf("Received verified webhook event: %v\n", result.Event["type"])
	w.WriteHeader(http.StatusOK)
})
```

## Configuration Precedence

1. Explicit constructor/method arguments (`atlas.New("key", atlas.WithWorkspaceID("ws_1"))`)
2. Ambient environment variables (`ATLAS_API_KEY`, `ATLAS_WORKSPACE_ID`, `ATLAS_BASE_URL`)
3. Defaults (`https://api.atlas-compiler.com`, 30s timeout)

## License

MIT
