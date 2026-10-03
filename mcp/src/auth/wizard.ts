import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import * as readline from 'node:readline/promises';
import { fileURLToPath } from 'node:url';
import { FileCredentialStore } from './store';

export const API_KEY_REGEX = /^(atlas_[A-Za-z0-9_-]{43}|ak_(live|test)_[0-9A-Za-z]{32,64})$/;

export function validateApiKey(key: string): boolean {
  return API_KEY_REGEX.test(key.trim());
}

export function maskApiKey(key: string): string {
  const trimmed = key.trim();
  if (trimmed.length <= 10) {
    return '***';
  }
  return `${trimmed.slice(0, 8)}...${trimmed.slice(-4)}`;
}

export type ConfigScope = 'global' | 'project';
export type ConfigFormat = 'standard' | 'vscode';

export interface EditorConfigTarget {
  name: string;
  configPath: string;
  exists: boolean;
  scope: ConfigScope;
  format: ConfigFormat;
}

export function getDetectedEditorConfigs(
  homeDir: string = os.homedir(),
  projectDir: string = process.cwd(),
): EditorConfigTarget[] {
  const targets: EditorConfigTarget[] = [];
  const platform = process.platform;

  // 1. Claude Desktop (Global)
  let claudeConfigPath: string;
  if (platform === 'darwin') {
    claudeConfigPath = path.join(
      homeDir,
      'Library',
      'Application Support',
      'Claude',
      'claude_desktop_config.json',
    );
  } else if (platform === 'win32') {
    const appData = process.env.APPDATA || path.join(homeDir, 'AppData', 'Roaming');
    claudeConfigPath = path.join(appData, 'Claude', 'claude_desktop_config.json');
  } else {
    claudeConfigPath = path.join(homeDir, '.config', 'Claude', 'claude_desktop_config.json');
  }

  targets.push({
    name: 'Claude Desktop',
    configPath: claudeConfigPath,
    exists: fs.existsSync(claudeConfigPath),
    scope: 'global',
    format: 'standard',
  });

  // 2. Cursor (Global)
  const cursorGlobalPath = path.join(homeDir, '.cursor', 'mcp.json');
  targets.push({
    name: 'Cursor (Global)',
    configPath: cursorGlobalPath,
    exists: fs.existsSync(cursorGlobalPath),
    scope: 'global',
    format: 'standard',
  });

  // 3. Windsurf (Global)
  const windsurfGlobalPath = path.join(homeDir, '.codeium', 'windsurf', 'mcp_config.json');
  targets.push({
    name: 'Windsurf (Global)',
    configPath: windsurfGlobalPath,
    exists: fs.existsSync(windsurfGlobalPath),
    scope: 'global',
    format: 'standard',
  });

  // 4. Cursor (Project-level in current working directory)
  const cursorProjectPath = path.join(projectDir, '.cursor', 'mcp.json');
  targets.push({
    name: 'Cursor (Project)',
    configPath: cursorProjectPath,
    exists: fs.existsSync(cursorProjectPath),
    scope: 'project',
    format: 'standard',
  });

  // 5. VS Code (Workspace-level in current working directory)
  const vscodeProjectPath = path.join(projectDir, '.vscode', 'mcp.json');
  targets.push({
    name: 'VS Code (Project)',
    configPath: vscodeProjectPath,
    exists: fs.existsSync(vscodeProjectPath),
    scope: 'project',
    format: 'vscode',
  });

  return targets;
}

/**
 * Non-destructively merges the Atlas MCP server definition into an editor configuration file.
 * Preserves all third-party servers and user properties.
 */
