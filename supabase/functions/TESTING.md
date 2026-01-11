# Manual Testing Checklist for Edge Functions

This document provides manual verification steps for the Edge Functions implementation.

## Prerequisites

1. Docker must be installed and running
2. Supabase CLI must be installed (`npm install -g supabase` or use `npx supabase`)

## Setup Steps

### 1. Start Supabase Local Environment

```bash
cd /path/to/k-drop
npx supabase start
```

Expected output:
- All services should start successfully (postgres, kong, gotrue, realtime, etc.)
- You should see a list of URLs for accessing various services
- Studio URL: http://localhost:54323

Note: First run may take several minutes to download Docker images.

### 2. Serve the Edge Function

In a new terminal:

```bash
cd /path/to/k-drop
npx supabase functions serve api --no-verify-jwt
```

Expected output:
- Function should compile successfully
- Server should start on port 54321
- You should see: "Serving function api"

## Verification Tests

### Test 1: Health Check Endpoint

**Endpoint:** `GET http://localhost:54321/functions/v1/api/health`

**Test command:**
```bash
curl http://localhost:54321/functions/v1/api/health
```

**Expected response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-11T14:18:22.386Z"
}
```

**Acceptance criteria:**
- ✅ HTTP status code is 200
- ✅ Response contains `"status": "ok"`
- ✅ Response contains a valid ISO 8601 timestamp
- ✅ Response is valid JSON

### Test 2: OpenAPI Documentation Endpoint

**Endpoint:** `GET http://localhost:54321/functions/v1/api/doc`

**Test command:**
```bash
curl http://localhost:54321/functions/v1/api/doc | jq
```

**Expected response structure:**
```json
{
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "K-Drop Quiz API",
    "description": "API for K-Drop KPOP quiz application"
  },
  "paths": {
    "/health": {
      "get": {
        "tags": ["Health"],
        "responses": {
          "200": {
            ...
          }
        }
      }
    }
  }
}
```

**Acceptance criteria:**
- ✅ HTTP status code is 200
- ✅ Response contains `"openapi": "3.0.0"`
- ✅ Response contains API info (title, version, description)
- ✅ Response contains `/health` endpoint definition
- ✅ Response is valid OpenAPI 3.0 JSON

### Test 3: CORS Headers

**Test command:**
```bash
curl -I http://localhost:54321/functions/v1/api/health
```

**Acceptance criteria:**
- ✅ Response includes CORS headers
- ✅ `Access-Control-Allow-Origin` header is present

### Test 4: Using the Test Script

Run the automated test script:

```bash
cd supabase/functions
./test-api.sh
```

**Acceptance criteria:**
- ✅ Health check test passes
- ✅ OpenAPI doc test passes
- ✅ No connection errors

## Browser Testing

### Test OpenAPI Documentation in Browser

1. Start Supabase and the function (as above)
2. Open browser to: http://localhost:54321/functions/v1/api/doc
3. You should see the OpenAPI JSON specification
4. Copy the JSON content
5. Paste into [Swagger Editor](https://editor.swagger.io/) or [Redoc](https://redocly.github.io/redoc/)
6. Verify the API documentation renders correctly

## Troubleshooting

### Issue: "supabase start is not running"

**Solution:** Run `npx supabase start` first before serving functions

### Issue: Docker connection errors

**Solution:** 
1. Ensure Docker Desktop is running
2. Check Docker has sufficient resources (4GB+ RAM recommended)
3. Run `docker ps` to verify Docker is accessible

### Issue: Port already in use

**Solution:**
1. Check if another Supabase instance is running: `npx supabase status`
2. Stop existing instance: `npx supabase stop`
3. Start fresh: `npx supabase start`

### Issue: Function compilation errors

**Solution:**
1. Verify Deno imports are correct in `index.ts`
2. Check `deno.json` configuration
3. Review function logs for specific error messages

## Cleanup

After testing, stop the local Supabase:

```bash
npx supabase stop
```

To stop without preserving data:

```bash
npx supabase stop --no-backup
```

## Success Criteria Summary

All acceptance criteria must pass:

- [x] `supabase/functions/api/` directory created
- [x] Hono + @hono/zod-openapi setup complete
- [x] Health check endpoint implemented at `/health`
- [x] OpenAPI documentation endpoint implemented at `/doc`
- [ ] `supabase functions serve` starts successfully
- [ ] `/api/health` returns 200 with correct JSON
- [ ] `/api/doc` returns OpenAPI 3.0 JSON specification
- [ ] CORS headers present in responses
- [ ] No TypeScript/Deno compilation errors

Note: Items without checkmarks require manual verification with a running Supabase instance.
