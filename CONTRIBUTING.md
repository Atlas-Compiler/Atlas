# Contributing to Atlas

Thank you for your interest in contributing to **Atlas**!

Atlas is high-performance web intelligence infrastructure designed for AI agents, LLM pipelines, and developers. This repository hosts our official client SDKs (TypeScript, Python, Go), the Model Context Protocol (MCP) server, Agent Skills, and example recipes.

---

## 💬 Community & Discussions

Before embarking on significant feature development, we encourage you to discuss your proposal with the team:

- **Discord Community**: [Join the Atlas Discord](https://discord.gg/z9ktRhuudq) (`#general-dev` and `#ai-mcp` channels)
- **GitHub Discussions**: [Ask questions & propose ideas](https://github.com/Atlas-Compiler/Atlas/discussions)
- **Issues**: [Browse open issues](https://github.com/Atlas-Compiler/Atlas/issues)

---

## 🛠 Repository Structure

This repository is organized as follows:

```
atlas/
├── mcp/            Official Model Context Protocol server (@atlascompiler/mcp)
├── sdk/
│   ├── js/         Official TypeScript/JavaScript SDK (@atlascompiler/sdk)
│   ├── python/     Official Python SDK (atlascompiler)
│   └── go/         Official Go client library (go.atlas-compiler.com/sdk)
├── skills/
│   └── atlas/      Canonical Agent Skill for Cursor, Claude Desktop & Windsurf
└── examples/       Integration starter templates (Node, Python, Go, cURL)
```

---

## 🚀 Development Workflow

### Prerequisites
- Node.js >= 22
- pnpm >= 9
- Python >= 3.10
- Go >= 1.22

### Quick Start
1. **Fork and clone** this repository.
2. **Create a topic branch**: `git checkout -b feat/your-feature-name`.
3. **Make your changes** in the relevant directory (`mcp/`, `sdk/js/`, `sdk/python/`, etc.).
4. **Test your code locally**:
   - TypeScript/JS: `pnpm --filter @atlascompiler/sdk test`
   - MCP Server: `pnpm --filter @atlascompiler/mcp test`
   - Python: `pytest sdk/python`
   - Go: `cd sdk/go && go test ./...`
5. **Commit using Conventional Commits**:
   ```bash
   git commit -m "feat(sdk-js): add support for custom request timeout"
   ```
6. **Open a Pull Request** against `main`.

---

## 📝 Commit Conventions

We enforce [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — A new user-facing feature or enhancement
- `fix:` — A bug fix
- `docs:` — Documentation changes
- `perf:` — Performance optimization
- `test:` — Adding or updating test cases
- `chore:` — Maintenance or dependency updates

---

## 🔒 Security & Vulnerability Reporting

Please **DO NOT** disclose security vulnerabilities via public GitHub issues.  
Report security concerns privately to: **support@atlas-compiler.com**.

We respond within 24 hours and coordinate responsible disclosure.

---

## 📜 License

By contributing to Atlas, you agree that your contributions will be licensed under the project's [MIT License](./LICENSE).
