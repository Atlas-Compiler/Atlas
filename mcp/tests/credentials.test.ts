import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  FileCredentialStore,
  getBundledSkillContent,
  getDetectedEditorConfigs,
  installAtlasSkill,
  maskApiKey,
  mergeMcpConfig,
  resolveAtlasApiKey,
  resolveAtlasApiKeyWithSource,
  validateApiKey,
} from '../src/auth';

describe('Atlas MCP Credentials & Setup Wizard Suite', () => {
  let tempDir: string;
  let credPath: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-mcp-test-'));
    credPath = path.join(tempDir, 'credentials.json');
  });

  afterEach(() => {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup error
    }
  });

  describe('FileCredentialStore', () => {
    it('returns null when credential file does not exist', async () => {
      const store = new FileCredentialStore(credPath);
      const key = await store.getApiKey();
      expect(key).toBeNull();
    });

    it('saves API key with atomic write and reads it back', async () => {
      const store = new FileCredentialStore(credPath);
      const sampleKey = 'atlas_abcdef1234567890abcdef1234567890abcdef12345';
      await store.saveApiKey(sampleKey);

      expect(fs.existsSync(credPath)).toBe(true);

      // Verify file permissions on POSIX systems
      if (process.platform !== 'win32') {
        const stats = fs.statSync(credPath);
        // Mode 0600 is 0o100600 in stat
        expect(stats.mode & 0o777).toBe(0o600);
      }

      const key = await store.getApiKey();
      expect(key).toBe(sampleKey);

      const raw = JSON.parse(fs.readFileSync(credPath, 'utf8'));
      expect(raw.apiKey).toBe(sampleKey);
      expect(raw.createdAt).toBeDefined();
      expect(raw.updatedAt).toBeDefined();
    });

    it('preserves original createdAt when updating an existing API key', async () => {
      const store = new FileCredentialStore(credPath);
      await store.saveApiKey('atlas_key1_1234567890abcdef1234567890abcdef12345');
      const firstData = JSON.parse(fs.readFileSync(credPath, 'utf8'));

      // Wait 5ms to guarantee distinct timestamps
      await new Promise((r) => setTimeout(r, 10));

      await store.saveApiKey('atlas_key2_1234567890abcdef1234567890abcdef12345');
      const secondData = JSON.parse(fs.readFileSync(credPath, 'utf8'));

      expect(secondData.apiKey).toBe('atlas_key2_1234567890abcdef1234567890abcdef12345');
      expect(secondData.createdAt).toBe(firstData.createdAt);
      expect(new Date(secondData.updatedAt).getTime()).toBeGreaterThanOrEqual(
        new Date(firstData.updatedAt).getTime(),
      );
    });

    it('gracefully returns null if file contains malformed JSON or empty text', async () => {
      fs.writeFileSync(credPath, '{ malformed json content ...');
      const store = new FileCredentialStore(credPath);
      expect(await store.getApiKey()).toBeNull();

      fs.writeFileSync(credPath, '   \n  ');
      expect(await store.getApiKey()).toBeNull();
    });

    it('deletes credentials idempotently', async () => {
      const store = new FileCredentialStore(credPath);
      await store.saveApiKey('atlas_key_1234567890abcdef1234567890abcdef12345');
      expect(fs.existsSync(credPath)).toBe(true);

      await store.deleteApiKey();
      expect(fs.existsSync(credPath)).toBe(false);

      // Subsequent delete does not throw
      await expect(store.deleteApiKey()).resolves.not.toThrow();
    });

    it('rejects saving empty or whitespace-only API keys', async () => {
      const store = new FileCredentialStore(credPath);
      await expect(store.saveApiKey('')).rejects.toThrow('Cannot save an empty API key.');
      await expect(store.saveApiKey('   ')).rejects.toThrow('Cannot save an empty API key.');
    });
  });

  describe('Universal Credential Resolution Precedence', () => {
    it('prioritizes ATLAS_API_KEY environment variable over credential store', async () => {
      const store = new FileCredentialStore(credPath);
      await store.saveApiKey('atlas_store_key_1234567890abcdef1234567890abcde');

      const resolved = await resolveAtlasApiKeyWithSource({
        store,
        env: { ATLAS_API_KEY: 'atlas_env_override_key_1234567890abcdef123' },
      });

      expect(resolved.apiKey).toBe('atlas_env_override_key_1234567890abcdef123');
      expect(resolved.source).toBe('env');
      expect(resolved.location).toBe('process.env.ATLAS_API_KEY');

      const plainResolved = await resolveAtlasApiKey({
        store,
        env: { ATLAS_API_KEY: 'atlas_env_override_key_1234567890abcdef123' },
      });
      expect(plainResolved).toBe('atlas_env_override_key_1234567890abcdef123');
    });

    it('falls back to CredentialStore when environment variable is unset or whitespace', async () => {
      const store = new FileCredentialStore(credPath);
      await store.saveApiKey('atlas_store_key_1234567890abcdef1234567890abcde');

      const resolved = await resolveAtlasApiKeyWithSource({
        store,
        env: { ATLAS_API_KEY: '   ' },
      });

      expect(resolved.apiKey).toBe('atlas_store_key_1234567890abcdef1234567890abcde');
      expect(resolved.source).toBe('store');
      expect(resolved.location).toBe(credPath);
    });

    it('returns null and source none when neither env nor store contains credentials', async () => {
      const store = new FileCredentialStore(credPath);

      const resolved = await resolveAtlasApiKeyWithSource({
        store,
        env: {},
      });

      expect(resolved.apiKey).toBeNull();
      expect(resolved.source).toBe('none');
    });
  });

  describe('API Key Format Validation & Masking', () => {
    it('validates canonical atlas_ format (43 chars payload)', () => {
      // 43 alphanumeric/underscore/dash chars after atlas_
      const validAtlasKey = 'atlas_1234567890123456789012345678901234567890123';
      expect(validateApiKey(validAtlasKey)).toBe(true);

      // Too short
      expect(validateApiKey('atlas_short')).toBe(false);
      // Bad characters
      expect(validateApiKey('atlas_123456789012345678901234567890123456789012$')).toBe(false);
    });

    it('validates ak_live_ and ak_test_ formats (32-64 chars payload)', () => {
      const liveKey = 'ak_live_abcdef1234567890abcdef1234567890';
      const testKey = 'ak_test_abcdef1234567890abcdef1234567890';
      expect(validateApiKey(liveKey)).toBe(true);
      expect(validateApiKey(testKey)).toBe(true);

      // Unsupported prefix
      expect(validateApiKey('sk_test_1234567890abcdef1234567890')).toBe(false);
    });

    it('safely masks API keys for logging and CLI display', () => {
      const fullKey = 'atlas_1234567890123456789012345678901234567890123';
      const masked = maskApiKey(fullKey);
      expect(masked).toBe('atlas_12...0123');
      expect(masked).not.toContain('12345678901234567890');

      expect(maskApiKey('short')).toBe('***');
    });
  });

  describe('Editor Configuration Non-Destructive Merging (mergeMcpConfig)', () => {
    it('creates new config file with atlas server if file does not exist', () => {
      const editorConfigPath = path.join(tempDir, 'claude_desktop_config.json');

      const result = mergeMcpConfig(editorConfigPath);
      expect(result.previousServers).toEqual([]);
      expect(result.updatedServers).toEqual(['atlas']);

      const parsed = JSON.parse(fs.readFileSync(editorConfigPath, 'utf8'));
      expect(parsed.mcpServers.atlas).toEqual({
        command: 'npx',
        args: ['-y', '@atlascompiler/mcp'],
      });
      // Invariant: zero secrets in editor configuration
      expect(JSON.stringify(parsed)).not.toContain('ATLAS_API_KEY');
    });

    it('preserves third-party MCP servers when injecting atlas', () => {
      const editorConfigPath = path.join(tempDir, 'mcp.json');
      const initialConfig = {
        theme: 'dark',
        mcpServers: {
          github: {
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-github'],
            env: { GITHUB_TOKEN: 'ghp_secret' },
          },
          postgres: {
            command: 'docker',
            args: ['run', '-i', '--rm', 'mcp/postgres'],
          },
        },
      };

      fs.writeFileSync(editorConfigPath, JSON.stringify(initialConfig, null, 2));

      const result = mergeMcpConfig(editorConfigPath);
      expect(result.previousServers).toEqual(['github', 'postgres']);
      expect(result.updatedServers).toEqual(['github', 'postgres', 'atlas']);

      const updated = JSON.parse(fs.readFileSync(editorConfigPath, 'utf8'));
      expect(updated.theme).toBe('dark');
      expect(updated.mcpServers.github.env.GITHUB_TOKEN).toBe('ghp_secret');
      expect(updated.mcpServers.postgres.command).toBe('docker');
      expect(updated.mcpServers.atlas).toEqual({
        command: 'npx',
        args: ['-y', '@atlascompiler/mcp'],
      });
    });

    it('merges MCP server into VS Code workspace config using servers root key', () => {
      const vscodeConfigPath = path.join(tempDir, '.vscode', 'mcp.json');
      const initialConfig = {
        servers: {
          existingServer: {
            command: 'node',
            args: ['./server.js'],
          },
        },
      };
      fs.mkdirSync(path.dirname(vscodeConfigPath), { recursive: true });
      fs.writeFileSync(vscodeConfigPath, JSON.stringify(initialConfig, null, 2));

      const result = mergeMcpConfig(vscodeConfigPath, 'atlas', 'vscode');
      expect(result.previousServers).toEqual(['existingServer']);
      expect(result.updatedServers).toEqual(['existingServer', 'atlas']);

      const parsed = JSON.parse(fs.readFileSync(vscodeConfigPath, 'utf8'));
      expect(parsed.servers).toBeDefined();
      expect(parsed.mcpServers).toBeUndefined();
      expect(parsed.servers.atlas).toEqual({
        command: 'npx',
        args: ['-y', '@atlascompiler/mcp'],
      });
      expect(parsed.servers.existingServer).toEqual({
        command: 'node',
        args: ['./server.js'],
      });
    });

    it('throws descriptive error if target file has corrupt/invalid JSON without modifying it', () => {
      const editorConfigPath = path.join(tempDir, 'corrupt.json');
      const corruptContent = '{ "mcpServers": { incomplete json ';
      fs.writeFileSync(editorConfigPath, corruptContent);

      expect(() => mergeMcpConfig(editorConfigPath)).toThrow(
        /Failed to parse existing config.*Manual inspection required/,
      );

      // Verify original file was not modified or overwritten
      expect(fs.readFileSync(editorConfigPath, 'utf8')).toBe(corruptContent);
    });
  });

  describe('Editor Target Detection (getDetectedEditorConfigs)', () => {
    it('detects both global and project editor targets with correct scopes and formats', () => {
      const fakeHome = path.join(tempDir, 'fake-home');
      const fakeProject = path.join(tempDir, 'fake-project');
      fs.mkdirSync(fakeHome, { recursive: true });
      fs.mkdirSync(fakeProject, { recursive: true });

      const targets = getDetectedEditorConfigs(fakeHome, fakeProject);

      // Verify target count and scopes
      const globalTargets = targets.filter((t) => t.scope === 'global');
      const projectTargets = targets.filter((t) => t.scope === 'project');

      expect(globalTargets.length).toBe(3); // Claude, Cursor (Global), Windsurf (Global)
      expect(projectTargets.length).toBe(2); // Cursor (Project), VS Code (Project)

      // Verify project targets use projectDir
      const cursorProject = targets.find((t) => t.name === 'Cursor (Project)');
      expect(cursorProject?.configPath).toBe(path.join(fakeProject, '.cursor', 'mcp.json'));
      expect(cursorProject?.format).toBe('standard');

      const vscodeProject = targets.find((t) => t.name === 'VS Code (Project)');
      expect(vscodeProject?.configPath).toBe(path.join(fakeProject, '.vscode', 'mcp.json'));
      expect(vscodeProject?.format).toBe('vscode');
    });
  });

  describe('Agent Skill Bundling and Installation (installAtlasSkill)', () => {
    it('retrieves bundled skill content with valid YAML frontmatter', () => {
      const content = getBundledSkillContent();
      expect(content).toContain('name: atlas');
      expect(content).toContain('description:');
      expect(content).toContain('atlas_scrape');
      expect(content).toContain('atlas_batch_compile');
    });

    it('installs the skill to .agents/skills/atlas/SKILL.md in the target directory', () => {
      const result = installAtlasSkill(tempDir, false);
      expect(result.isNew).toBe(true);
      expect(result.targetPath).toBe(path.join(tempDir, '.agents', 'skills', 'atlas', 'SKILL.md'));
      expect(fs.existsSync(result.targetPath)).toBe(true);

      const writtenContent = fs.readFileSync(result.targetPath, 'utf8');
      expect(writtenContent).toBe(getBundledSkillContent());

      // Subsequent install updates idempotently
      const secondResult = installAtlasSkill(tempDir, false);
      expect(secondResult.isNew).toBe(false);
    });
  });
});
