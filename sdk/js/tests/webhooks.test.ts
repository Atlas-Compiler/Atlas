import { describe, expect, it } from 'vitest';
import { verifyWebhookSignature } from '../src/webhooks.js';

async function computeSignature(
  secret: string,
  timestamp: number,
  payload: string,
): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(`${timestamp}.${payload}`));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

describe('SDK Webhook Signature Verification', () => {
  const secret = 'whsec_test_secret_123456789012345678901234567890';
  const previousSecret = 'whsec_prev_secret_123456789012345678901234567890';
  const payload = JSON.stringify({
    schemaVersion: 1,
    id: 'evt_test_01',
    type: 'job.ready',
    data: { jobId: 'job_01', status: 'ready' },
  });

  it('verifies valid webhook signature with current secret', async () => {
    const now = Math.floor(Date.now() / 1000);
    const signature = await computeSignature(secret, now, payload);

    const result = await verifyWebhookSignature({
      payload,
      headers: {
        'x-atlas-signature': `t=${now},v1=${signature}`,
      },
      secret,
    });

    expect(result.valid).toBe(true);
    expect(result.event).toEqual(JSON.parse(payload));
    expect(result.error).toBeUndefined();
  });

  it('verifies valid webhook signature using previousSecret during rotation grace', async () => {
    const now = Math.floor(Date.now() / 1000);
    // Signed with previousSecret
    const signature = await computeSignature(previousSecret, now, payload);

    const result = await verifyWebhookSignature({
      payload,
      headers: {
        'x-atlas-signature': `t=${now},v1=${signature}`,
      },
      secret, // new secret does not match
      previousSecret, // grace secret matches
    });

    expect(result.valid).toBe(true);
    expect(result.event).toEqual(JSON.parse(payload));
  });

  it('verifies using separate x-atlas-webhook-timestamp header', async () => {
    const now = Math.floor(Date.now() / 1000);
    const signature = await computeSignature(secret, now, payload);

    const result = await verifyWebhookSignature({
      payload,
      headers: {
        'x-atlas-webhook-timestamp': String(now),
        'x-atlas-signature': `v1=${signature}`,
      },
      secret,
    });

    expect(result.valid).toBe(true);
  });

  it('supports Headers instance input', async () => {
    const now = Math.floor(Date.now() / 1000);
    const signature = await computeSignature(secret, now, payload);

    const headers = new Headers();
    headers.set('x-atlas-signature', `t=${now},v1=${signature}`);

    const result = await verifyWebhookSignature({
      payload,
      headers,
      secret,
    });

    expect(result.valid).toBe(true);
  });

  it('rejects requests with missing signature headers', async () => {
    const result = await verifyWebhookSignature({
      payload,
      headers: {},
      secret,
    });

    expect(result.valid).toBe(false);
    expect(result.error).toBe('missing_headers');
  });

  it('rejects requests with timestamp outside tolerance window', async () => {
    const expiredTimestamp = Math.floor(Date.now() / 1000) - 600; // 10 minutes ago
    const signature = await computeSignature(secret, expiredTimestamp, payload);

    const result = await verifyWebhookSignature({
      payload,
      headers: {
        'x-atlas-signature': `t=${expiredTimestamp},v1=${signature}`,
      },
      secret,
      toleranceSeconds: 300, // 5 min tolerance
    });

    expect(result.valid).toBe(false);
    expect(result.error).toBe('timestamp_out_of_range');
  });

  it('rejects tampered payload', async () => {
    const now = Math.floor(Date.now() / 1000);
    const signature = await computeSignature(secret, now, payload);

    const result = await verifyWebhookSignature({
      payload: `${payload} `, // tampered with whitespace
      headers: {
        'x-atlas-signature': `t=${now},v1=${signature}`,
      },
      secret,
    });

    expect(result.valid).toBe(false);
    expect(result.error).toBe('signature_mismatch');
  });

  it('rejects invalid secret', async () => {
    const now = Math.floor(Date.now() / 1000);
    const signature = await computeSignature(secret, now, payload);

    const result = await verifyWebhookSignature({
      payload,
      headers: {
        'x-atlas-signature': `t=${now},v1=${signature}`,
      },
      secret: 'whsec_wrong_secret_123456789012345678901234567890',
    });

    expect(result.valid).toBe(false);
    expect(result.error).toBe('signature_mismatch');
  });

  it('returns invalid_format when payload is not valid JSON', async () => {
    const now = Math.floor(Date.now() / 1000);
    const invalidPayload = 'not-a-json';
    const signature = await computeSignature(secret, now, invalidPayload);

    const result = await verifyWebhookSignature({
      payload: invalidPayload,
      headers: {
        'x-atlas-signature': `t=${now},v1=${signature}`,
      },
      secret,
    });

    expect(result.valid).toBe(false);
    expect(result.error).toBe('invalid_format');
  });

  it('verifies signature when secret is provided as an array of strings', async () => {
    const now = Math.floor(Date.now() / 1000);
    const signature = await computeSignature(secret, now, payload);

    const result = await verifyWebhookSignature({
      payload,
      headers: {
        'x-atlas-signature': `t=${now},v1=${signature}`,
      },
      secret: ['whsec_old_candidate', secret, 'whsec_another_candidate'],
    });

    expect(result.valid).toBe(true);
    expect(result.event).toEqual(JSON.parse(payload));
  });

  it('rejects duplicate t or v1 elements in signature header', async () => {
    const now = Math.floor(Date.now() / 1000);
    const signature = await computeSignature(secret, now, payload);

    const resultDupT = await verifyWebhookSignature({
      payload,
      headers: {
        'x-atlas-signature': `t=${now},t=${now + 1},v1=${signature}`,
      },
      secret,
    });
    expect(resultDupT.valid).toBe(false);
    expect(resultDupT.error).toBe('invalid_format');

    const resultDupV1 = await verifyWebhookSignature({
      payload,
      headers: {
        'x-atlas-signature': `t=${now},v1=${signature},v1=${signature}`,
      },
      secret,
    });
    expect(resultDupV1.valid).toBe(false);
    expect(resultDupV1.error).toBe('invalid_format');
  });

  it('rejects malformed timestamp and non-hex signature format', async () => {
    const now = Math.floor(Date.now() / 1000);
    const signature = await computeSignature(secret, now, payload);

    const resultBadTs = await verifyWebhookSignature({
      payload,
      headers: {
        'x-atlas-signature': `t=not_a_number,v1=${signature}`,
      },
      secret,
    });
    expect(resultBadTs.valid).toBe(false);
    expect(resultBadTs.error).toBe('invalid_format');

    const resultBadSig = await verifyWebhookSignature({
      payload,
      headers: {
        'x-atlas-signature': `t=${now},v1=not_hex_signature`,
      },
      secret,
    });
    expect(resultBadSig.valid).toBe(false);
    expect(resultBadSig.error).toBe('invalid_format');
  });

  it('enforces exact tolerance when toleranceSeconds is 0', async () => {
    const now = Math.floor(Date.now() / 1000);
    const signature = await computeSignature(secret, now, payload);

    // Exact match passes
    const resultExact = await verifyWebhookSignature({
      payload,
      headers: {
        'x-atlas-signature': `t=${now},v1=${signature}`,
      },
      secret,
      toleranceSeconds: 0,
    });
    expect(resultExact.valid).toBe(true);

    // 1-second skew fails
    const skewedTs = now - 1;
    const skewedSig = await computeSignature(secret, skewedTs, payload);
    const resultSkewed = await verifyWebhookSignature({
      payload,
      headers: {
        'x-atlas-signature': `t=${skewedTs},v1=${skewedSig}`,
      },
      secret,
      toleranceSeconds: 0,
    });
    expect(resultSkewed.valid).toBe(false);
    expect(resultSkewed.error).toBe('timestamp_out_of_range');
  });

  describe('Standard Webhooks RFC Specification Support', () => {
    function decodeSecret(sec: string): Uint8Array {
      let clean = sec.replace(/^whsec_(?:ws_)?/, '');
      clean = clean.replaceAll('-', '+').replaceAll('_', '/');
      while (clean.length % 4 !== 0) {
        clean += '=';
      }
      const binary = atob(clean);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes;
    }

    async function computeStandardSig(
      sec: string,
      id: string,
      timestamp: number,
      rawPayload: string,
    ): Promise<string> {
      const enc = new TextEncoder();
      const keyBytes = decodeSecret(sec);
      const key = await crypto.subtle.importKey(
        'raw',
        keyBytes.buffer as ArrayBuffer,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign'],
      );
      const signature = await crypto.subtle.sign(
        'HMAC',
        key,
        enc.encode(`${id}.${timestamp}.${rawPayload}`),
      );
      return `v1,${btoa(String.fromCharCode(...new Uint8Array(signature)))}`;
    }

    it('verifies valid Standard Webhooks RFC signature', async () => {
      const now = Math.floor(Date.now() / 1000);
      const sig = await computeStandardSig(secret, 'evt_std_01', now, payload);

      const result = await verifyWebhookSignature({
        payload,
        headers: {
          'webhook-id': 'evt_std_01',
          'webhook-timestamp': String(now),
          'webhook-signature': sig,
        },
        secret,
      });

      expect(result.valid).toBe(true);
      expect(result.event).toEqual(JSON.parse(payload));
    });

    it('verifies Standard Webhooks with multi-signature rotation', async () => {
      const now = Math.floor(Date.now() / 1000);
      const primarySig = await computeStandardSig(secret, 'evt_std_02', now, payload);
      const prevSig = await computeStandardSig(previousSecret, 'evt_std_02', now, payload);

      // Space-separated signatures as specified by Standard Webhooks RFC
      const combinedSigs = `${primarySig} ${prevSig}`;

      const result = await verifyWebhookSignature({
        payload,
        headers: {
          'webhook-id': 'evt_std_02',
          'webhook-timestamp': String(now),
          'webhook-signature': combinedSigs,
        },
        secret,
        previousSecret,
      });

      expect(result.valid).toBe(true);
      expect(result.event).toEqual(JSON.parse(payload));
    });

    it('verifies dual-header request (both standard and legacy headers present)', async () => {
      const now = Math.floor(Date.now() / 1000);
      const stdSig = await computeStandardSig(secret, 'evt_std_03', now, payload);
      const legSig = await computeSignature(secret, now, payload);

      const result = await verifyWebhookSignature({
        payload,
        headers: {
          'webhook-id': 'evt_std_03',
          'webhook-timestamp': String(now),
          'webhook-signature': stdSig,
          'x-atlas-signature': `t=${now},v1=${legSig}`,
          'x-atlas-event-id': 'evt_std_03',
        },
        secret,
      });

      expect(result.valid).toBe(true);
      expect(result.event).toEqual(JSON.parse(payload));
    });

    it('rejects tampered payload in Standard Webhooks', async () => {
      const now = Math.floor(Date.now() / 1000);
      const sig = await computeStandardSig(secret, 'evt_std_04', now, payload);

      const result = await verifyWebhookSignature({
        payload: `${payload} `,
        headers: {
          'webhook-id': 'evt_std_04',
          'webhook-timestamp': String(now),
          'webhook-signature': sig,
        },
        secret,
      });

      expect(result.valid).toBe(false);
      expect(result.error).toBe('signature_mismatch');
    });

    it('rejects expired timestamp in Standard Webhooks', async () => {
      const expired = Math.floor(Date.now() / 1000) - 600;
      const sig = await computeStandardSig(secret, 'evt_std_05', expired, payload);

      const result = await verifyWebhookSignature({
        payload,
        headers: {
          'webhook-id': 'evt_std_05',
          'webhook-timestamp': String(expired),
          'webhook-signature': sig,
        },
        secret,
        toleranceSeconds: 300,
      });

      expect(result.valid).toBe(false);
      expect(result.error).toBe('timestamp_out_of_range');
    });
  });
});
