// Webhook signature verification for Atlas webhooks.
// Supports Standard Webhooks RFC specification, dual-secret rotation,
// candidate secret pools, strict timestamp tolerance, and constant-time HMAC-SHA256 comparison.

package atlas

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"time"
)

var (
	hex64Pattern     = regexp.MustCompile(`^[0-9a-fA-F]{64}$`)
	timestampPattern = regexp.MustCompile(`^\d{10,13}$`)
)

type WebhookVerifyOptions struct {
	Payload        []byte
	Headers        http.Header
	Secret         string
	PreviousSecret string
	Secrets        []string
	Tolerance      *time.Duration
	Now            *time.Time
}

type WebhookVerifyResult struct {
	Valid bool           `json:"valid"`
	Error string         `json:"error,omitempty"`
	Event map[string]any `json:"event,omitempty"`
}

func getHeader(headers http.Header, name string) string {
	if headers == nil {
		return ""
	}
	if v := headers.Get(name); v != "" {
		return v
	}
	target := strings.ToLower(name)
	for k, v := range headers {
		if strings.ToLower(k) == target && len(v) > 0 {
			return v[0]
		}
	}
	return ""
}

func decodeWebhookSecret(secret string) ([]byte, error) {
	clean := strings.TrimPrefix(secret, "whsec_")
	clean = strings.TrimPrefix(clean, "ws_")
	clean = strings.ReplaceAll(clean, "-", "+")
	clean = strings.ReplaceAll(clean, "_", "/")
	if rem := len(clean) % 4; rem != 0 {
		clean += strings.Repeat("=", 4-rem)
	}
	return base64.StdEncoding.DecodeString(clean)
}

func computeStandardSignature(keyBytes []byte, webhookID string, timestamp int64, payload []byte) string {
	mac := hmac.New(sha256.New, keyBytes)
	mac.Write([]byte(fmt.Sprintf("%s.%d.", webhookID, timestamp)))
	mac.Write(payload)
	return fmt.Sprintf("v1,%s", base64.StdEncoding.EncodeToString(mac.Sum(nil)))
}

func parseSignatureHeader(sigHeader string) (int64, string, string) {
	if sigHeader == "" {
		return 0, "", ""
	}
	var timestamp int64
	var signature string
	seenT := false
	seenV1 := false
	for _, part := range strings.Split(sigHeader, ",") {
		trimmed := strings.TrimSpace(part)
		if trimmed == "" {
			continue
		}
		eqIdx := strings.Index(trimmed, "=")
		if eqIdx == -1 {
			return 0, "", "invalid_format"
		}
		key := strings.TrimSpace(trimmed[:eqIdx])
		val := strings.TrimSpace(trimmed[eqIdx+1:])
		if key == "t" {
			if seenT || !timestampPattern.MatchString(val) {
				return 0, "", "invalid_format"
			}
			seenT = true
			parsed, err := strconv.ParseInt(val, 10, 64)
			if err != nil || parsed <= 0 {
				return 0, "", "invalid_format"
			}
			timestamp = parsed
		} else if key == "v1" {
			if seenV1 || !hex64Pattern.MatchString(val) {
				return 0, "", "invalid_format"
			}
			seenV1 = true
			signature = strings.ToLower(val)
		}
	}
	return timestamp, signature, ""
}

func parseWebhookHeaders(headers http.Header) (int64, string, string) {
	if headers == nil {
		return 0, "", "missing_headers"
	}
	sigHeader := getHeader(headers, "x-atlas-signature")
	timestamp, signature, errStr := parseSignatureHeader(sigHeader)
	if errStr != "" {
		return 0, "", errStr
	}
	if timestamp > 0 {
		return timestamp, signature, ""
	}
	tsHeader := strings.TrimSpace(getHeader(headers, "x-atlas-webhook-timestamp"))
	if tsHeader != "" {
		if !timestampPattern.MatchString(tsHeader) {
			return 0, signature, "invalid_format"
		}
		parsed, err := strconv.ParseInt(tsHeader, 10, 64)
		if err != nil || parsed <= 0 {
			return 0, signature, "invalid_format"
		}
		return parsed, signature, ""
	}
	return timestamp, signature, ""
}

