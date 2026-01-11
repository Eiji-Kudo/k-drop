import { cors } from 'npm:hono@4.7.8/cors'
import { createRoute, OpenAPIHono, z } from 'npm:@hono/zod-openapi@0.18.4'
import { db } from '../_shared/db.ts'
import { idolGroups } from '../_shared/schema.ts'

const app = new OpenAPIHono()

app.use('/*', cors())

const healthRoute = createRoute({
  method: 'get',
  path: '/health',
  tags: ['Health'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            status: z.string().openapi({ example: 'ok' }),
            timestamp: z
              .string()
              .openapi({ example: '2026-01-11T14:00:00.000Z' }),
          }),
        },
      },
      description: 'Health check response',
    },
  },
})

app.openapi(healthRoute, (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
})

const idolGroupsRoute = createRoute({
  method: 'get',
  path: '/idol-groups',
  tags: ['Idol Groups'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(
            z.object({
              idolGroupId: z.number(),
              groupCategoryId: z.number(),
              idolGroupName: z.string(),
              thumbnailImage: z.string().nullable(),
            }),
          ),
        },
      },
      description: 'List of idol groups',
    },
  },
})

app.openapi(idolGroupsRoute, async (c) => {
  const groups = await db.select().from(idolGroups)
  return c.json(groups)
})

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'K-Drop Quiz API',
    description: 'API for K-Drop KPOP quiz application',
  },
})

Deno.serve(app.fetch)