export function mergeMcpConfig(
  configPath: string,
  serverName = 'atlas',
  format: ConfigFormat = 'standard',
): { previousServers: string[]; updatedServers: string[] } {
  let existingJson: Record<string, unknown> = {};

  if (fs.existsSync(configPath)) {
    const raw = fs.readFileSync(configPath, 'utf8');
    if (raw.trim()) {
      try {
        existingJson = JSON.parse(raw);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        throw new Error(
          `Failed to parse existing config at ${configPath}: ${msg}. Manual inspection required to avoid overwriting invalid JSON.`,
        );
      }
    }
  }

  const rootKey = format === 'vscode' ? 'servers' : 'mcpServers';
  const existingServers = (existingJson[rootKey] as Record<string, unknown> | undefined) ?? {};
  const previousServers = Object.keys(existingServers);

  // Inject or update Atlas MCP server definition without hardcoding secrets
  const updatedServers: Record<string, unknown> = {
    ...existingServers,
    [serverName]: {
      command: 'npx',
      args: ['-y', '@atlascompiler/mcp'],
    },
  };

  const updatedConfig = {
    ...existingJson,
    [rootKey]: updatedServers,
  };

  const dir = path.dirname(configPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Atomic write
  const tempPath = `${configPath}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tempPath, `${JSON.stringify(updatedConfig, null, 2)}\n`, 'utf8');
  fs.renameSync(tempPath, configPath);

  return {
    previousServers,
    updatedServers: Object.keys(updatedServers),
  };
}

export function getBundledSkillContent(): string {
  if (typeof import.meta.url !== 'string' || !import.meta.url.startsWith('file:')) {
    throw new Error(
      'Unable to resolve package directory: import.meta.url is not a valid file URL.',
    );
  }
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    path.resolve(currentDir, '../skills/atlas/SKILL.md'),
    path.resolve(currentDir, '../../skills/atlas/SKILL.md'),
    path.resolve(currentDir, '../../../skills/atlas/SKILL.md'),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return fs.readFileSync(candidate, 'utf8');
    }
  }
  throw new Error('Bundled Atlas SKILL.md could not be found.');
}

export function installAtlasSkill(
  targetBaseDir: string = process.cwd(),
  isGlobal = false,
): { targetPath: string; isNew: boolean } {
  const content = getBundledSkillContent();
  const targetDir = isGlobal
    ? path.join(os.homedir(), '.agents', 'skills', 'atlas')
    : path.join(targetBaseDir, '.agents', 'skills', 'atlas');

  const targetFile = path.join(targetDir, 'SKILL.md');
  const isNew = !fs.existsSync(targetFile);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const tempFile = `${targetFile}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tempFile, content, 'utf8');
  fs.renameSync(tempFile, targetFile);

  return { targetPath: targetFile, isNew };
}

export async function probeAtlasApiKey(
  apiKey: string,
  baseUrl = 'https://api.atlas-compiler.com',
): Promise<{ success: boolean; message: string }> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'User-Agent': 'Atlas-MCP-Init-Probe/1.0',
      },
      signal: controller.signal,
    }).finally(() => clearTimeout(timer));

    if (res.ok) {
      return { success: true, message: 'Atlas API probe succeeded.' };
    }
    if (res.status === 401 || res.status === 403) {
      return {
        success: false,
        message: 'Atlas API rejected key: Invalid or unauthorized credentials.',
      };
    }
    return {
      success: true,
      message: `Atlas API returned HTTP ${res.status}; key format is valid.`,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      success: true,
      message: `Could not reach Atlas API (${msg}); proceeding with format validation.`,
    };
  }
}

export type WizardScope = 'global' | 'project' | 'both' | 'skip';

export interface SetupWizardOptions {
  apiKey?: string;
  store?: FileCredentialStore;
  skipProbe?: boolean;
  scope?: WizardScope;
  projectDir?: string;
  rlInterface?: readline.Interface;
}

async function promptForApiKey(
  rl: readline.Interface,
  store: FileCredentialStore,
  initialKey?: string,
): Promise<string | null> {
  if (initialKey?.trim()) {
    return initialKey.trim();
  }

  const existingKey = await store.getApiKey();
  if (existingKey) {
    console.log(`Found existing credentials at: ${store.getPath()}`);
    console.log(`Active Key: ${maskApiKey(existingKey)}`);
    const replaceAns = await rl.question(
      'Do you want to overwrite this key with a new one? [y/N]: ',
    );
    if (!replaceAns.trim().toLowerCase().startsWith('y')) {
      return existingKey;
    }
  }

  while (true) {
    const input = await rl.question('Enter your Atlas API Key (atlas_... or ak_live_...): ');
    const trimmed = input.trim();
    if (!trimmed) {
      console.log('API key cannot be empty. Please try again.');
      continue;
    }
    if (!validateApiKey(trimmed)) {
      console.log(
        'Invalid API key format. Expected format: atlas_<43 chars> or ak_live_<32-64 chars>.',
      );
      const retry = await rl.question('Try again? [Y/n]: ');
      if (retry.trim().toLowerCase().startsWith('n')) {
        return null;
      }
      continue;
    }
    return trimmed;
  }
}

async function probeApiKeyWithConfirmation(
  rl: readline.Interface,
  apiKey: string,
): Promise<boolean> {
  process.stdout.write('Probing Atlas endpoint... ');
  const probeResult = await probeAtlasApiKey(apiKey);
  console.log(probeResult.success ? 'OK' : 'Warning');
  if (!probeResult.success) {
    console.warn(`[!] ${probeResult.message}`);
    const cont = await rl.question('Save key anyway? [Y/n]: ');
    if (cont.trim().toLowerCase().startsWith('n')) {
      return false;
    }
  }
  return true;
}

