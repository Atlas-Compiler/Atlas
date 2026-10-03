import hmac
import hashlib
import json
import time
from atlascompiler.webhooks import verify_webhook_signature


def compute_signature(secret: str, timestamp: int, payload: str | bytes) -> str:
    payload_bytes = payload.encode("utf-8") if isinstance(payload, str) else payload
    signed_payload = f"{timestamp}.".encode("utf-8") + payload_bytes
    return hmac.new(secret.encode("utf-8"), signed_payload, hashlib.sha256).hexdigest()


SECRET = "whsec_test_secret_123456789012345678901234567890"
PREVIOUS_SECRET = "whsec_prev_secret_123456789012345678901234567890"
PAYLOAD = json.dumps({
    "schemaVersion": 1,
    "id": "evt_test_01",
    "type": "job.ready",
    "data": {"jobId": "job_01", "status": "ready"},
})


def test_verifies_valid_webhook_signature_with_current_secret():
    now = int(time.time())
    sig = compute_signature(SECRET, now, PAYLOAD)
    result = verify_webhook_signature(
        PAYLOAD,
        {"x-atlas-signature": f"t={now},v1={sig}"},
        secret=SECRET,
    )
    assert result.valid is True
    assert result.event == json.loads(PAYLOAD)
    assert result.error is None


def test_verifies_valid_webhook_signature_using_previous_secret_during_rotation():
    now = int(time.time())
    sig = compute_signature(PREVIOUS_SECRET, now, PAYLOAD)
    result = verify_webhook_signature(
        PAYLOAD,
        {"x-atlas-signature": f"t={now},v1={sig}"},
        secret=SECRET,
        previous_secret=PREVIOUS_SECRET,
    )
    assert result.valid is True
    assert result.event == json.loads(PAYLOAD)


def test_verifies_using_separate_timestamp_header():
    now = int(time.time())
    sig = compute_signature(SECRET, now, PAYLOAD)
    result = verify_webhook_signature(
        PAYLOAD,
        {
            "x-atlas-webhook-timestamp": str(now),
            "x-atlas-signature": f"v1={sig}",
        },
        secret=SECRET,
    )
    assert result.valid is True


def test_supports_case_insensitive_headers():
    now = int(time.time())
    sig = compute_signature(SECRET, now, PAYLOAD)
    result = verify_webhook_signature(
        PAYLOAD,
        {"X-Atlas-Signature": f"t={now},v1={sig}"},
        secret=SECRET,
    )
    assert result.valid is True


def test_rejects_requests_with_missing_signature_headers():
    result = verify_webhook_signature(
        PAYLOAD,
        {},
        secret=SECRET,
    )
    assert result.valid is False
    assert result.error == "missing_headers"


def test_rejects_requests_with_timestamp_outside_tolerance_window():
    expired = int(time.time()) - 600
    sig = compute_signature(SECRET, expired, PAYLOAD)
    result = verify_webhook_signature(
        PAYLOAD,
        {"x-atlas-signature": f"t={expired},v1={sig}"},
        secret=SECRET,
        tolerance_seconds=300,
    )
    assert result.valid is False
    assert result.error == "timestamp_out_of_range"


def test_rejects_tampered_payload():
    now = int(time.time())
    sig = compute_signature(SECRET, now, PAYLOAD)
    result = verify_webhook_signature(
        PAYLOAD + " ",
        {"x-atlas-signature": f"t={now},v1={sig}"},
        secret=SECRET,
    )
    assert result.valid is False
    assert result.error == "signature_mismatch"


def test_rejects_invalid_secret():
    now = int(time.time())
    sig = compute_signature(SECRET, now, PAYLOAD)
    result = verify_webhook_signature(
        PAYLOAD,
        {"x-atlas-signature": f"t={now},v1={sig}"},
        secret="whsec_wrong_secret_123456789012345678901234567890",
    )
    assert result.valid is False
    assert result.error == "signature_mismatch"


def test_returns_invalid_format_when_payload_is_not_valid_json():
    now = int(time.time())
    invalid_payload = "not-a-json"
    sig = compute_signature(SECRET, now, invalid_payload)
    result = verify_webhook_signature(
        invalid_payload,
        {"x-atlas-signature": f"t={now},v1={sig}"},
        secret=SECRET,
    )
    assert result.valid is False
    assert result.error == "invalid_format"


def test_verifies_signature_when_secret_is_provided_as_a_collection():
    now = int(time.time())
    sig = compute_signature(SECRET, now, PAYLOAD)
    result = verify_webhook_signature(
        PAYLOAD,
        {"x-atlas-signature": f"t={now},v1={sig}"},
        secret=["whsec_old_candidate", SECRET, "whsec_another_candidate"],
    )
    assert result.valid is True
    assert result.event == json.loads(PAYLOAD)


def test_rejects_duplicate_t_or_v1_elements_in_signature_header():
    now = int(time.time())
    sig = compute_signature(SECRET, now, PAYLOAD)

    dup_t = verify_webhook_signature(
        PAYLOAD,
        {"x-atlas-signature": f"t={now},t={now + 1},v1={sig}"},
        secret=SECRET,
    )
    assert dup_t.valid is False
    assert dup_t.error == "invalid_format"

    dup_v1 = verify_webhook_signature(
        PAYLOAD,
        {"x-atlas-signature": f"t={now},v1={sig},v1={sig}"},
        secret=SECRET,
    )
    assert dup_v1.valid is False
    assert dup_v1.error == "invalid_format"


