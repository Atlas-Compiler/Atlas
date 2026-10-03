#!/usr/bin/env bash
set -euo pipefail

if [ -z "${ATLAS_API_KEY:-}" ]; then
  echo "Error: ATLAS_API_KEY environment variable is not set." >&2
  echo "Usage: export ATLAS_API_KEY=\"atlas_...\" && ./compile.sh <URL>" >&2
  exit 1
fi

TARGET_URL="${1:-https://example.com}"
BASE_URL="${ATLAS_BASE_URL:-https://api.atlas-compiler.com}"

echo "Compiling $TARGET_URL via Atlas REST API..."

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}\n" \
  -X POST "$BASE_URL/v1/compile" \
  -H "Authorization: Bearer $ATLAS_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"$TARGET_URL\"}")

BODY=$(echo "$RESPONSE" | sed -e '$d')
STATUS=$(echo "$RESPONSE" | tail -n 1 | cut -d':' -f2)

if [ "$STATUS" -eq 200 ]; then
  echo "Success (HTTP 200):"
  echo "$BODY" | jq -r '.data.markdown'
elif [ "$STATUS" -eq 202 ]; then
  JOB_ID=$(echo "$BODY" | jq -r '.id')
  echo "Async Job Queued (HTTP 202): $JOB_ID"
  echo "Poll with: curl -H \"Authorization: Bearer \$ATLAS_API_KEY\" $BASE_URL/v1/jobs/$JOB_ID"
else
  echo "Error (HTTP $STATUS):" >&2
  echo "$BODY" | jq . >&2
  exit 1
fi
