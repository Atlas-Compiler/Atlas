import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

export interface AtlasCredentials {
  apiKey: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CredentialStore {
  getApiKey(): Promise<string | null>;
  saveApiKey(apiKey: string): Promise<void>;
  deleteApiKey(): Promise<void>;
  getPath(): string;
}

export class FileCredentialStore implements CredentialStore {
  private readonly filePath: string;

  constructor(customPath?: string) {
    if (customPath) {
      this.filePath = customPath;
    } else {
      const home = os.homedir();
      this.filePath = path.join(home, '.atlas', 'credentials.json');
    }
  }

  getPath(): string {
    return this.filePath;
  }

  async getApiKey(): Promise<string | null> {
    try {
      if (!fs.existsSync(this.filePath)) {
        return null;
      }
      const raw = fs.readFileSync(this.filePath, 'utf8');
      if (!raw || !raw.trim()) {
        return null;
      }
      const parsed = JSON.parse(raw);
      if (typeof parsed?.apiKey === 'string' && parsed.apiKey.trim().length > 0) {
        return parsed.apiKey.trim();
      }
      return null;
    } catch {
      // Graceful fallback on malformed JSON or unreadable file
      return null;
    }
  }

  async saveApiKey(apiKey: string): Promise<void> {
    const trimmed = apiKey.trim();
    if (!trimmed) {
      throw new Error('Cannot save an empty API key.');
    }

    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
    }

    // Enforce 0700 on directory for POSIX
    if (process.platform !== 'win32') {
      try {
        fs.chmodSync(dir, 0o700);
      } catch {
        // Non-fatal if filesystem does not support POSIX permissions
      }
    }

    let createdAt = new Date().toISOString();
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf8');
        const parsed = JSON.parse(raw);
        if (parsed?.createdAt) {
          createdAt = parsed.createdAt;
        }
      }
    } catch {
      // Retain new timestamp if existing file is invalid
    }

    const payload: AtlasCredentials = {
      apiKey: trimmed,
      createdAt,
      updatedAt: new Date().toISOString(),
    };

    // Atomic write pattern via temp file and atomic rename
    const tempFile = `${this.filePath}.${process.pid}.${Date.now()}.tmp`;
    fs.writeFileSync(tempFile, `${JSON.stringify(payload, null, 2)}\n`, {
      encoding: 'utf8',
      mode: 0o600,
    });

    if (process.platform !== 'win32') {
      try {
        fs.chmodSync(tempFile, 0o600);
      } catch {
        // Non-fatal
      }
    }

    fs.renameSync(tempFile, this.filePath);
  }

  async deleteApiKey(): Promise<void> {
    try {
      if (fs.existsSync(this.filePath)) {
        fs.unlinkSync(this.filePath);
      }
    } catch (err: unknown) {
      if ((err as NodeJS.ErrnoException)?.code !== 'ENOENT') {
        throw err;
      }
    }
  }
}
