# Supabase Edge Functions + Drizzle ORM セットアップガイド

このドキュメントは、Supabase Edge FunctionsでHono + Drizzle + @hono/zod-openapiを動かす際に詰まったポイントと解決方法をまとめたものです。

## 最終的な構成

```
supabase/functions/
├── api/
│   └── index.ts          # Edge Function本体
├── _shared/
│   ├── db.ts             # Drizzle DB接続
│   └── schema.ts         # Drizzleスキーマ
├── import_map.json       # 依存関係マッピング
└── .env.local            # 環境変数
```

## 詰まったポイントと解決方法

### 1. Prisma vs Drizzle の選択

**問題**: 当初Prismaを検討したが、Supabase Edge Functions (Deno) での動作が不安定。

**調査結果**:

- Prisma は Cloudflare Workers と Vercel Edge Functions のみ公式サポート
- Supabase Edge Functions (Deno) は公式サポート外
- Prisma は Rust Query Engine (~2MB) が必要でバンドルサイズが大きい

**解決**: Drizzle ORM を採用

- 公式に Supabase Edge Functions をサポート
- 軽量 (~7.4KB)
- 0 dependencies

### 2. npm パッケージの import 方法

**問題**: `npm:@hono/zod-openapi` を直接書いても動かない。404 Not Found が返る。

**原因**: Supabase Edge Functions では `import_map.json` を使って依存関係を解決する必要がある。

**解決**: `import_map.json` を作成し、`--import-map` オプションで指定

```json
{
  "imports": {
    "drizzle-orm": "npm:drizzle-orm@0.38.3",
    "drizzle-orm/": "npm:/drizzle-orm@0.38.3/",
    "postgres": "npm:postgres@3.4.5",
    "@hono/zod-openapi": "npm:@hono/zod-openapi@0.18.4"
  }
}
```

**注意**: パスを含むimport（`drizzle-orm/postgres-js`）には末尾スラッシュ付きのエントリが必要:

```json
"drizzle-orm/": "npm:/drizzle-orm@0.38.3/"
```

### 3. Hono の import 元

**問題**: `npm:hono` を使うと初回ロードが非常に遅い（または動かない）。

**解決**: Hono は **JSR** から import する

```typescript
// ❌ 遅い/動かない
import { Hono } from 'npm:hono@4.7.8'

// ✅ 正解
import { Hono } from 'jsr:@hono/hono'
import { cors } from 'jsr:@hono/hono/cors'
```

JSRはSupabase Edge Functionsと相性が良く、ダウンロードが速い。

### 4. basePath の設定

**問題**: Honoでルーティングしても 404 Not Found が返る。

**原因**: Supabase Edge Functions では、パスに関数名がプレフィックスとして付く。

- リクエスト: `/functions/v1/api/health`
- Honoが受け取るパス: `/api/health`

**解決**: `basePath()` で関数名をプレフィックスとして設定

```typescript
// ❌ 動かない
const app = new Hono()
app.get('/health', ...)

// ✅ 正解
const app = new Hono().basePath('/api')
app.get('/health', ...)  // /api/health にマッチ
```

### 5. DB接続 URL (ローカル開発)

**問題**: `postgresql://postgres:postgres@127.0.0.1:54322/postgres` で接続エラー。

```
Error: connect ECONNREFUSED 127.0.0.1:54322
```

**原因**: Edge Functions は Docker コンテナ内で動作するため、`127.0.0.1` はコンテナ自身を指す。

**解決**: `host.docker.internal` を使う

```bash
# supabase/.env.local
DATABASE_URL=postgresql://postgres:postgres@host.docker.internal:54322/postgres
```

### 6. @hono/zod-openapi が JSR にない

**問題**: `jsr:@hono/zod-openapi` は存在しない。

**解決**: `@hono/zod-openapi` は npm から import し、`import_map.json` で設定

```json
{
  "imports": {
    "@hono/zod-openapi": "npm:@hono/zod-openapi@0.18.4"
  }
}
```

```typescript
// Hono本体はJSR、zod-openapiはnpm（import_map経由）
import { Hono } from 'jsr:@hono/hono'
import { cors } from 'jsr:@hono/hono/cors'
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
```

## 最終的なコード

### supabase/functions/api/index.ts

```typescript
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { cors } from 'jsr:@hono/hono/cors'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { idolGroups } from '../_shared/schema.ts'

const connectionString = Deno.env.get('DATABASE_URL')!
const client = postgres(connectionString, { prepare: false })
const db = drizzle(client)

const app = new OpenAPIHono().basePath('/api')

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

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'K-Drop Quiz API',
    description: 'API for K-Drop KPOP quiz application',
  },
})

Deno.serve(app.fetch)
```

### supabase/functions/import_map.json

```json
{
  "imports": {
    "drizzle-orm": "npm:drizzle-orm@0.38.3",
    "drizzle-orm/": "npm:/drizzle-orm@0.38.3/",
    "postgres": "npm:postgres@3.4.5",
    "@hono/zod-openapi": "npm:@hono/zod-openapi@0.18.4"
  }
}
```

### supabase/.env.local

```bash
DATABASE_URL=postgresql://postgres:postgres@host.docker.internal:54322/postgres
```

## 起動コマンド

```bash
npx supabase functions serve api \
  --env-file supabase/.env.local \
  --import-map supabase/functions/import_map.json
```

## テストコマンド

```bash
# Health check
curl -s http://localhost:54321/functions/v1/api/health \
  -H "Authorization: Bearer <ANON_KEY>"

# OpenAPI Doc
curl -s http://localhost:54321/functions/v1/api/doc \
  -H "Authorization: Bearer <ANON_KEY>"
```

## 参考リンク

- [Hono - Supabase Edge Functions](https://hono.dev/docs/getting-started/supabase-functions)
- [Supabase - Edge Functions Routing](https://supabase.com/docs/guides/functions/routing)
- [Supabase - Drizzle Integration](https://supabase.com/docs/guides/database/drizzle)
- [Drizzle - Supabase Edge Functions Tutorial](https://orm.drizzle.team/docs/tutorials/drizzle-with-supabase-edge-functions)
