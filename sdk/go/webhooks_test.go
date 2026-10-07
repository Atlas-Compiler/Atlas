package atlas

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"net/http"
	"testing"
	"time"
)

const (
	testSecret         = "whsec_test_secret_123456789012345678901234567890"
	testPreviousSecret = "whsec_prev_secret_123456789012345678901234567890"
	testPayload        = `{"schemaVersion":1,"id":"evt_test_01","type":"job.ready","data":{"jobId":"job_01","status":"ready"}}`
)

func computeSignature(secret string, timestamp int64, payload []byte) string {
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(fmt.Sprintf("%d.", timestamp)))
	mac.Write(payload)
	return hex.EncodeToString(mac.Sum(nil))
}

func TestVerifyWebhookValidCurrentSecret(t *testing.T) {
	now := time.Now().Unix()
	sig := computeSignature(testSecret, now, []byte(testPayload))

	headers := http.Header{}
	headers.Set("x-atlas-signature", fmt.Sprintf("t=%d,v1=%s", now, sig))

	res, err := VerifyWebhookSignature(WebhookVerifyOptions{
		Payload: []byte(testPayload),
		Headers: headers,
		Secret:  testSecret,
	})
	if err != nil {
		t.Fatal(err)
	}
	if !res.Valid || res.Error != "" || res.Event == nil {
		t.Fatalf("expected valid result, got %+v", res)
	}
	if res.Event["id"] != "evt_test_01" {
		t.Fatalf("unexpected event id: %v", res.Event["id"])
	}
}

func TestVerifyWebhookValidPreviousSecretRotation(t *testing.T) {
	now := time.Now().Unix()
	sig := computeSignature(testPreviousSecret, now, []byte(testPayload))

	headers := http.Header{}
	headers.Set("x-atlas-signature", fmt.Sprintf("t=%d,v1=%s", now, sig))

	res, err := VerifyWebhookSignature(WebhookVerifyOptions{
		Payload:        []byte(testPayload),
		Headers:        headers,
		Secret:         testSecret,
		PreviousSecret: testPreviousSecret,
	})
	if err != nil {
		t.Fatal(err)
	}
	if !res.Valid || res.Error != "" {
		t.Fatalf("expected valid result using previousSecret, got %+v", res)
	}
}

func TestVerifyWebhookSeparateTimestampHeader(t *testing.T) {
	now := time.Now().Unix()
	sig := computeSignature(testSecret, now, []byte(testPayload))

	headers := http.Header{}
	headers.Set("x-atlas-webhook-timestamp", fmt.Sprintf("%d", now))
	headers.Set("x-atlas-signature", fmt.Sprintf("v1=%s", sig))

	res, err := VerifyWebhookSignature(WebhookVerifyOptions{
		Payload: []byte(testPayload),
		Headers: headers,
		Secret:  testSecret,
	})
	if err != nil {
		t.Fatal(err)
	}
	if !res.Valid {
		t.Fatalf("expected valid result with separate timestamp header, got %+v", res)
	}
}

func TestVerifyWebhookCaseInsensitiveHeaders(t *testing.T) {
	now := time.Now().Unix()
	sig := computeSignature(testSecret, now, []byte(testPayload))

	headers := http.Header{}
	headers.Set("X-Atlas-Signature", fmt.Sprintf("t=%d,v1=%s", now, sig))

	res, err := VerifyWebhookSignature(WebhookVerifyOptions{
		Payload: []byte(testPayload),
		Headers: headers,
		Secret:  testSecret,
	})
	if err != nil {
		t.Fatal(err)
	}
	if !res.Valid {
		t.Fatalf("expected valid result with case-insensitive headers, got %+v", res)
	}
}

func TestVerifyWebhookMissingHeaders(t *testing.T) {
	headers := http.Header{}
	res, err := VerifyWebhookSignature(WebhookVerifyOptions{
		Payload: []byte(testPayload),
		Headers: headers,
		Secret:  testSecret,
	})
	if err != nil {
		t.Fatal(err)
	}
	if res.Valid || res.Error != "missing_headers" {
		t.Fatalf("expected missing_headers error, got %+v", res)
	}
}

