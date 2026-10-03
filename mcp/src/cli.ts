#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/server/stdio';
import {
  FileCredentialStore,
  type WizardScope,
  installAtlasSkill,
  maskApiKey,
  resolveAtlasApiKey,
  resolveAtlasApiKeyWithSource,
  runSetupWizard,
} from './auth';
import { createAtlasMcpServer } from './server';

// Load local .env if supported by Node runtime
try {
  if (typeof process.loadEnvFile === 'function') {
    process.loadEnvFile();
  }
} catch {
  // Ignore missing .env
}

// Security Invariant: Disallow API keys passed via command line flags to prevent
// credential leakage in process listings (ps aux) or bash history.
const cliArgs = process.argv.slice(2);
for (const arg of cliArgs) {
  if (arg.startsWith('--api-key') || arg.startsWith('-k')) {
    console.error(
      'Security Error: Passing API keys via CLI flags (--api-key) is prohibited.\n' +
        'Please supply your credentials via ~/.atlas/credentials.json (run: atlas-mcp init) or the ATLAS_API_KEY environment variable.',
    );
    process.exit(1);
  }
}

const firstArg = cliArgs[0]?.toLowerCase();

async function handleInit() {
  let scope: WizardScope | undefined;
  if (cliArgs.includes('--global') || cliArgs.includes('-g')) {
    scope = 'global';
  } else if (cliArgs.includes('--project') || cliArgs.includes('-p')) {
    scope = 'project';
  } else if (cliArgs.includes('--both')) {
    scope = 'both';
  } else if (cliArgs.includes('--skip-editors')) {
    scope = 'skip';
  }

  const skipProbe = cliArgs.includes('--skip-probe');
  await runSetupWizard({ scope, skipProbe });
}

async function handleWhoami() {
  const result = await resolveAtlasApiKeyWithSource();
  if (result.apiKey) {
    console.log('Atlas Credentials:');
    console.log(`  Source:   ${result.source} (${result.location})`);
    console.log(`  API Key:  ${maskApiKey(result.apiKey)}`);
  } else {
    console.log('No Atlas credentials found.');
    console.log(
      'Run `atlas-mcp init` to configure credentials or set ATLAS_API_KEY in your environment.',
    );
  }
}

async function handleLogout() {
  const store = new FileCredentialStore();
  await store.deleteApiKey();
  console.log(`Cleared stored credentials from ${store.getPath()}.`);
}

function handleSkillInstall() {
  const isGlobal = cliArgs.includes('--global') || cliArgs.includes('-g');
  try {
    const result = installAtlasSkill(process.cwd(), isGlobal);
    console.log(`✓ Atlas Agent Skill installed to: ${result.targetPath}`);
    console.log(
      'AI agents (Claude Code, Cursor, Antigravity) in this environment will now discover and use Atlas tools.',
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`Failed to install Agent Skill: ${msg}`);
    process.exit(1);
  }
}

function printHelp() {
  console.log(`
Atlas Model Context Protocol (MCP) CLI

Usage:
  atlas-mcp [command] [options]

Commands:
  (default)            Start the MCP stdio server for Claude, Cursor, and other MCP clients
  init | login | setup Interactive credential setup wizard and editor configuration
    --global, -g       Configure user-level editor settings (Claude, ~/.cursor, Windsurf)
    --project, -p      Configure project-level editor settings (.cursor/mcp.json, .vscode/mcp.json)
    --both             Configure both user-level and project-level editor settings
    --skip-editors     Skip editor configuration during setup
    --skip-probe       Skip network probe verification during setup
  skill [--global, -g] Install the canonical Atlas Agent Skill into .agents/skills/atlas/SKILL.md
  whoami               Check currently active credentials and source
  logout               Clear stored credentials from ~/.atlas/credentials.json
  help, -h, --help     Show this help message

Environment Variables:
  ATLAS_API_KEY        Overrides stored credentials for CI/CD or ephemeral environments
  ATLAS_BASE_URL       Atlas API endpoint (default: https://api.atlas-compiler.com)
`);
}

async function main() {
  if (firstArg === 'init' || firstArg === 'login' || firstArg === 'setup') {
    await handleInit();
    return;
  }

  if (firstArg === 'skill' || firstArg === 'install-skill') {
    handleSkillInstall();
    return;
  }

  if (firstArg === 'whoami') {
    await handleWhoami();
    return;
  }

  if (firstArg === 'logout') {
    await handleLogout();
    return;
  }

  if (firstArg === 'help' || firstArg === '--help' || firstArg === '-h') {
    printHelp();
    return;
  }

  // Default: Start stdio MCP server
  const apiKey = await resolveAtlasApiKey();
  if (!apiKey) {
    console.error(
      '[atlas-mcp] Notice: No Atlas API key found in ATLAS_API_KEY or ~/.atlas/credentials.json.\n' +
        '[atlas-mcp] Execution calls against Atlas API will require valid credentials. Run `atlas-mcp init` to set up.',
    );
  }
  const baseUrl = process.env.ATLAS_BASE_URL ?? 'https://api.atlas-compiler.com';

  const server = createAtlasMcpServer({
    context: {
      apiKey: apiKey ?? undefined,
      baseUrl,
    },
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error('Fatal error in Atlas MCP CLI:', err);
  process.exit(1);
});
