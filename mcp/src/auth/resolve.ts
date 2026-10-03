import { type CredentialStore, FileCredentialStore } from './store';

export interface ResolveApiKeyOptions {
  store?: CredentialStore;
  env?: Record<string, string | undefined>;
}

export interface ResolvedApiKeyResult {
  apiKey: string | null;
  source: 'env' | 'store' | 'none';
  location?: string;
}

/**
 * Universal credential resolution chain for Atlas.
 * Precedence:
 * 1. Explicit environment variable: ATLAS_API_KEY
 * 2. FileCredentialStore (~/.atlas/credentials.json)
 * 3. None (returns null)
 */
export async function resolveAtlasApiKey(
  options: ResolveApiKeyOptions = {},
): Promise<string | null> {
  const result = await resolveAtlasApiKeyWithSource(options);
  return result.apiKey;
}

export async function resolveAtlasApiKeyWithSource(
  options: ResolveApiKeyOptions = {},
): Promise<ResolvedApiKeyResult> {
  const env = options.env ?? process.env;
  const envKey = env.ATLAS_API_KEY?.trim();
  if (envKey) {
    return {
      apiKey: envKey,
      source: 'env',
      location: 'process.env.ATLAS_API_KEY',
    };
  }

  const store = options.store ?? new FileCredentialStore();
  const storedKey = await store.getApiKey();
  if (storedKey) {
    return {
      apiKey: storedKey,
      source: 'store',
      location: store.getPath(),
    };
  }

  return {
    apiKey: null,
    source: 'none',
  };
}
