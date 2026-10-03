import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('Stdio CLI Bridge Suite (@atlascompiler/mcp)', () => {
  const cliPath = resolve(__dirname, '../dist/cli.js');

  it('strictly rejects --api-key CLI flag to prevent credential exposure in process listings', async () => {
    const child = spawn('node', [cliPath, '--api-key', 'atlas_live_secretkey12345']);

    let stderr = '';
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    const exitCode = await new Promise<number>((resolve) => {
      child.on('close', (code) => resolve(code ?? -1));
    });

    expect(exitCode).toBe(1);
    expect(stderr).toContain('Security Error: Passing API keys via CLI flags (--api-key) is prohibited.');
    expect(stderr).toContain('ATLAS_API_KEY environment variable');
  });

  it('strictly rejects -k shorthand flag as well', async () => {
    const child = spawn('node', [cliPath, '-k', 'atlas_live_secretkey12345']);

    let stderr = '';
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    const exitCode = await new Promise<number>((resolve) => {
      child.on('close', (code) => resolve(code ?? -1));
    });

    expect(exitCode).toBe(1);
    expect(stderr).toContain('Security Error: Passing API keys via CLI flags (--api-key) is prohibited.');
  });

  it('boots in stdio mode and responds to JSON-RPC tools/list', async () => {
    const child = spawn('node', [cliPath], {
      env: {
        ...process.env,
        ATLAS_API_KEY: 'atlas_test_dummy_key',
      },
    });

    const responsePromise = new Promise<any>((resolve, reject) => {
      let buffer = '';
      child.stdout.on('data', (chunk) => {
        buffer += chunk.toString();
        const lines = buffer.split('\n');
        for (const line of lines) {
          if (line.trim().startsWith('{')) {
            try {
              const parsed = JSON.parse(line.trim());
              resolve(parsed);
              return;
            } catch {
              // wait for more data
            }
          }
        }
      });
      child.on('error', reject);
    });

    // Send tools/list request over stdin
    const request = JSON.stringify({
      jsonrpc: '2.0',
      id: 50,
      method: 'tools/list',
      params: {},
    }) + '\n';

    child.stdin.write(request);

    const response = await responsePromise;
    expect(response.jsonrpc).toBe('2.0');
    expect(response.id).toBe(50);
    expect(response.result?.tools).toBeDefined();
    expect(response.result.tools.map((t: any) => t.name)).toContain('atlas_scrape');

    child.kill();
  });

  it('prints CLI help information when invoked with --help', async () => {
    const child = spawn('node', [cliPath, '--help']);
    let stdout = '';
    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    const exitCode = await new Promise<number>((resolve) => {
      child.on('close', (code) => resolve(code ?? -1));
    });

    expect(exitCode).toBe(0);
    expect(stdout).toContain('Atlas Model Context Protocol (MCP) CLI');
    expect(stdout).toContain('init | login | setup');
    expect(stdout).toContain('--global, -g');
    expect(stdout).toContain('--project, -p');
    expect(stdout).toContain('whoami');
  });

  it('reports active credentials source via whoami subcommand', async () => {
    const child = spawn('node', [cliPath, 'whoami'], {
      env: {
        ...process.env,
        ATLAS_API_KEY: 'atlas_1234567890123456789012345678901234567890123',
      },
    });

    let stdout = '';
    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    const exitCode = await new Promise<number>((resolve) => {
      child.on('close', (code) => resolve(code ?? -1));
    });

    expect(exitCode).toBe(0);
    expect(stdout).toContain('Atlas Credentials:');
    expect(stdout).toContain('process.env.ATLAS_API_KEY');
    expect(stdout).toContain('atlas_12...0123');
  });

  it('installs the Atlas Agent Skill via skill subcommand', async () => {
    const fs = await import('node:fs');
    const os = await import('node:os');
    const path = await import('node:path');
    const tempTestDir = fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-cli-skill-'));

    try {
      const child = spawn('node', [cliPath, 'skill'], {
        cwd: tempTestDir,
      });

      let stdout = '';
      child.stdout.on('data', (chunk) => {
        stdout += chunk.toString();
      });

      const exitCode = await new Promise<number>((resolve) => {
        child.on('close', (code) => resolve(code ?? -1));
      });

      expect(exitCode).toBe(0);
      expect(stdout).toContain('Atlas Agent Skill installed to:');

      const installedSkillPath = path.join(tempTestDir, '.agents', 'skills', 'atlas', 'SKILL.md');
      expect(fs.existsSync(installedSkillPath)).toBe(true);

      const content = fs.readFileSync(installedSkillPath, 'utf8');
      expect(content).toContain('name: atlas');
      expect(content).toContain('atlas_scrape');
    } finally {
      fs.rmSync(tempTestDir, { recursive: true, force: true });
    }
  });
});
