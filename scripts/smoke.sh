#!/bin/bash
set -e

BASE="http://localhost:8000/api/v1"

echo "=== User Login ==="
USER_TOKEN=$(curl -sf "$BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"user_pass_123"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")
echo "Token: ${USER_TOKEN:0:20}..."

echo "=== User Me ==="
curl -sf "$BASE/users/me" -H "Authorization: Bearer $USER_TOKEN" | python3 -m json.tool

echo "=== User Accounts ==="
curl -sf "$BASE/users/me/accounts" -H "Authorization: Bearer $USER_TOKEN" | python3 -m json.tool

echo "=== User Payments ==="
curl -sf "$BASE/users/me/payments" -H "Authorization: Bearer $USER_TOKEN" | python3 -m json.tool

echo "=== Admin Login ==="
ADMIN_TOKEN=$(curl -sf "$BASE/admin/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin_pass_123"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")
echo "Token: ${ADMIN_TOKEN:0:20}..."

echo "=== Admin Me ==="
curl -sf "$BASE/admin/me" -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool

echo "=== Admin List Users ==="
curl -sf "$BASE/admin/users" -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool

echo "=== Webhook (valid) ==="
curl -sf "$BASE/webhooks/payment" \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_id": "5eae174f-7cd0-472c-bd36-35660f00132b",
    "user_id": 1,
    "account_id": 1,
    "amount": 100,
    "signature": "7b47e41efe564a062029da3367bde8844bea0fb049f894687cee5d57f2858bc8"
  }' | python3 -m json.tool

echo "=== Webhook (bad signature) ==="
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/webhooks/payment" \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_id": "bad-sig",
    "user_id": 1,
    "account_id": 1,
    "amount": 100,
    "signature": "0000000000000000000000000000000000000000000000000000000000000000"
  }')
echo "Status: $STATUS (expected 400)"
[ "$STATUS" = "400" ]

echo "=== Webhook (idempotent) ==="
curl -sf "$BASE/webhooks/payment" \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_id": "5eae174f-7cd0-472c-bd36-35660f00132b",
    "user_id": 1,
    "account_id": 1,
    "amount": 100,
    "signature": "7b47e41efe564a062029da3367bde8844bea0fb049f894687cee5d57f2858bc8"
  }' | python3 -m json.tool

echo "=== All smoke tests passed! ==="
