# K-Drop API Edge Function

This directory contains the Supabase Edge Function for the K-Drop API, built with Hono and Zod OpenAPI.

## Architecture

- **Framework**: [Hono](https://hono.dev/) - Fast, lightweight web framework for Edge
- **API Documentation**: [@hono/zod-openapi](https://github.com/honojs/middleware/tree/main/packages/zod-openapi) - OpenAPI 3.0 spec generation with Zod validation
- **Runtime**: Deno (Supabase Edge Runtime)

## Endpoints

### Health Check
- **GET** `/health`
- Returns the API status and timestamp
- Response:
  ```json
  {
    "status": "ok",
    "timestamp": "2026-01-11T14:00:00.000Z"
  }
  ```

### OpenAPI Documentation
- **GET** `/doc`
- Returns the complete OpenAPI 3.0 specification in JSON format
- Can be used with tools like Swagger UI, Redoc, or Orval for client generation

## Local Development

### Prerequisites
- [Supabase CLI](https://supabase.com/docs/guides/cli) installed
- Docker installed and running

### Start Local Supabase
```bash
npx supabase start
```

### Serve the Edge Function
```bash
npx supabase functions serve api --no-verify-jwt
```

The API will be available at:
- Health: http://localhost:54321/functions/v1/api/health
- OpenAPI spec: http://localhost:54321/functions/v1/api/doc

### Test the Endpoints

Test health check:
```bash
curl http://localhost:54321/functions/v1/api/health
```

Get OpenAPI spec:
```bash
curl http://localhost:54321/functions/v1/api/doc
```

## Deployment

The function is automatically deployed when changes are pushed to the main branch via GitHub Actions (if configured).

Manual deployment:
```bash
npx supabase functions deploy api
```

## Adding New Endpoints

1. Define your Zod schema in the `index.ts` file
2. Create a route using `createRoute()` with request/response schemas
3. Implement the handler using `app.openapi()`
4. The endpoint will automatically be included in the OpenAPI documentation

Example:
```typescript
import { createRoute, z } from "jsr:@hono/zod-openapi@0.17.5";

const exampleRoute = createRoute({
  method: "get",
  path: "/example",
  tags: ["Example"],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "Example response",
    },
  },
});

app.openapi(exampleRoute, (c) => {
  return c.json({ message: "Hello from example endpoint!" });
});
```

## Client Code Generation

Once the OpenAPI spec is available, you can generate type-safe client code using [Orval](https://orval.dev/):

```bash
npm run gen-api
```

This will generate React Query hooks based on the OpenAPI specification.

## References

- [Supabase Edge Functions Documentation](https://supabase.com/docs/guides/functions)
- [Hono Documentation](https://hono.dev/)
- [Zod OpenAPI Documentation](https://github.com/honojs/middleware/tree/main/packages/zod-openapi)
- [Design Document](../../docs/design/plan1-edge-functions-architecture.md)