func TestVerifyWebhookTimestampOutOfRange(t *testing.T) {
	expired := time.Now().Unix() - 600
	sig := computeSignature(testSecret, expired, []byte(testPayload))

	headers := http.Header{}
	headers.Set("x-atlas-signature", fmt.Sprintf("t=%d,v1=%s", expired, sig))

	tol := 300 * time.Second
	res, err := VerifyWebhookSignature(WebhookVerifyOptions{
		Payload:   []byte(testPayload),
		Headers:   headers,
		Secret:    testSecret,
		Tolerance: &tol,
	})
	if err != nil {
		t.Fatal(err)
	}
	if res.Valid || res.Error != "timestamp_out_of_range" {
		t.Fatalf("expected timestamp_out_of_range, got %+v", res)
	}
}

func TestVerifyWebhookTamperedPayload(t *testing.T) {
	now := time.Now().Unix()
	sig := computeSignature(testSecret, now, []byte(testPayload))

	headers := http.Header{}
	headers.Set("x-atlas-signature", fmt.Sprintf("t=%d,v1=%s", now, sig))

	res, err := VerifyWebhookSignature(WebhookVerifyOptions{
		Payload: []byte(testPayload + " "),
		Headers: headers,
		Secret:  testSecret,
	})
	if err != nil {
		t.Fatal(err)
	}
	if res.Valid || res.Error != "signature_mismatch" {
		t.Fatalf("expected signature_mismatch for tampered payload, got %+v", res)
	}
}

func TestVerifyWebhookInvalidSecret(t *testing.T) {
	now := time.Now().Unix()
	sig := computeSignature(testSecret, now, []byte(testPayload))

	headers := http.Header{}
	headers.Set("x-atlas-signature", fmt.Sprintf("t=%d,v1=%s", now, sig))

	res, err := VerifyWebhookSignature(WebhookVerifyOptions{
		Payload: []byte(testPayload),
		Headers: headers,
		Secret:  "whsec_wrong_secret_123456789012345678901234567890",
	})
	if err != nil {
		t.Fatal(err)
	}
	if res.Valid || res.Error != "signature_mismatch" {
		t.Fatalf("expected signature_mismatch for wrong secret, got %+v", res)
	}
}

func TestVerifyWebhookInvalidJsonPayload(t *testing.T) {
	now := time.Now().Unix()
	badPayload := []byte("not-a-json")
	sig := computeSignature(testSecret, now, badPayload)

	headers := http.Header{}
	headers.Set("x-atlas-signature", fmt.Sprintf("t=%d,v1=%s", now, sig))

	res, err := VerifyWebhookSignature(WebhookVerifyOptions{
		Payload: badPayload,
		Headers: headers,
		Secret:  testSecret,
	})
	if err != nil {
		t.Fatal(err)
	}
	if res.Valid || res.Error != "invalid_format" {
		t.Fatalf("expected invalid_format for non-JSON payload, got %+v", res)
	}
}

func TestVerifyWebhookSecretSliceCandidates(t *testing.T) {
	now := time.Now().Unix()
	sig := computeSignature(testSecret, now, []byte(testPayload))

	headers := http.Header{}
	headers.Set("x-atlas-signature", fmt.Sprintf("t=%d,v1=%s", now, sig))

	res, err := VerifyWebhookSignature(WebhookVerifyOptions{
		Payload: []byte(testPayload),
		Headers: headers,
		Secrets: []string{"whsec_old_candidate", testSecret, "whsec_another_candidate"},
	})
	if err != nil {
		t.Fatal(err)
	}
	if !res.Valid {
		t.Fatalf("expected valid result using Secrets slice, got %+v", res)
	}
}

