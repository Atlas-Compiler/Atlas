<div align="center">
  <img src="AtlasLogo.png" alt="Atlas Logo" width="140" height="140" style="margin-bottom: 16px;" />
  <h1>Atlas</h1>
  <p><strong>The web compiler that turns webpages into clean, efficient structured data for AI and developers.</strong></p>
  <p>Transforms messy web pages, SPAs, and deep documentation into token-efficient Markdown, structured ASTs, and domain topologies with sub-1.5s latency.</p>

  <p>
    <a href="https://discord.gg/z9ktRhuudq"><img src="https://img.shields.io/badge/Discord-Join%20Community-5865F2?logo=discord&logoColor=white" alt="Discord" /></a>
    <a href="https://docs.atlas-compiler.com"><img src="https://img.shields.io/badge/Docs-docs.atlas--compiler.com-15342D" alt="Documentation" /></a>
    <a href="https://dashboard.atlas-compiler.com"><img src="https://img.shields.io/badge/Dashboard-dashboard.atlas--compiler.com-246B5A" alt="Dashboard" /></a>
    <a href="https://www.npmjs.com/package/@atlascompiler/sdk"><img src="https://img.shields.io/npm/v/@atlascompiler/sdk?color=cb3837&label=@atlascompiler/sdk" alt="npm sdk" /></a>
    <a href="https://www.npmjs.com/package/@atlascompiler/mcp"><img src="https://img.shields.io/npm/v/@atlascompiler/mcp?color=cb3837&label=@atlascompiler/mcp" alt="npm mcp" /></a>
    <a href="https://pypi.org/project/atlascompiler/"><img src="https://img.shields.io/pypi/v/atlascompiler?color=3775A9&label=PyPI" alt="PyPI" /></a>
    <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" /></a>
  </p>
</div>

---

## ⚡ Why Atlas?

Traditional web scraping returns megabytes of raw, unstructured HTML bloated with navigation bars, cookie banners, tracking scripts, and presentational CSS. Feeding raw HTML into Large Language Models wastes **70% to 90% of your context window**, escalates inference costs, and increases reasoning hallucinations.

**Atlas compiles the web at the edge before it reaches your models:**
- 🧠 **0-LLM Deterministic Pipeline**: Pure heuristic AST transformation passes. Zero hallucinations, zero prompt drift, 100% reproducible output.
- 📉 **70–90% Token Reduction**: Strips page chrome while faithfully preserving headings, tables, code fences, equations, and outbound links.
- 🤖 **Native Model Context Protocol (MCP)**: 1-click integration with Cursor, Claude Desktop, Windsurf, VS Code, and custom AI agent loops.
- 🚀 **Sub-1.5s Global Edge Latency**: Distributed execution across 300+ edge locations with DNS-aware SSRF protection.
- 🛡️ **Workspace-Scoped & Idempotent**: Automatic duplicate prevention via RFC 4122 idempotency keys.

---

## 📦 What’s in This Repository

This monorepo houses the public ecosystem and developer tools for Atlas:

| Component | Path | Language / Standard | Installation / Package |
| :--- | :--- | :--- | :--- |
| **Model Context Protocol** | [`mcp/`](./mcp) | MCP Standard (2026 era) | `npx -y @atlascompiler/mcp init` |
| **TypeScript / JS SDK** | [`sdk/js/`](./sdk/js) | TypeScript / Node / Deno / Bun | `npm install @atlascompiler/sdk` |
| **Python SDK** | [`sdk/python/`](./sdk/python) | Python 3.10+ (httpx, typing) | `pip install atlascompiler` |
| **Go SDK** | [`sdk/go/`](./sdk/go) | Go 1.22+ | `go get go.atlas-compiler.com/sdk/pkg/atlas` |
| **Atlas Agent Skills** | [`skills/`](./skills) | Agent Skill Specification | Canonical recipes for AI assistants |
| **Starter Examples** | [`examples/`](./examples) | Node, Python, Go, cURL | Runnable recipes & templates |

