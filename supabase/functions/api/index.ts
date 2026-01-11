import { OpenAPIHono } from "jsr:@hono/zod-openapi@0.17.5";
import { cors } from "jsr:@hono/hono@4.7.8/cors";
import { createRoute, z } from "jsr:@hono/zod-openapi@0.17.5";

const app = new OpenAPIHono();

app.use("/*", cors());

const healthRoute = createRoute({
  method: "get",
  path: "/health",
  tags: ["Health"],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            status: z.string().openapi({ example: "ok" }),
            timestamp: z.string().openapi({ example: "2026-01-11T14:00:00.000Z" }),
          }),
        },
      },
      description: "Health check response",
    },
  },
});

app.openapi(healthRoute, (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "K-Drop Quiz API",
    description: "API for K-Drop KPOP quiz application",
  },
});

Deno.serve(app.fetch);
