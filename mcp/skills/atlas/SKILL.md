---
name: atlas
description: "Official Atlas Agent Skill for deterministic zero-LLM web compilation, visual markdown extraction, DOM scraping, site mapping, and batch processing."
version: 1.0.0
license: MIT
compatibility: Works with any MCP-enabled AI client (Claude Desktop, Cursor, VS Code, Goose, Windsurf, Antigravity).
metadata:
  author: Atlas Compiler Team
  version: "1.0.0"
---

# Atlas Agent Skill

Atlas is a deterministic, zero-LLM web compiler and extraction engine that transforms modern web pages, SPAs, dynamic tables, and complex documentation sites into clean, token-efficient, visually accurate Markdown and structured ASTs.

This skill equips AI agents to effectively select and execute the right Atlas tool for any web retrieval, research, compilation, or mapping task.

---

## 1. Quickstart & Authentication

Atlas connects to your environment through the `@atlascompiler/mcp` server.

### Initial Setup (One-Time)
Run the interactive setup wizard in your terminal:
```bash
npx -y @atlascompiler/mcp init
```
The wizard:
1. Validates your Atlas API key (`atlas_...`).
2. Securely stores it in `~/.atlas/credentials.json` (`chmod 0600`).
3. Automatically configures your editor (`claude_desktop_config.json`, Cursor `mcp.json`).

### Headless & CI/CD Environments
In containerized, CI/CD, or ephemeral environments, supply credentials via environment variable:
```bash
export ATLAS_API_KEY="atlas_your_api_key_here"
```

> [!IMPORTANT]
> Never hardcode API keys in project configuration files, commits, or prompts. Atlas resolves credentials automatically from `ATLAS_API_KEY` or `~/.atlas/credentials.json`.

---

## 2. Tool Selection Matrix

Use this decision matrix to pick the most efficient tool:

| Goal / Use Case | Recommended Tool | Why |
| :--- | :--- | :--- |
| Read single article, blog post, or standard page | `atlas_scrape` | Fast-path extraction with minimal latency and automatic link discovery. |
| Extract pricing tables, interactive SPAs, complex layouts | `atlas_compile` | Full deterministic visual compilation preserving CSS positioning, table geometry, and AST. |
| Discover site architecture, all docs pages, or sitemap | `atlas_map` | High-speed URL tree discovery without downloading page bodies. |
| Spider documentation section or multi-page domain | `atlas_crawl` | Recursive spidering with depth control and path pattern filtering. |
| Compile a predefined list of 1–20 URLs in parallel | `atlas_batch_compile` | Concurrent execution with uniform per-page budget and error isolation. |

---

## 3. Playbooks & Workflows

### Playbook 1: Fast-Path Single-Page Extraction (`atlas_scrape`)

Use `atlas_scrape` when you need immediate content from a specific URL.

```json
{
  "name": "atlas_scrape",
  "arguments": {
    "url": "https://example.com/blog/article",
    "formats": ["markdown", "links"],
    "max_output_chars": 30000
  }
}
```

**Key Parameters**:
- `formats`: `["markdown"]` (clean markdown), `["links"]` (extracted hyperlinks), `["text"]` (raw plain text).
- `max_output_chars`: Maximum character budget (default: 30,000, max: 200,000). Content exceeding the budget is cleanly truncated at paragraph boundaries.
- `timeout_ms`: Request timeout in milliseconds (default: 15,000).

---

### Playbook 2: Visual Compilation & Dynamic Content (`atlas_compile`)

Use `atlas_compile` for pages rendered heavily with JavaScript, multi-column pricing grids, dashboards, or when visual layout hierarchy matters.

```json
{
  "name": "atlas_compile",
  "arguments": {
    "url": "https://stripe.com/pricing",
    "format": "markdown",
    "max_output_chars": 30000,
    "force_fresh": false
  }
}
```