---

## 🚀 Quickstarts

### 1. AI Agents & Coding Assistants (MCP Server)

Connect Claude Desktop, Cursor, VS Code, or Windsurf directly to Atlas with the 1-click interactive wizard:

```bash
npx -y @atlascompiler/mcp init
```

The wizard prompts for your Atlas API key, validates connectivity, and automatically configures your installed editors without exposing tokens in process args.

To run the Stdio server directly:
```bash
npx -y @atlascompiler/mcp
```

---

### 2. TypeScript / JavaScript

Install the official type-safe client library:

```bash
npm install @atlascompiler/sdk
# or: pnpm add @atlascompiler/sdk / yarn add @atlascompiler/sdk
```

```typescript
import { AtlasClient } from '@atlascompiler/sdk';

const client = new AtlasClient({
  apiKey: process.env.ATLAS_API_KEY!,
});

// Compile a web page into clean, structured Markdown
const response = await client.compile({
  url: 'https://docs.github.com/en/rest',
});

if (response.status === 200) {
  console.log('Title:', response.value.metadata.title);
  console.log('Markdown:\n', response.value.markdown);
}
```

---

### 3. Python

Install the official Python client library:

```bash
pip install atlascompiler
```

```python
import os
from atlascompiler import AtlasClient

with AtlasClient(os.getenv("ATLAS_API_KEY")) as client:
    response = client.compile({"url": "https://example.com/article"})
    
    if response.status == 200:
        print("Title:", response.value["metadata"]["title"])
        print("Markdown:\n", response.value["markdown"])
```

*Async support is built-in via `AsyncAtlasClient`.*

---

### 4. Go

```bash
go get go.atlas-compiler.com/sdk/pkg/atlas
```

```go
package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"go.atlas-compiler.com/sdk/pkg/atlas"
)

func main() {
	client := atlas.New(os.Getenv("ATLAS_API_KEY"))
	res, _, err := client.Compile(context.Background(), atlas.CompileUrlRequest{
		Url: "https://example.com",
	})
	if err != nil {
		log.Fatal(err)
	}

	if res.Response200 != nil {
		fmt.Println("Markdown:\n", res.Response200.Markdown)
	}
}
```

---

### 5. Direct HTTP / cURL

```bash
curl -X POST https://api.atlas-compiler.com/v1/compile \
  -H "Authorization: Bearer atlas_your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

---

## 🛠 Supported Operations

Atlas exposes 5 core operations via REST, SDKs, and MCP:

- **`compile`**: Deep 12-pass AST compilation with structural content graph extraction and visual formatting.
- **`scrape`**: Sub-1.5s real-time Markdown extraction for low-latency agent loops (`POST /v1/scrape`).
- **`map`**: Rapid topological spider that crawls and ranks all reachable URLs across a domain (`POST /v1/map`).
- **`crawl`**: Bounded, asynchronous multi-page website crawls with path glob filtering (`POST /v1/crawls`).
- **`batch`**: High-concurrency parallel retrieval for up to 500 URLs per job with unified status webhooks (`POST /v1/batches`).

---

## 💬 Community & Support

- **Discord**: Join our active developer community at [discord.gg/z9ktRhuudq](https://discord.gg/z9ktRhuudq) for help, agent prompts, and feature discussions.
- **GitHub Discussions**: Share recipes, ask questions, or propose ideas at [Discussions](https://github.com/Atlas-Compiler/Atlas/discussions).
- **Bug Reports**: Open an issue using our [Bug Report Template](https://github.com/Atlas-Compiler/Atlas/issues/new?template=bug_report.yml).
- **Security Inquiries**: Email `support@atlas-compiler.com` for private disclosure.

---

## 📜 Contributing & License

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) and [Code of Conduct](./CODE_OF_CONDUCT.md).

Licensed under the [MIT License](./LICENSE).
