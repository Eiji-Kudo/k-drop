#!/usr/bin/env bash
# Test script for Supabase Edge Functions
# This script demonstrates how to test the Edge Function endpoints

set -e

echo "==================================="
echo "K-Drop API Edge Function Test"
echo "==================================="
echo ""

# Check if Supabase is running
if ! npx supabase status > /dev/null 2>&1; then
    echo "⚠️  Supabase is not running. Starting it now..."
    echo "This may take a few minutes on first run..."
    npx supabase start
    echo ""
fi

# Get the API URL
API_URL="http://localhost:54321/functions/v1/api"

echo "Testing Edge Function endpoints..."
echo ""

# Test health endpoint
echo "1. Testing /health endpoint..."
HEALTH_RESPONSE=$(curl -s "${API_URL}/health" || echo '{"error": "Failed to connect"}')
echo "   Response: ${HEALTH_RESPONSE}"

if echo "${HEALTH_RESPONSE}" | grep -q '"status":"ok"'; then
    echo "   ✅ Health check passed"
else
    echo "   ❌ Health check failed"
fi
echo ""

# Test OpenAPI doc endpoint
echo "2. Testing /doc endpoint..."
DOC_RESPONSE=$(curl -s "${API_URL}/doc" || echo '{"error": "Failed to connect"}')

if echo "${DOC_RESPONSE}" | grep -q '"openapi"'; then
    echo "   ✅ OpenAPI documentation available"
    echo "   Preview (first 200 chars):"
    echo "   ${DOC_RESPONSE:0:200}..."
else
    echo "   ❌ OpenAPI documentation failed"
    echo "   Response: ${DOC_RESPONSE}"
fi
echo ""

echo "==================================="
echo "Test Summary"
echo "==================================="
echo "API URL: ${API_URL}"
echo "Health endpoint: ${API_URL}/health"
echo "OpenAPI spec: ${API_URL}/doc"
echo ""
echo "To view full OpenAPI spec:"
echo "  curl ${API_URL}/doc | jq"
echo ""
