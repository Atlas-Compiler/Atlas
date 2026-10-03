# Node.js Basic Compilation Example

This example demonstrates how to compile a web page into clean, LLM-ready markdown using the official Atlas JavaScript SDK (`@atlascompiler/sdk`).

## Prerequisites

- Node.js 18+
- An Atlas API key from the [Atlas Dashboard](https://dashboard.atlas-compiler.com)

## Setup

```bash
export ATLAS_API_KEY="atlas_..."
npm install
```

## Run

```bash
npm start
# Or compile a specific URL:
node index.js https://news.ycombinator.com
```
