"""Webhook signature verification for Atlas webhooks.

Supports Standard Webhooks RFC specification, dual-secret rotation,
candidate secret pools, strict timestamp tolerance, and constant-time HMAC-SHA256 comparison.
"""

from __future__ import annotations
import base64
from dataclasses import dataclass
import hashlib
import hmac
import json
import re
import time
from typing import Any, Mapping

_HEX_64_PATTERN = re.compile(r"^[0-9a-fA-F]{64}$")
_TIMESTAMP_PATTERN = re.compile(r"^\d{10,13}$")


@dataclass
class WebhookVerifyResult:
    valid: bool
    error: str | None = None
    event: dict[str, Any] | None = None


def _get_header(headers: Mapping[str, Any], name: str) -> str | None:
    target = name.lower()
    for key, value in headers.items():
        if key.lower() == target:
            if isinstance(value, (list, tuple)):
                return str(value[0]) if value else None
            return str(value) if value is not None else None
    return None


def _decode_webhook_secret(secret: str) -> bytes | None:
    """Decodes a Standard Webhooks secret (stripping whsec_ or whsec_ws_ prefix,
    normalizing base64url/base64, and returning the raw signing key bytes).
    """
    try:
        clean = re.sub(r"^whsec_(?:ws_)?", "", secret)
        clean = clean.replace("-", "+").replace("_", "/")
        padding = len(clean) % 4
        if padding != 0:
            clean += "=" * (4 - padding)
        return base64.b64decode(clean)
    except Exception:
        return None


def _compute_standard_signature(
    key_bytes: bytes, webhook_id: str, timestamp: int, payload_bytes: bytes
) -> str:
    signed_content = f"{webhook_id}.{timestamp}.".encode("utf-8") + payload_bytes
    digest = hmac.new(key_bytes, signed_content, hashlib.sha256).digest()
    return f"v1,{base64.b64encode(digest).decode('utf-8')}"


def _parse_signature_header(sig_header: str | None) -> tuple[int | None, str | None, str | None]:
    if not sig_header:
        return None, None, None
    timestamp: int | None = None
    signature: str | None = None
    seen_t = False
    seen_v1 = False
    for part in sig_header.split(","):
        trimmed = part.strip()
        if not trimmed:
            continue
        eq_idx = trimmed.find("=")
        if eq_idx == -1:
            return None, None, "invalid_format"
        key = trimmed[:eq_idx].strip()
        val = trimmed[eq_idx + 1 :].strip()
        if key == "t":
            if seen_t or not _TIMESTAMP_PATTERN.match(val):
                return None, None, "invalid_format"
            seen_t = True
            try:
                parsed = int(val)
                if parsed <= 0:
                    return None, None, "invalid_format"
                timestamp = parsed
            except ValueError:
                return None, None, "invalid_format"
        elif key == "v1":
            if seen_v1 or not _HEX_64_PATTERN.match(val):
                return None, None, "invalid_format"
            seen_v1 = True
            signature = val.lower()
    return timestamp, signature, None


def _parse_headers(headers: Mapping[str, Any]) -> tuple[int | None, str | None, str | None]:
    sig_header = _get_header(headers, "x-atlas-signature")
    timestamp, signature, error = _parse_signature_header(sig_header)
    if error:
        return None, None, error
    if timestamp is not None:
        return timestamp, signature, None
    ts_header = _get_header(headers, "x-atlas-webhook-timestamp")
    if ts_header:
        trimmed = ts_header.strip()
        if not _TIMESTAMP_PATTERN.match(trimmed):
            return None, signature, "invalid_format"
        try:
            parsed = int(trimmed)
            if parsed <= 0:
                return None, signature, "invalid_format"
            return parsed, signature, None
        except ValueError:
            return None, signature, "invalid_format"
    return timestamp, signature, None


def _parse_standard_headers(
    headers: Mapping[str, Any],
) -> tuple[str | None, int | None, list[str], str | None]:
    sig_header = _get_header(headers, "webhook-signature")
    id_header = _get_header(headers, "webhook-id")
    ts_header = _get_header(headers, "webhook-timestamp")

    if not sig_header and not id_header and not ts_header:
        return None, None, [], None
    if not sig_header or not id_header or not ts_header:
        return id_header, None, [], "invalid_format"

    trimmed_ts = ts_header.strip()
    if not _TIMESTAMP_PATTERN.match(trimmed_ts):
        return id_header, None, [], "invalid_format"
    try:
        parsed_ts = int(trimmed_ts)
        if parsed_ts <= 0:
            return id_header, None, [], "invalid_format"
    except ValueError:
        return id_header, None, [], "invalid_format"

    signatures = [part for part in sig_header.strip().split() if part.startswith("v1,")]
    if not signatures:
        return id_header, parsed_ts, [], "invalid_format"

    return id_header.strip(), parsed_ts, signatures, None


