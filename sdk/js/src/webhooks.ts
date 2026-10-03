/**
 * Webhook signature verification for Atlas webhooks.
 * Supports Standard Webhooks RFC specification, dual-secret rotation,
 * array of secrets, strict timestamp tolerance, and constant-time HMAC comparison.
 */

export interface WebhookVerifyOptions {
  payload: string | Uint8Array;
  headers: Record<string, string | string[] | undefined> | Headers;
  secret: string | string[];
  previousSecret?: string;
  toleranceSeconds?: number;
}

export interface WebhookVerifyResult<T = Record<string, unknown>> {
  valid: boolean;
  error?: 'missing_headers' | 'invalid_format' | 'timestamp_out_of_range' | 'signature_mismatch';
  event?: T;
}

function getHeader(
  headers: Record<string, string | string[] | undefined> | Headers | undefined | null,
  name: string,
): string | null {
  if (!headers) return null;
  if (typeof Headers !== 'undefined' && headers instanceof Headers) {
    return headers.get(name);
  }
  const rec = headers as Record<string, string | string[] | undefined>;
  const key = Object.keys(rec).find((k) => k.toLowerCase() === name.toLowerCase());
  if (!key) return null;
  const val = rec[key];
  if (Array.isArray(val)) return val[0] ?? null;
  return val ?? null;
}

/**
 * Decodes a Standard Webhooks secret (stripping whsec_ or whsec_ws_ prefix,
 * normalizing base64url/base64, and returning the raw signing key bytes).
 */