def test_rejects_malformed_timestamp_and_non_hex_signature():
    now = int(time.time())
    sig = compute_signature(SECRET, now, PAYLOAD)

    bad_ts = verify_webhook_signature(
        PAYLOAD,
        {"x-atlas-signature": f"t=not_a_number,v1={sig}"},
        secret=SECRET,
    )
    assert bad_ts.valid is False
    assert bad_ts.error == "invalid_format"

    bad_sig = verify_webhook_signature(
        PAYLOAD,
        {"x-atlas-signature": f"t={now},v1=not_hex_signature"},
        secret=SECRET,
    )
    assert bad_sig.valid is False
    assert bad_sig.error == "invalid_format"


def test_enforces_exact_tolerance_when_tolerance_seconds_is_0():
    now = int(time.time())
    sig = compute_signature(SECRET, now, PAYLOAD)

    exact = verify_webhook_signature(
        PAYLOAD,
        {"x-atlas-signature": f"t={now},v1={sig}"},
        secret=SECRET,
        tolerance_seconds=0,
        now=now,
    )
    assert exact.valid is True

    skewed_ts = now - 1
    skewed_sig = compute_signature(SECRET, skewed_ts, PAYLOAD)
    skewed = verify_webhook_signature(
        PAYLOAD,
        {"x-atlas-signature": f"t={skewed_ts},v1={skewed_sig}"},
        secret=SECRET,
        tolerance_seconds=0,
        now=now,
    )
    assert skewed.valid is False
    assert skewed.error == "timestamp_out_of_range"


def _compute_standard_test_sig(
    sec: str, webhook_id: str, timestamp: int, payload: str
) -> str:
    import base64
    import re
    clean = re.sub(r"^whsec_(?:ws_)?", "", sec)
    clean = clean.replace("-", "+").replace("_", "/")
    padding = len(clean) % 4
    if padding != 0:
        clean += "=" * (4 - padding)
    raw_key = base64.b64decode(clean)
    signed_content = f"{webhook_id}.{timestamp}.{payload}".encode("utf-8")
    digest = hmac.new(raw_key, signed_content, hashlib.sha256).digest()
    return f"v1,{base64.b64encode(digest).decode('utf-8')}"


def test_verifies_valid_standard_webhooks_rfc_signature():
    now = int(time.time())
    sig = _compute_standard_test_sig(SECRET, "evt_std_01", now, PAYLOAD)
    result = verify_webhook_signature(
        PAYLOAD,
        {
            "webhook-id": "evt_std_01",
            "webhook-timestamp": str(now),
            "webhook-signature": sig,
        },
        secret=SECRET,
    )
    assert result.valid is True
    assert result.event == json.loads(PAYLOAD)
    assert result.error is None


def test_verifies_standard_webhooks_multi_signature_rotation():
    now = int(time.time())
    primary_sig = _compute_standard_test_sig(SECRET, "evt_std_02", now, PAYLOAD)
    prev_sig = _compute_standard_test_sig(PREVIOUS_SECRET, "evt_std_02", now, PAYLOAD)
    combined = f"{primary_sig} {prev_sig}"

    result = verify_webhook_signature(
        PAYLOAD,
        {
            "webhook-id": "evt_std_02",
            "webhook-timestamp": str(now),
            "webhook-signature": combined,
        },
        secret=SECRET,
        previous_secret=PREVIOUS_SECRET,
    )
    assert result.valid is True
    assert result.event == json.loads(PAYLOAD)


def test_verifies_dual_header_request():
    now = int(time.time())
    std_sig = _compute_standard_test_sig(SECRET, "evt_std_03", now, PAYLOAD)
    leg_sig = compute_signature(SECRET, now, PAYLOAD)

    result = verify_webhook_signature(
        PAYLOAD,
        {
            "webhook-id": "evt_std_03",
            "webhook-timestamp": str(now),
            "webhook-signature": std_sig,
            "x-atlas-signature": f"t={now},v1={leg_sig}",
            "x-atlas-event-id": "evt_std_03",
        },
        secret=SECRET,
    )
    assert result.valid is True
    assert result.event == json.loads(PAYLOAD)


def test_rejects_tampered_payload_in_standard_webhooks():
    now = int(time.time())
    sig = _compute_standard_test_sig(SECRET, "evt_std_04", now, PAYLOAD)

    result = verify_webhook_signature(
        f"{PAYLOAD} ",
        {
            "webhook-id": "evt_std_04",
            "webhook-timestamp": str(now),
            "webhook-signature": sig,
        },
        secret=SECRET,
    )
    assert result.valid is False
    assert result.error == "signature_mismatch"


def test_rejects_expired_timestamp_in_standard_webhooks():
    now = int(time.time())
    expired = now - 600
    sig = _compute_standard_test_sig(SECRET, "evt_std_05", expired, PAYLOAD)

    result = verify_webhook_signature(
        PAYLOAD,
        {
            "webhook-id": "evt_std_05",
            "webhook-timestamp": str(expired),
            "webhook-signature": sig,
        },
        secret=SECRET,
        tolerance_seconds=300,
        now=now,
    )
    assert result.valid is False
    assert result.error == "timestamp_out_of_range"