def _resolve_candidate_secrets(
    secret: str | list[str], previous_secret: str | None = None
) -> list[str]:
    candidates: list[str] = []
    if isinstance(secret, list):
        candidates.extend(s for s in secret if s)
    elif isinstance(secret, str) and secret:
        candidates.append(secret)
    if previous_secret:
        candidates.append(previous_secret)
    return candidates


def _match_standard_signature(
    signatures: list[str],
    webhook_id: str,
    timestamp: int,
    payload_bytes: bytes,
    candidate_secrets: list[str],
) -> bool:
    for cand in candidate_secrets:
        key_bytes = _decode_webhook_secret(cand)
        if not key_bytes:
            continue
        expected = _compute_standard_signature(key_bytes, webhook_id, timestamp, payload_bytes)
        for sig in signatures:
            if hmac.compare_digest(sig, expected):
                return True
    return False


def verify_webhook_signature(
    payload: str | bytes,
    headers: Mapping[str, Any],
    secret: str | list[str],
    previous_secret: str | None = None,
    tolerance_seconds: int = 300,
    now: int | None = None,
) -> WebhookVerifyResult:
    """Verifies the HMAC-SHA256 signature of an incoming Atlas webhook request.
    Supports both Standard Webhooks RFC specification headers (webhook-id, webhook-timestamp, webhook-signature)
    and legacy Atlas headers (x-atlas-signature, x-atlas-webhook-timestamp).

    Args:
        payload: The raw request body as bytes or string.
        headers: Request headers dictionary.
        secret: Primary secret string or list of secret strings.
        previous_secret: Optional previous secret for zero-downtime rotation.
        tolerance_seconds: Maximum allowed clock drift in seconds (default 300).
            Pass a negative value to disable tolerance checking.
        now: Optional current timestamp (seconds since epoch) for testing.

    Returns:
        WebhookVerifyResult with valid=True and parsed event, or valid=False with error.
    """
    if isinstance(payload, str):
        payload_bytes = payload.encode("utf-8")
        payload_str = payload
    else:
        payload_bytes = bytes(payload)
        try:
            payload_str = payload_bytes.decode("utf-8")
        except UnicodeDecodeError:
            return WebhookVerifyResult(valid=False, error="invalid_format")

    std_id, std_ts, std_sigs, std_err = _parse_standard_headers(headers)
    legacy_ts, legacy_sig, legacy_err = _parse_headers(headers)

    if std_err and not legacy_sig:
        return WebhookVerifyResult(valid=False, error=std_err)
    if legacy_err and not std_sigs:
        return WebhookVerifyResult(valid=False, error=legacy_err)

    timestamp = std_ts if std_ts is not None else legacy_ts
    if timestamp is None or (not std_sigs and not legacy_sig):
        return WebhookVerifyResult(valid=False, error="missing_headers")

    current_time = now if now is not None else int(time.time())
    if tolerance_seconds >= 0 and abs(current_time - timestamp) > tolerance_seconds:
        return WebhookVerifyResult(valid=False, error="timestamp_out_of_range")

    candidate_secrets = _resolve_candidate_secrets(secret, previous_secret)
    matched = False

    # 1. Attempt Standard Webhooks verification if standard headers are present
    if std_sigs and std_id and std_ts is not None:
        matched = _match_standard_signature(
            std_sigs, std_id, std_ts, payload_bytes, candidate_secrets
        )

    # 2. Fallback to legacy Atlas verification if standard verification did not match or headers were absent
    if not matched and legacy_sig and legacy_ts is not None:
        signed_content = f"{legacy_ts}.".encode("utf-8") + payload_bytes
        for candidate in candidate_secrets:
            expected = hmac.new(
                candidate.encode("utf-8"), signed_content, hashlib.sha256
            ).hexdigest()
            if hmac.compare_digest(legacy_sig.lower(), expected.lower()):
                matched = True
                break

    if not matched:
        return WebhookVerifyResult(valid=False, error="signature_mismatch")

    try:
        event = json.loads(payload_str)
        if not isinstance(event, dict):
            return WebhookVerifyResult(valid=False, error="invalid_format")
        return WebhookVerifyResult(valid=True, event=event)
    except Exception:
        return WebhookVerifyResult(valid=False, error="invalid_format")
