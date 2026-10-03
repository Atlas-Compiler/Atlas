# @atlascompiler/mcp

The official [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server for [Atlas](https://atlas-compiler.com).

Connects AI coding assistants, agents, and LLMs (Cursor, Claude Desktop, Windsurf, ChatGPT, MCP Inspector) directly to Atlas's zero-LLM web compilation pipeline. Provides deterministic, clean markdown extraction, site topology discovery, batch compilation, and bounded crawling without LLM hallucinations or context bloat.

---

## Features

- **0-LLM Deterministic Compilation**: Content is parsed and structured purely through the Atlas web compiler engine—no hallucinated summaries, no injected noise, and no missing data.
- **Context-Window Protection**: Automatic Table of Contents (TOC), section splitting, token budgeting, and explicit truncation banners protect LLM context limits.
- **Modern Protocol Standard**: Implements the `2026-07-28` protocol era with native prompt caching hints (`cacheHints: { ttlMs, cacheScope }`) and asynchronous task tracking via `io.modelcontextprotocol/tasks`.
- **Dual Transports**:
  - **Stdio CLI Bridge**: Run locally with `npx @atlascompiler/mcp` or configure directly into desktop IDEs.
  - **Edge Streamable HTTP**: Native Cloudflare Worker endpoint mounted at `POST /mcp` for remote clients and web agents.
- **Enterprise-Grade Security**:
  - Rejects CLI credential flags (`--api-key`, `-k`) with exit code 1 to eliminate secret exposure in `ps aux` and process inspection.
  - Strict tenant isolation (`WHERE workspace_id = ?1 AND id = ?2`) on all `atlas://` resources.
  - Hostile `Origin` blocking prevents browser-based cross-origin drive-by attacks.
  - All outbound network requests are delegated to `atlas-egress` for zero-trust SSRF protection.

---

## Quick Start

### 1. Interactive Setup Wizard (Recommended)

Run the 1-click interactive setup wizard to validate your API key and automatically configure your desktop editors (Claude Desktop, Cursor, VS Code, Windsurf):

```bash
# Interactive mode (prompts for scope: Global, Project, or Both):
npx -y @atlascompiler/mcp init

# Or preselect scope directly via CLI flags:
npx -y @atlascompiler/mcp init --global    # User-level (Claude, ~/.cursor, Windsurf)
npx -y @atlascompiler/mcp init --project   # Repo-level (.cursor/mcp.json, .vscode/mcp.json)
npx -y @atlascompiler/mcp init --both      # Both user-level and project-level
npx -y @atlascompiler/mcp init --skip-editors # Save credentials only
```

The wizard:
- Prompts for your Atlas API key (`atlas_...`).
- Stores it securely in `~/.atlas/credentials.json` (POSIX `0600` permissions).
- Detects installed editors and merges the Atlas MCP server definition non-destructively without hardcoding sensitive tokens into editor configuration files.
- Distinguishes standard clients (`mcpServers`) from VS Code workspace format (`servers`).
- Optionally installs the canonical Atlas Agent Skill for local or global agent discovery.

### 2. Run Stdio Server Directly

Once configured via `init`, you can run the MCP server with zero flags or environment variables:

```bash
npx -y @atlascompiler/mcp
```

### 3. CI/CD & Headless Environments

In automated pipelines, containerized environments, or ephemeral workers, supply credentials via the `ATLAS_API_KEY` environment variable:

```bash
export ATLAS_API_KEY="atlas_your_api_key_here"
npx -y @atlascompiler/mcp
```

> **Security Note:** Passing API keys via CLI flags (`--api-key` or `-k`) is strictly prohibited and blocked by the CLI to avoid process table inspection leaks. Always use `init` or the `ATLAS_API_KEY` environment variable.

---

## CLI Commands

| Command | Description |
| :--- | :--- |
| `npx @atlascompiler/mcp` | Start stdio MCP server for Claude, Cursor, and other MCP clients. |
| `npx @atlascompiler/mcp init` | Interactive credential setup wizard, editor config, and Agent Skill install. |
| `npx @atlascompiler/mcp init --global` | Setup credentials and configure user-level editors (Claude, ~/.cursor, Windsurf). |
| `npx @atlascompiler/mcp init --project` | Setup credentials and configure repo-level editors (.cursor, .vscode). |
| `npx @atlascompiler/mcp skill` | Install canonical Atlas Agent Skill into project (`.agents/skills/atlas/SKILL.md`). |
| `npx @atlascompiler/mcp skill --global` | Install canonical Atlas Agent Skill globally (`~/.agents/skills/atlas/SKILL.md`). |
| `npx @atlascompiler/mcp whoami` | Inspect active credentials and resolution source (`env` vs `~/.atlas/credentials.json`). |
| `npx @atlascompiler/mcp logout` | Clear saved credentials from `~/.atlas/credentials.json`. |
| `npx @atlascompiler/mcp --help` | Show command line usage. |

---

## Agent Skill Installation

Atlas publishes an official Agent Skill for AI coding agents (Claude Code, Cursor, Antigravity, Windsurf) providing progressive disclosure playbooks for web compilation, scraping, mapping, crawling, and batch extraction.

### Option 1: Via `@atlascompiler/mcp` CLI (Fastest)
```bash
# In your current project:
npx -y @atlascompiler/mcp skill

# Or globally for all projects:
npx -y @atlascompiler/mcp skill --global
```

### Option 2: Via Skills Ecosystem CLI (`npx skills`)
```bash
# Via domain discovery (RFC 8615):
npx skills add atlas-compiler.com

# Or via GitHub repository:
npx skills add redcliffe0003/Atlas
```

### Option 3: Direct Download / Curl
```bash
curl -fsSL https://atlas-compiler.com/skill.md -o .agents/skills/atlas/SKILL.md
```

---

## Client Setup Configurations

Because `@atlascompiler/mcp` resolves credentials directly from `~/.atlas/credentials.json`, your editor configuration files never need hardcoded API keys!

### Cursor IDE

Add the server to your Cursor MCP settings (`~/.cursor/mcp.json` for global, or `.cursor/mcp.json` in your repository for project scope):

```json
{
  "mcpServers": {
    "atlas": {
      "command": "npx",
      "args": ["-y", "@atlascompiler/mcp"]
    }
  }
}
```

### VS Code

Add the server to your project's `.vscode/mcp.json`:

```json
{
  "servers": {
    "atlas": {
      "command": "npx",
      "args": ["-y", "@atlascompiler/mcp"]
    }
  }
}
```

> **Note:** VS Code expects the root key `"servers"`, whereas Cursor, Claude Desktop, and Windsurf use `"mcpServers"`. The `atlas-mcp init` wizard automatically applies the correct format for each editor target.

### Claude Desktop

Add the server to your Claude Desktop configuration:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "atlas": {
      "command": "npx",
      "args": ["-y", "@atlascompiler/mcp"]
    }
  }
}
```

### Windsurf / Codeium

Add the server to `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "atlas": {
      "command": "npx",
      "args": ["-y", "@atlascompiler/mcp"]
    }
  }
}
```

### Remote / Hosted Streamable HTTP (`POST /mcp`)

For remote agents or the official [MCP Inspector](https://github.com/modelcontextprotocol/inspector):

- **Server URL**: `https://api.atlas-compiler.com/mcp`
- **Transport**: Streamable HTTP
- **HTTP Headers**:
  - `Authorization: Bearer atlas_YOUR_API_KEY_HERE`
  - `Content-Type: application/json`
  - `Accept: application/json`