**Key Parameters**:
- `format`: `'markdown'` (clean LLM-ready markdown), `'semantic'` (structured AST section graph), or `'markdown+links'` (markdown with navigation links).
- `max_output_chars`: Character budget (default: 30,000). Content exceeding this budget is indexed with a Table of Contents and navigable `atlas://` resource links.
- `force_fresh`: Set `true` to bypass edge cache and force re-compilation from origin.

**Reading Long Compilation Artifacts via MCP Resources**:
If a compiled page produces very large output, inspect the returned `resource_uri` using:
- `atlas://compilations/{job_id}/markdown` — Full formatted Markdown.
- `atlas://compilations/{job_id}/ast` — Structured JSON AST.

---

### Playbook 3: Site Reconnaissance & Hierarchy Discovery (`atlas_map`)

Before launching deep crawls or when exploring unfamiliar APIs/documentation, map the site first to find relevant paths without wasting tokens.

```json
{
  "name": "atlas_map",
  "arguments": {
    "url": "https://docs.anthropic.com",
    "limit": 100,
    "include_subdomains": false,
    "sitemap": "include"
  }
}
```

**Key Parameters**:
- `limit`: Maximum number of URLs to discover (1–500, default: 100).
- `include_subdomains`: Whether to traverse subdomains (default: `false`).
- `sitemap`: `'include'` (checks sitemaps first, then crawls links), `'skip'` (only crawls links), or `'only'` (strictly reads sitemaps).

---

### Playbook 4: Recursive Section Spidering (`atlas_crawl`)

Use `atlas_crawl` to ingest an entire documentation section or guide hierarchy.

```json
{
  "name": "atlas_crawl",
  "arguments": {
    "url": "https://docs.example.com/guides/",
    "max_depth": 2,
    "max_pages": 15,
    "include_paths": ["/guides/**"],
    "exclude_paths": ["*.pdf", "**/changelog/**"]
  }
}
```

**Key Parameters**:
- `max_depth`: Crawl depth from origin (1–5, default: 2).
- `max_pages`: Maximum total pages to spider (1–50, default: 10).
- `include_paths`: Path glob patterns to restrict compilation (e.g., `["/guides/**"]`).
- `exclude_paths`: Path glob patterns to exclude from compilation (e.g., `["*.pdf"]`).

---

### Playbook 5: Parallel Multi-Page Batching (`atlas_batch_compile`)

When you have a known set of URLs (e.g., from search results or comparison benchmarks), retrieve them concurrently with `atlas_batch_compile`.

```json
{
  "name": "atlas_batch_compile",
  "arguments": {
    "urls": [
      "https://example.com/feature-a",
      "https://example.com/feature-b",
      "https://example.com/pricing"
    ],
    "format": "markdown",
    "max_output_chars_per_page": 15000
  }
}
```

**Key Parameters**:
- `urls`: List of URLs to compile in parallel (maximum 20 per call).
- `format`: `'markdown'`, `'semantic'`, or `'markdown+links'`.
- `max_output_chars_per_page`: Character limit allocated per individual page (1,000–50,000, default: 15,000).

---

## 4. Operational Guardrails & Best Practices

1. **Token Budgeting**: Always set an appropriate `max_output_chars`. For standard research summaries, 20,000–30,000 characters is ideal.
2. **SSRF & Private Network Protection**: Atlas strictly rejects egress to private IP ranges (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `127.0.0.1`, `localhost`) and cloud instance metadata (`169.254.169.254`). Do not attempt internal network scans.
3. **Error Handling**:
   - `ATLAS_RATE_LIMITED`: Back off exponentially and reduce concurrency.
   - `ATLAS_SSRF_BLOCKED`: The target resolves to a restricted internal address.
   - `ATLAS_AUTH_INVALID`: Run `npx @atlascompiler/mcp init` to update credentials.
4. **Prefer Map Before Crawl**: For large websites, run `atlas_map` first to inspect the URL structure and craft precise `include_paths` before running `atlas_crawl`.