func parseStandardHeaders(headers http.Header) (string, int64, []string, string) {
	if headers == nil {
		return "", 0, nil, ""
	}
	sigHeader := strings.TrimSpace(getHeader(headers, "webhook-signature"))
	idHeader := strings.TrimSpace(getHeader(headers, "webhook-id"))
	tsHeader := strings.TrimSpace(getHeader(headers, "webhook-timestamp"))

	if sigHeader == "" && idHeader == "" && tsHeader == "" {
		return "", 0, nil, ""
	}
	if sigHeader == "" || idHeader == "" || tsHeader == "" {
		return idHeader, 0, nil, "invalid_format"
	}
	if !timestampPattern.MatchString(tsHeader) {
		return idHeader, 0, nil, "invalid_format"
	}
	parsedTs, err := strconv.ParseInt(tsHeader, 10, 64)
	if err != nil || parsedTs <= 0 {
		return idHeader, 0, nil, "invalid_format"
	}
	var signatures []string
	for _, part := range strings.Fields(sigHeader) {
		if strings.HasPrefix(part, "v1,") {
			signatures = append(signatures, part)
		}
	}
	if len(signatures) == 0 {
		return idHeader, parsedTs, nil, "invalid_format"
	}
	return idHeader, parsedTs, signatures, ""
}

func resolveCandidateSecrets(opts WebhookVerifyOptions) []string {
	var candidates []string
	if opts.Secret != "" {
		candidates = append(candidates, opts.Secret)
	}
	if opts.PreviousSecret != "" {
		candidates = append(candidates, opts.PreviousSecret)
	}
	for _, s := range opts.Secrets {
		if s != "" {
			candidates = append(candidates, s)
		}
	}
	return candidates
}

// VerifyWebhookSignature verifies the signature of an incoming Atlas webhook request.
// Supports both Standard Webhooks RFC specification headers (webhook-id, webhook-timestamp, webhook-signature)
// and legacy Atlas headers (x-atlas-signature, x-atlas-webhook-timestamp).
func VerifyWebhookSignature(opts WebhookVerifyOptions) (*WebhookVerifyResult, error) {
	stdID, stdTs, stdSigs, stdErr := parseStandardHeaders(opts.Headers)
	legacyTs, legacySig, legacyErr := parseWebhookHeaders(opts.Headers)

	if stdErr != "" && legacySig == "" {
		return &WebhookVerifyResult{Valid: false, Error: stdErr}, nil
	}
	if legacyErr != "" && len(stdSigs) == 0 {
		return &WebhookVerifyResult{Valid: false, Error: legacyErr}, nil
	}

	timestamp := stdTs
	if timestamp <= 0 {
		timestamp = legacyTs
	}
	if timestamp <= 0 || (len(stdSigs) == 0 && legacySig == "") {
		return &WebhookVerifyResult{Valid: false, Error: "missing_headers"}, nil
	}

	toleranceSec := int64(300)
	if opts.Tolerance != nil {
		toleranceSec = int64(opts.Tolerance.Seconds())
	}
	if toleranceSec >= 0 {
		now := time.Now().Unix()
		if opts.Now != nil {
			now = opts.Now.Unix()
		}
		diff := now - timestamp
		if diff < 0 {
			diff = -diff
		}
		if diff > toleranceSec {
			return &WebhookVerifyResult{Valid: false, Error: "timestamp_out_of_range"}, nil
		}
	}

	candidates := resolveCandidateSecrets(opts)
	matched := false

	// 1. Attempt Standard Webhooks verification if standard headers are present
	if len(stdSigs) > 0 && stdID != "" && stdTs > 0 {
		for _, cand := range candidates {
			keyBytes, err := decodeWebhookSecret(cand)
			if err != nil || len(keyBytes) == 0 {
				continue
			}
			expected := computeStandardSignature(keyBytes, stdID, stdTs, opts.Payload)
			for _, sig := range stdSigs {
				if hmac.Equal([]byte(sig), []byte(expected)) {
					matched = true
					break
				}
			}
			if matched {
				break
			}
		}
	}

	// 2. Fallback to legacy Atlas verification if standard verification did not match or headers were absent
	if !matched && legacySig != "" && legacyTs > 0 {
		signedContent := []byte(fmt.Sprintf("%d.", legacyTs))
		signedContent = append(signedContent, opts.Payload...)
		for _, cand := range candidates {
			mac := hmac.New(sha256.New, []byte(cand))
			mac.Write(signedContent)
			expected := hex.EncodeToString(mac.Sum(nil))
			if hmac.Equal([]byte(strings.ToLower(legacySig)), []byte(strings.ToLower(expected))) {
				matched = true
				break
			}
		}
	}

	if !matched {
		return &WebhookVerifyResult{Valid: false, Error: "signature_mismatch"}, nil
	}

	var event map[string]any
	if err := json.Unmarshal(opts.Payload, &event); err != nil {
		return &WebhookVerifyResult{Valid: false, Error: "invalid_format"}, nil
	}

	return &WebhookVerifyResult{Valid: true, Event: event}, nil
}

func VerifyWebhook(payload []byte, headers http.Header, secret string) (*WebhookVerifyResult, error) {
	return VerifyWebhookSignature(WebhookVerifyOptions{
		Payload: payload,
		Headers: headers,
		Secret:  secret,
	})
}