func TestVerifyWebhookDuplicateHeaders(t *testing.T) {
	now := time.Now().Unix()
	sig := computeSignature(testSecret, now, []byte(testPayload))

	headersDupT := http.Header{}
	headersDupT.Set("x-atlas-signature", fmt.Sprintf("t=%d,t=%d,v1=%s", now, now+1, sig))
	res, _ := VerifyWebhookSignature(WebhookVerifyOptions{
		Payload: []byte(testPayload),
		Headers: headersDupT,
		Secret:  testSecret,
	})
	if res.Valid || res.Error != "invalid_format" {
		t.Fatalf("expected invalid_format for duplicate t, got %+v", res)
	}

	headersDupV1 := http.Header{}
	headersDupV1.Set("x-atlas-signature", fmt.Sprintf("t=%d,v1=%s,v1=%s", now, sig, sig))
	res2, _ := VerifyWebhookSignature(WebhookVerifyOptions{
		Payload: []byte(testPayload),
		Headers: headersDupV1,
		Secret:  testSecret,
	})
	if res2.Valid || res2.Error != "invalid_format" {
		t.Fatalf("expected invalid_format for duplicate v1, got %+v", res2)
	}
}

func TestVerifyWebhookMalformedTimestampAndSig(t *testing.T) {
	now := time.Now().Unix()
	sig := computeSignature(testSecret, now, []byte(testPayload))

	headersBadTs := http.Header{}
	headersBadTs.Set("x-atlas-signature", fmt.Sprintf("t=not_a_number,v1=%s", sig))
	res, _ := VerifyWebhookSignature(WebhookVerifyOptions{
		Payload: []byte(testPayload),
		Headers: headersBadTs,
		Secret:  testSecret,
	})
	if res.Valid || res.Error != "invalid_format" {
		t.Fatalf("expected invalid_format for bad timestamp, got %+v", res)
	}

	headersBadSig := http.Header{}
	headersBadSig.Set("x-atlas-signature", fmt.Sprintf("t=%d,v1=not_hex_signature", now))
	res2, _ := VerifyWebhookSignature(WebhookVerifyOptions{
		Payload: []byte(testPayload),
		Headers: headersBadSig,
		Secret:  testSecret,
	})
	if res2.Valid || res2.Error != "invalid_format" {
		t.Fatalf("expected invalid_format for non-hex signature, got %+v", res2)
	}
}

func TestVerifyWebhookExactToleranceZero(t *testing.T) {
	nowTime := time.Unix(1700000000, 0)
	now := nowTime.Unix()
	sig := computeSignature(testSecret, now, []byte(testPayload))

	headers := http.Header{}
	headers.Set("x-atlas-signature", fmt.Sprintf("t=%d,v1=%s", now, sig))

	tol := 0 * time.Second
	res, _ := VerifyWebhookSignature(WebhookVerifyOptions{
		Payload:   []byte(testPayload),
		Headers:   headers,
		Secret:    testSecret,
		Tolerance: &tol,
		Now:       &nowTime,
	})
	if !res.Valid {
		t.Fatalf("expected exact match to pass with 0 tolerance, got %+v", res)
	}

	skewedTs := now - 1
	skewedSig := computeSignature(testSecret, skewedTs, []byte(testPayload))
	headersSkewed := http.Header{}
	headersSkewed.Set("x-atlas-signature", fmt.Sprintf("t=%d,v1=%s", skewedTs, skewedSig))

	resSkewed, _ := VerifyWebhookSignature(WebhookVerifyOptions{
		Payload:   []byte(testPayload),
		Headers:   headersSkewed,
		Secret:    testSecret,
		Tolerance: &tol,
		Now:       &nowTime,
	})
	if resSkewed.Valid || resSkewed.Error != "timestamp_out_of_range" {
		t.Fatalf("expected timestamp_out_of_range for skewed timestamp with 0 tolerance, got %+v", resSkewed)
	}
}

func computeStandardTestSig(sec string, webhookID string, timestamp int64, payload []byte) string {
	rawKey, _ := decodeWebhookSecret(sec)
	return computeStandardSignature(rawKey, webhookID, timestamp, payload)
}

func TestVerifyStandardWebhookRFCValid(t *testing.T) {
	now := time.Now().Unix()
	sig := computeStandardTestSig(testSecret, "evt_std_01", now, []byte(testPayload))

	headers := http.Header{}
	headers.Set("webhook-id", "evt_std_01")
	headers.Set("webhook-timestamp", fmt.Sprintf("%d", now))
	headers.Set("webhook-signature", sig)

	res, err := VerifyWebhookSignature(WebhookVerifyOptions{
		Payload: []byte(testPayload),
		Headers: headers,
		Secret:  testSecret,
	})
	if err != nil {
		t.Fatal(err)
	}
	if !res.Valid || res.Error != "" || res.Event == nil {
		t.Fatalf("expected valid result for standard webhook, got %+v", res)
	}
	if res.Event["id"] != "evt_test_01" {
		t.Fatalf("unexpected event id: %v", res.Event["id"])
	}
}