- **OAuth Discovery**: Supports RFC 8414 protected resource discovery at `GET /.well-known/oauth-protected-resource`.

---

## Available MCP Tools

### 1. `atlas_compile`
Compile any web page into a structured, high-density markdown document optimized for LLM reasoning.

```ts
{
  url: string;               // Required: Absolute HTTP/HTTPS URL
  format?: 'markdown' | 'semantic'; // 'semantic' includes heading boundaries & section IDs
  max_output_chars?: number; // Maximum characters to return in the tool response (default: 25000)
  include_toc?: boolean;     // Prepend a structured Table of Contents (default: true)
  force_fresh?: boolean;     // Bypass CDN and cache layers (default: false)
}
```

**Example Agent Invocation:**
> *"Compile the Stripe payment intents documentation at `https://docs.stripe.com/api/payment_intents` and show me the API parameters."*

---

### 2. `atlas_scrape`
Fast, lightweight single-page extraction when deep compilation isn't required.

```ts
{
  url: string;                          // Required: Absolute HTTP/HTTPS URL
  formats?: Array<'markdown' | 'links' | 'text'>; // Formats to extract (default: ['markdown'])
  max_output_chars?: number;            // Capping threshold (default: 20000)
  timeout_ms?: number;                  // Maximum fetch timeout (default: 15000)
}
```