function decodeWebhookSecret(secret: string): Uint8Array | null {
  try {
    let payload = secret.replace(/^whsec_(?:ws_)?/, '');
    payload = payload.replaceAll('-', '+').replaceAll('_', '/');
    while (payload.length % 4 !== 0) {
      payload += '=';
    }
    const binary = atob(payload);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch {
    return null;
  }
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: header parsing checks strict wire format invariants
function parseSignatureHeader(sigHeader: string | null): {
  timestamp: number | null;
  signature: string | null;
  error?: 'invalid_format';
} {
  if (!sigHeader) return { timestamp: null, signature: null };
  let timestamp: number | null = null;
  let signature: string | null = null;
  let seenT = false;
  let seenV1 = false;
  for (const part of sigHeader.split(',')) {
    const trimmedPart = part.trim();
    if (!trimmedPart) continue;
    const eqIdx = trimmedPart.indexOf('=');
    if (eqIdx === -1) return { timestamp: null, signature: null, error: 'invalid_format' };
    const k = trimmedPart.slice(0, eqIdx).trim();
    const v = trimmedPart.slice(eqIdx + 1).trim();
    if (k === 't') {
      if (seenT) return { timestamp: null, signature: null, error: 'invalid_format' };
      seenT = true;
      if (!/^\d{10,13}$/.test(v))
        return { timestamp: null, signature: null, error: 'invalid_format' };
      const parsed = Number.parseInt(v, 10);
      if (Number.isNaN(parsed) || parsed <= 0)
        return { timestamp: null, signature: null, error: 'invalid_format' };
      timestamp = parsed;
    } else if (k === 'v1') {
      if (seenV1) return { timestamp: null, signature: null, error: 'invalid_format' };
      seenV1 = true;
      if (!/^[0-9a-fA-F]{64}$/.test(v))
        return { timestamp: null, signature: null, error: 'invalid_format' };
      signature = v.toLowerCase();
    }
  }
  return { timestamp, signature };
}

function parseSignatureHeaders(headers: Record<string, string | string[] | undefined> | Headers): {
  timestamp: number | null;
  signature: string | null;
  error?: 'invalid_format';
} {
  const parsed = parseSignatureHeader(getHeader(headers, 'x-atlas-signature'));
  if (parsed.error) return parsed;
  if (parsed.timestamp !== null) return parsed;
  const timestampHeader = getHeader(headers, 'x-atlas-webhook-timestamp');
  if (timestampHeader) {
    const trimmed = timestampHeader.trim();
    if (!/^\d{10,13}$/.test(trimmed))
      return { timestamp: null, signature: parsed.signature, error: 'invalid_format' };
    const ts = Number.parseInt(trimmed, 10);
    if (Number.isNaN(ts) || ts <= 0)
      return { timestamp: null, signature: parsed.signature, error: 'invalid_format' };
    return { timestamp: ts, signature: parsed.signature };
  }
  return parsed;
}

function parseStandardHeaders(headers: Record<string, string | string[] | undefined> | Headers): {
  id: string | null;
  timestamp: number | null;
  signatures: string[];
  error?: 'invalid_format';
} {
  const sigHeader = getHeader(headers, 'webhook-signature');
  const idHeader = getHeader(headers, 'webhook-id');
  const tsHeader = getHeader(headers, 'webhook-timestamp');

  if (!sigHeader && !idHeader && !tsHeader) {
    return { id: null, timestamp: null, signatures: [] };
  }
  if (!sigHeader || !idHeader || !tsHeader) {
    return { id: idHeader, timestamp: null, signatures: [], error: 'invalid_format' };
  }

  const trimmedTs = tsHeader.trim();
  if (!/^\d{10,13}$/.test(trimmedTs)) {
    return { id: idHeader, timestamp: null, signatures: [], error: 'invalid_format' };
  }
  const parsedTs = Number.parseInt(trimmedTs, 10);
  if (Number.isNaN(parsedTs) || parsedTs <= 0) {
    return { id: idHeader, timestamp: null, signatures: [], error: 'invalid_format' };
  }

  const parts = sigHeader.trim().split(/\s+/).filter(Boolean);
  const signatures = parts.filter((part) => part.startsWith('v1,'));
  if (signatures.length === 0) {
    return { id: idHeader, timestamp: parsedTs, signatures: [], error: 'invalid_format' };
  }

  return { id: idHeader.trim(), timestamp: parsedTs, signatures };
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

async function computeHmacSha256Hex(secret: string, data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function computeStandardHmac(keyBytes: Uint8Array, content: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    keyBytes.buffer as ArrayBuffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(content));
  const bytes = new Uint8Array(signature);
  return btoa(String.fromCharCode(...bytes));
}

async function matchSignature(
  signature: string,
  content: string,
  secrets: string[],
): Promise<boolean> {
  for (const secret of secrets) {
    if (!secret) continue;
    const expectedSig = await computeHmacSha256Hex(secret, content);
    if (constantTimeEqual(signature, expectedSig)) return true;
  }
  return false;
}

async function matchStandardSignature(
  signatures: string[],
  content: string,
  secrets: string[],
): Promise<boolean> {
  for (const secret of secrets) {
    if (!secret) continue;
    const keyBytes = decodeWebhookSecret(secret);
    if (!keyBytes) continue;
    const expectedBase64 = await computeStandardHmac(keyBytes, content);
    const expectedSig = `v1,${expectedBase64}`;
    for (const sig of signatures) {
      if (constantTimeEqual(sig, expectedSig)) return true;
    }
  }
  return false;
}

function resolveCandidateSecrets(secret: string | string[], previousSecret?: string): string[] {
  const secrets: string[] = [];
  if (Array.isArray(secret)) {
    secrets.push(...secret);
  } else if (typeof secret === 'string' && secret) {
    secrets.push(secret);
  }
  if (previousSecret) {
    secrets.push(previousSecret);
  }
  return secrets;
}

function isTimestampValid(timestamp: number, toleranceSeconds?: number): boolean {
  const tolerance = toleranceSeconds ?? 300;
  if (tolerance < 0) return true;
  const now = Math.floor(Date.now() / 1000);
  return Math.abs(now - timestamp) <= tolerance;
}

function resolveWebhookHeaders(headers: Record<string, string | string[] | undefined> | Headers): {
  timestamp: number | null;
  standard: ReturnType<typeof parseStandardHeaders>;
  legacy: ReturnType<typeof parseSignatureHeaders>;
  error?: 'missing_headers' | 'invalid_format';
} {
  const standard = parseStandardHeaders(headers);
  const legacy = parseSignatureHeaders(headers);

  if (standard.error && !legacy.signature) {
    return { timestamp: null, standard, legacy, error: standard.error };
  }
  if (legacy.error && standard.signatures.length === 0) {
    return { timestamp: null, standard, legacy, error: legacy.error };
  }

  const timestamp = standard.timestamp ?? legacy.timestamp;
  if (timestamp === null || (standard.signatures.length === 0 && !legacy.signature)) {
    return { timestamp: null, standard, legacy, error: 'missing_headers' };
  }

  return { timestamp, standard, legacy };
}

/**
 * Verifies the signature of an incoming Atlas webhook request.
 * Supports both Standard Webhooks specification headers (webhook-id, webhook-timestamp, webhook-signature)
 * and legacy Atlas headers (x-atlas-signature, x-atlas-webhook-timestamp).
 *
 * @param options Verification options including payload, headers, secret(s), and optional previousSecret
 * @returns WebhookVerifyResult with valid: true and parsed event, or valid: false with error reason
 */
export async function verifyWebhookSignature<T = Record<string, unknown>>(
  options: WebhookVerifyOptions,
): Promise<WebhookVerifyResult<T>> {
  const payloadStr =
    typeof options.payload === 'string'
      ? options.payload
      : new TextDecoder('utf-8').decode(options.payload);

  const { timestamp, standard, legacy, error } = resolveWebhookHeaders(options.headers);
  if (error) {
    return { valid: false, error };
  }
  if (timestamp === null) {
    return { valid: false, error: 'missing_headers' };
  }
  if (!isTimestampValid(timestamp, options.toleranceSeconds)) {
    return { valid: false, error: 'timestamp_out_of_range' };
  }

  const secrets = resolveCandidateSecrets(options.secret, options.previousSecret);
  let valid = false;

  // 1. Attempt Standard Webhooks verification if standard headers are present
  if (standard.signatures.length > 0 && standard.id && standard.timestamp !== null) {
    const signedContent = `${standard.id}.${standard.timestamp}.${payloadStr}`;
    valid = await matchStandardSignature(standard.signatures, signedContent, secrets);
  }

  // 2. Fallback to legacy Atlas verification if standard verification did not match or headers were absent
  if (!valid && legacy.signature && legacy.timestamp !== null) {
    const signedContent = `${legacy.timestamp}.${payloadStr}`;
    valid = await matchSignature(legacy.signature, signedContent, secrets);
  }

  if (!valid) {
    return { valid: false, error: 'signature_mismatch' };
  }

  try {
    const event = JSON.parse(payloadStr) as T;
    return { valid: true, event };
  } catch {
    return { valid: false, error: 'invalid_format' };
  }
}