func TestVerifyStandardWebhookMultiSignatureRotation(t *testing.T) {
	now := time.Now().Unix()
	primarySig := computeStandardTestSig(testSecret, "evt_std_02", now, []byte(testPayload))
	prevSig := computeStandardTestSig(testPreviousSecret, "evt_std_02", now, []byte(testPayload))
	combined := fmt.Sprintf("%s %s", primarySig, prevSig)

	headers := http.Header{}
	headers.Set("webhook-id", "evt_std_02")
	headers.Set("webhook-timestamp", fmt.Sprintf("%d", now))
	headers.Set("webhook-signature", combined)

	res, err := VerifyWebhookSignature(WebhookVerifyOptions{
		Payload:        []byte(testPayload),
		Headers:        headers,
		Secret:         testSecret,
		PreviousSecret: testPreviousSecret,
	})
	if err != nil {
		t.Fatal(err)
	}
	if !res.Valid || res.Error != "" {
		t.Fatalf("expected valid result for multi-sig standard webhook, got %+v", res)
	}
}

func TestVerifyStandardWebhookDualHeaders(t *testing.T) {
	now := time.Now().Unix()
	stdSig := computeStandardTestSig(testSecret, "evt_std_03", now, []byte(testPayload))
	legSig := computeSignature(testSecret, now, []byte(testPayload))

	headers := http.Header{}
	headers.Set("webhook-id", "evt_std_03")
	headers.Set("webhook-timestamp", fmt.Sprintf("%d", now))
	headers.Set("webhook-signature", stdSig)
	headers.Set("x-atlas-signature", fmt.Sprintf("t=%d,v1=%s", now, legSig))
	headers.Set("x-atlas-event-id", "evt_std_03")

	res, err := VerifyWebhookSignature(WebhookVerifyOptions{
		Payload: []byte(testPayload),
		Headers: headers,
		Secret:  testSecret,
	})
	if err != nil {
		t.Fatal(err)
	}
	if !res.Valid || res.Error != "" {
		t.Fatalf("expected valid result for dual-header webhook, got %+v", res)
	}
}

func TestVerifyStandardWebhookTamperedPayload(t *testing.T) {
	now := time.Now().Unix()
	sig := computeStandardTestSig(testSecret, "evt_std_04", now, []byte(testPayload))

	headers := http.Header{}
	headers.Set("webhook-id", "evt_std_04")
	headers.Set("webhook-timestamp", fmt.Sprintf("%d", now))
	headers.Set("webhook-signature", sig)

	tampered := []byte(testPayload + " ")
	res, err := VerifyWebhookSignature(WebhookVerifyOptions{
		Payload: tampered,
		Headers: headers,
		Secret:  testSecret,
	})
	if err != nil {
		t.Fatal(err)
	}
	if res.Valid || res.Error != "signature_mismatch" {
		t.Fatalf("expected signature_mismatch for tampered payload, got %+v", res)
	}
}

func TestVerifyStandardWebhookExpiredTimestamp(t *testing.T) {
	now := time.Now().Unix()
	expired := now - 600
	sig := computeStandardTestSig(testSecret, "evt_std_05", expired, []byte(testPayload))

	headers := http.Header{}
	headers.Set("webhook-id", "evt_std_05")
	headers.Set("webhook-timestamp", fmt.Sprintf("%d", expired))
	headers.Set("webhook-signature", sig)

	tol := 300 * time.Second
	res, err := VerifyWebhookSignature(WebhookVerifyOptions{
		Payload:   []byte(testPayload),
		Headers:   headers,
		Secret:    testSecret,
		Tolerance: &tol,
	})
	if err != nil {
		t.Fatal(err)
	}
	if res.Valid || res.Error != "timestamp_out_of_range" {
		t.Fatalf("expected timestamp_out_of_range for expired timestamp, got %+v", res)
	}
}
