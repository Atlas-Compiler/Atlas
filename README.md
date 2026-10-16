<div align="center">
  <img src="AtlasLogo.png" alt="Atlas Logo" width="140" height="140" style="margin-bottom: 16px;" />
  <h1>Atlas</h1>
  <p><strong>The web compiler that turns webpages into clean, structured and token efficient data for AI agents and developers.</strong></p>
  <p>Transforms messy web pages, documentation, and articles into token-efficient Markdown, structured ASTs, and domain topologies.</p>

  <p>
    <a href="https://discord.gg/z9ktRhuudq"><img src="https://img.shields.io/badge/Discord-Join%20Community-5865F2?logo=discord&logoColor=white" alt="Discord" /></a>
    <a href="https://docs.atlas-compiler.com"><img src="https://img.shields.io/badge/Docs-docs.atlas--compiler.com-15342D" alt="Documentation" /></a>
    <a href="https://dashboard.atlas-compiler.com"><img src="https://img.shields.io/badge/Dashboard-dashboard.atlas--compiler.com-246B5A" alt="Dashboard" /></a>
    <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" /></a>
  </p>

  <p>
    <a href="https://www.npmjs.com/package/@atlascompiler/sdk"><img src="https://img.shields.io/npm/v/@atlascompiler/sdk?color=cb3837&label=@atlascompiler/sdk&logo=typescript&logoColor=white" alt="npm sdk" /></a>
    <a href="https://pypi.org/project/atlascompiler/"><img src="https://img.shields.io/pypi/v/atlascompiler?color=3775A9&label=atlascompiler&logo=python&logoColor=white" alt="PyPI" /></a>
    <a href="https://pkg.go.dev/go.atlas-compiler.com/sdk"><img src="https://img.shields.io/badge/Go%20SDK-go.atlas--compiler.com%2Fsdk-007D9C?logo=go&logoColor=white" alt="Go SDK" /></a>
    <a href="https://www.npmjs.com/package/@atlascompiler/mcp"><img src="https://img.shields.io/npm/v/@atlascompiler/mcp?color=cb3837&label=@atlascompiler/mcp&logo=npm&logoColor=white" alt="npm mcp" /></a>
    <a href="https://registry.modelcontextprotocol.io"><img src="https://img.shields.io/badge/MCP%20Registry-com.atlas--compiler%2Fatlas-15342D" alt="MCP Registry" /></a>
  </p>
</div>

---

### What Atlas Does (Before & After)

| Input (Messy Web HTML) | Atlas Output (LLM-Ready Markdown) |
| :--- | :--- |
| • **1.8 MB** raw DOM soup<br/>• **240,000+** tokens<br/>• Cookie modals, tracking pixels, ads, navigation clutter<br/>• Deeply nested `<div>` wrappers and inline styles | • **12 KB** high-density GitHub Flavored Markdown<br/>• **2,800** tokens (**98.8% token reduction**)<br/>• Preserved tables, clean code fences, and YAML frontmatter<br/>• **100% deterministic**, zero LLM hallucinations |

---

## ⚡ Why Atlas?

Traditional web scraping returns megabytes of raw, unstructured HTML bloated with navigation bars, cookie banners, tracking scripts, and presentational CSS. Feeding raw HTML into Large Language Models wastes **70% to 90% of your context window**, escalates inference costs, and introduces reasoning hallucinations.

**Atlas compiles web content into clean, token-efficient markdown at the edge—before it reaches your models:**
- 🧠 **Deterministic by Design**: Rule-based AST heuristic passes produce identical, reliable output for identical inputs. Zero prompt drift, zero hallucinated content, and zero LLM cost during compilation.
- 📉 **70–90% Token Reduction**: Eliminates boilerplate chrome, banners, and layout bloat while faithfully preserving headings, tables, code fences, equations, and semantic links.
- 🤖 **Built for AI Agents**: Native Model Context Protocol (MCP) server for instant integration into Claude Desktop, Cursor, VS Code, and Windsurf, plus native SDKs (TypeScript, Python, Go) for custom agent loops.
- ⚡ **Sub-1.5s P50 Edge Execution**: Median ~1.3s response times on single pages across a globally distributed edge network—zero container cold starts and lightweight AST compilation (end-to-end latency scales with origin server TTFB and dynamic SPA hydration).
- 🔁 **Safe Retries & Idempotency**: Built-in request deduplication ensures retrying failed or timed-out requests never burns duplicate compute credits or double-executes jobs.
- 🌐 **Engineered for Real-World Content**: High-fidelity extraction tailored for documentation engines (Mintlify, Docusaurus, GitBook), technical blogs, research publications, and modern SSR/SSG sites.

**The result:** High-signal, token-efficient input for AI agents and RAG pipelines—without spending LLM tokens just to clean up HTML.

---

## 📦 What’s in This Repository

This monorepo houses the public ecosystem and developer tools for Atlas:

| Component | Path | Language / Standard | Installation / Package |
| :--- | :--- | :--- | :--- |
| **Model Context Protocol** | [`mcp/`](./mcp) | MCP Standard (2026-07-28) | `npx -y @atlascompiler/mcp init` |
| **TypeScript / JS SDK** | [`sdk/js/`](./sdk/js) | TypeScript / Node / Deno / Bun | `npm install @atlascompiler/sdk` |
| **Python SDK** | [`sdk/python/`](./sdk/python) | Python 3.10+ (httpx, typing) | `pip install atlascompiler` |
| **Go SDK** | [`sdk/go/`](./sdk/go) | Go 1.22+ | `go get go.atlas-compiler.com/sdk` |
| **Atlas Agent Skills** | [`skills/`](./skills) | Agent Skill Specification | Canonical recipes for AI assistants |
| **Starter Examples** | [`examples/`](./examples) | Node, Python, Go, cURL | Runnable recipes & templates |

---

## 🚀 Quickstarts

### 🔑 Authentication & API Key Setup

1. **Get your API Key**: Sign in to the [Atlas Dashboard](https://dashboard.atlas-compiler.com) to generate your free API key (`atlas_...`).
2. **Set your Environment Variable** *(Recommended)*:
   All Atlas SDKs, MCP servers, and CLI tools automatically detect `ATLAS_API_KEY`:

   ```bash
   # macOS / Linux (add to ~/.bashrc or ~/.zshrc)
   export ATLAS_API_KEY="atlas_your_api_key_here"

   # Windows PowerShell
   $env:ATLAS_API_KEY = "atlas_your_api_key_here"
   ```

> [!TIP]
> Prefer not to set environment variables? You can pass your API key directly into any SDK client constructor as shown below.

---

### Direct HTTP / cURL

```bash
# Instant Real-Time Scrape (Sub-1.5s P50, clean markdown output)
curl -X POST https://api.atlas-compiler.com/v1/scrape \
  -H "Authorization: Bearer ${ATLAS_API_KEY:-atlas_your_api_key_here}" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'

# Deep Semantic Compilation (includes full AST, link graph, and idempotency key)
curl -X POST https://api.atlas-compiler.com/v1/compile \
  -H "Authorization: Bearer ${ATLAS_API_KEY:-atlas_your_api_key_here}" \
  -H "Idempotency-Key: $(uuidgen)" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

---

### AI Agents & MCP Server

Connect Claude Desktop, Cursor, VS Code, or Windsurf directly to Atlas with the 1-click interactive wizard:

```bash
npx -y @atlascompiler/mcp init
```

The wizard prompts for your Atlas API key, validates connectivity, and automatically configures your installed editors.

To run the Stdio server directly:
```bash
npx -y @atlascompiler/mcp
```

**For Remote / Cloud AI Agents (Streamable HTTP):**
- **Endpoint**: `https://api.atlas-compiler.com/mcp`
- **Headers**: `Authorization: Bearer atlas_your_api_key_here`

---

### TypeScript / JavaScript

Install the official type-safe client library:

```bash
npm install @atlascompiler/sdk
# or: pnpm add @atlascompiler/sdk / yarn add @atlascompiler/sdk
```

```typescript
import { AtlasClient } from '@atlascompiler/sdk';

// Option A: Explicit manual API key
const client = new AtlasClient({
  apiKey: 'atlas_your_api_key_here',
});

// Option B: Automatically loaded from process.env.ATLAS_API_KEY
// const client = new AtlasClient();

// Compile any web page into clean, structured Markdown
const response = await client.compile({
  url: 'https://docs.github.com/en/rest',
});

if (response.status === 200) {
  console.log('Title:', response.value.metadata.title);
  console.log('Markdown:\n', response.value.markdown);
}
```

---

### Python

Install the official Python client library:

```bash
pip install atlascompiler
```

```python
from atlascompiler import AtlasClient

# Option A: Explicit manual API key
client = AtlasClient("atlas_your_api_key_here")

# Option B: Automatically loaded from os.environ["ATLAS_API_KEY"]
# client = AtlasClient()

response = client.compile({"url": "https://example.com"})

if response.status == 200:
    print("Title:", response.metadata.get("title"))
    print("Markdown:\n", response.markdown)
```

*Async support is built-in via `AsyncAtlasClient`.*

---

### Go

Install the official Go module:

```bash
go get go.atlas-compiler.com/sdk
```

```go
package main

import (
	"context"
	"fmt"
	"log"

	atlas "go.atlas-compiler.com/sdk"
)

func main() {
	// Option A: Explicit manual API key
	client := atlas.New("atlas_your_api_key_here")

	// Option B: Automatically loaded from os.Getenv("ATLAS_API_KEY")
	// client := atlas.New("")

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

## 🛠 Supported Operations

Atlas exposes 5 core operations via REST, SDKs, and MCP:

### Synchronous Operations (Real-Time)
- **`scrape`** (`POST /v1/scrape`): Real-time Markdown, raw text, and link extraction for interactive agent loops (~1.3s P50 latency).
- **`compile`** (`POST /v1/compile`): Deep 12-pass AST compilation with structural content graph extraction, Table of Contents, and link resolution.
- **`map`** (`POST /v1/map`): Rapid topological spider that crawls sitemaps and discovers reachable URLs across a domain without fetching bodies.

### Asynchronous Operations (Queued Jobs)
- **`crawl`** (`POST /v1/crawls`): Bounded, asynchronous multi-page website crawls with path glob filtering and progress tracking (`202 Accepted`).
- **`batch`** (`POST /v1/batches`): High-concurrency parallel retrieval for up to 500 URLs per job with unified status webhooks (`202 Accepted`).

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