async function selectScope(
  rl: readline.Interface,
  preselected?: WizardScope,
): Promise<WizardScope> {
  if (preselected) {
    return preselected;
  }

  console.log('\n--- MCP Editor Configuration ---');
  console.log('Where would you like to configure Atlas MCP?');
  console.log('  1) Global / User-Level (Claude Desktop, ~/.cursor/mcp.json, Windsurf) [Default]');
  console.log(
    '  2) Project-Level (Configure for this repository: .cursor/mcp.json, .vscode/mcp.json)',
  );
  console.log('  3) Both Global & Project-Level');
  console.log('  4) Skip editor configuration');

  const answer = await rl.question('Select scope [1-4] (Default: 1): ');
  const trimmed = answer.trim().toLowerCase();

  if (trimmed === '2' || trimmed.startsWith('p')) return 'project';
  if (trimmed === '3' || trimmed.startsWith('b')) return 'both';
  if (trimmed === '4' || trimmed.startsWith('s')) return 'skip';
  return 'global';
}

async function configureSingleEditor(
  rl: readline.Interface,
  editor: EditorConfigTarget,
): Promise<void> {
  const scopeTag = editor.scope === 'global' ? '[Global]' : '[Project]';
  const promptText = editor.exists
    ? `Configure Atlas MCP in ${editor.name} ${scopeTag} (${editor.configPath})? [Y/n]: `
    : `Initialize Atlas MCP in ${editor.name} ${scopeTag} (${editor.configPath})? [Y/n]: `;

  const answer = await rl.question(promptText);
  if (answer.trim() && !answer.trim().toLowerCase().startsWith('y')) {
    console.log(`  Skipped ${editor.name}.`);
    return;
  }

  try {
    const res = mergeMcpConfig(editor.configPath, 'atlas', editor.format);
    console.log(
      `  ✓ Configured ${editor.name}. Active MCP servers: [${res.updatedServers.join(', ')}]`,
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  ✗ Failed to configure ${editor.name}: ${msg}`);
  }
}

async function configureEditors(
  rl: readline.Interface,
  scope: WizardScope,
  projectDir: string,
): Promise<void> {
  if (scope === 'skip') {
    console.log('Skipped editor configuration.');
    return;
  }

  console.log('\n--- Editor & Agent Integration ---');
  const allEditors = getDetectedEditorConfigs(os.homedir(), projectDir);
  const targets = allEditors.filter((editor) => {
    if (scope === 'both') return true;
    return editor.scope === scope;
  });

  for (const editor of targets) {
    await configureSingleEditor(rl, editor);
  }
}

async function promptSkillInstallation(
  rl: readline.Interface,
  projectDir = process.cwd(),
): Promise<void> {
  console.log('\n--- Agent Skill Installation ---');
  console.log('Install the canonical Atlas Agent Skill (.agents/skills/atlas/SKILL.md)?');
  console.log('  1) In this project (.agents/skills/atlas/SKILL.md) [Default]');
  console.log('  2) Globally for all projects (~/.agents/skills/atlas/SKILL.md)');
  console.log('  3) Skip skill installation');

  const ans = await rl.question('Select option [1-3] (Default: 1): ');
  const trimmed = ans.trim();

  if (trimmed === '2' || trimmed.toLowerCase().startsWith('g')) {
    try {
      const res = installAtlasSkill(projectDir, true);
      console.log(`  ✓ Installed Atlas Agent Skill globally to: ${res.targetPath}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  ✗ Failed to install global Agent Skill: ${msg}`);
    }
  } else if (trimmed === '3' || trimmed.toLowerCase().startsWith('s')) {
    console.log('  Skipped Agent Skill installation.');
  } else {
    try {
      const res = installAtlasSkill(projectDir, false);
      console.log(`  ✓ Installed Atlas Agent Skill to: ${res.targetPath}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  ✗ Failed to install Agent Skill: ${msg}`);
    }
  }
}

export async function runSetupWizard(options: SetupWizardOptions = {}): Promise<void> {
  const store = options.store ?? new FileCredentialStore();
  const rl =
    options.rlInterface ??
    readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

  const shouldCloseRl = !options.rlInterface;
  const projectDir = options.projectDir ?? process.cwd();

  try {
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║       Atlas MCP - Zero-Friction Credential Setup          ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

    const apiKey = await promptForApiKey(rl, store, options.apiKey);
    if (!apiKey) {
      console.log('Setup aborted.');
      return;
    }

    if (!options.skipProbe) {
      const confirmed = await probeApiKeyWithConfirmation(rl, apiKey);
      if (!confirmed) {
        console.log('Setup cancelled.');
        return;
      }
    }

    await store.saveApiKey(apiKey);
    console.log(`\n✓ Securely saved credentials to: ${store.getPath()}`);

    const scope = await selectScope(rl, options.scope);
    await configureEditors(rl, scope, projectDir);
    await promptSkillInstallation(rl, projectDir);

    console.log('\n✨ Atlas MCP setup completed successfully!');
    console.log('You can now run:');
    console.log('  npx -y @atlascompiler/mcp');
    console.log('or use Atlas tools directly in your AI assistant!\n');
  } finally {
    if (shouldCloseRl) {
      rl.close();
    }
  }
}