**Example Agent Invocation:**
> *"Scrape the main text and links from `https://news.ycombinator.com`."*

---

### 3. `atlas_map`
Discover site topology, sitemaps, and reachable URLs on a target domain without downloading page bodies.

```ts
{
  url: string;                          // Required: Root URL or domain
  limit?: number;                       // Maximum URLs to return (1-500, default: 100)
  include_subdomains?: boolean;         // Follow subdomains (default: false)
  sitemap?: 'include' | 'only' | 'ignore'; // Sitemap handling strategy (default: 'include')
}
```

**Example Agent Invocation:**
> *"Map the documentation pages on `https://docs.github.com` so we know what guides are available."*

---

### 4. `atlas_batch_compile`
Compile multiple pages in parallel (up to 20 URLs) with per-document success/failure aggregation.

```ts
{
  urls: string[];                       // Required: Array of 1 to 20 URLs
  format?: 'markdown' | 'semantic';     // Content format
  max_output_chars_per_page?: number;   // Character cap per document (default: 15000)
}
```

**Example Agent Invocation:**
> *"Compile these 3 release note pages simultaneously: `['https://site.com/v1', 'https://site.com/v2', 'https://site.com/v3']`."*

---

### 5. `atlas_crawl`
Bounded crawl of a website starting from a seed URL with link discovery, depth limits, and path filtering.

```ts
{
  url: string;               // Required: Seed URL to begin crawling
  max_pages?: number;        // Maximum pages to process (1-20, default: 10)
  max_depth?: number;        // Maximum link hops (1-3, default: 2)
  include_paths?: string[];  // URL path substrings to require (e.g. ['/docs/', '/guides/'])
  exclude_paths?: string[];  // URL path substrings to skip (e.g. ['/changelog/', '/blog/'])
}
```

**Example Agent Invocation:**
> *"Crawl up to 10 pages in `/docs/` starting from `https://example.com/docs/welcome`."*

---

## Available MCP Resources (`atlas://`)

The server exposes deterministic resource URIs that allow AI agents to retrieve full document contents on demand without polluting tool call logs:

| Resource URI Template | Description |
| :--- | :--- |
| `atlas://compilations/{id}` | Complete compiled markdown document corresponding to compilation `{id}`. |
| `atlas://compilations/{id}/sections/{section_id}` | Specific heading section or slice from compilation `{id}`. |
| `atlas://crawls/{id}` | Full crawl manifest, discovered URLs, HTTP status codes, and artifact pointers. |

All resource reads enforce workspace tenant isolation (`WHERE workspace_id = ?1 AND id = ?2`). Cross-tenant access fails closed with `ATLAS_RESOURCE_NOT_FOUND` to eliminate data leakage.

---

## Programmatic Usage

You can also embed and customize `@atlascompiler/mcp` inside your own Node.js or TypeScript applications:

```ts
import { createAtlasMcpServer } from '@atlascompiler/mcp';
import { StdioServerTransport } from '@modelcontextprotocol/server';

const server = createAtlasMcpServer({
  context: {
    apiKey: process.env.ATLAS_API_KEY,
    baseUrl: 'https://api.atlas-compiler.com',
  },
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

### Providing Custom Executors (Testing / Stubs)

```ts
const server = createAtlasMcpServer({
  scrapeExecutor: async (args) => ({
    url: args.url,
    markdown: '# Mock Content',
    status: 200,
  }),
});
```

---

## Environment Variables

| Variable | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `ATLAS_API_KEY` | **Yes** | — | Your Atlas workspace API key (`atlas_...`). |
| `ATLAS_BASE_URL` | No | `https://api.atlas-compiler.com` | Base URL of the Atlas API or self-hosted backend. |

---

## Development & Testing

```bash
# Install dependencies
pnpm install

# Run unit and conformance tests (Vitest)
pnpm test

# Check types
pnpm typecheck

# Check code formatting & linting (Biome)
pnpm lint

# Build ESM & TypeScript declaration bundle
pnpm build
```

---

## License

MIT © [Atlas Compiler](https://atlas-compiler.com)
