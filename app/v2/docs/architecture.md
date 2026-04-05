# K-Drop v2 アーキテクチャ

## 技術スタック

| レイヤー | 技術 | 備考 |
|---|---|---|
| フロントエンド | React + Vite + TanStack Router | SPA / PWA |
| バックエンド | Hono (Cloudflare Pages Functions) | `functions/` に配置 |
| DB | Cloudflare D1 (SQLite) | Drizzle ORM で操作 |
| 認証 | Better Auth | Google, LINE ソーシャルログイン |
| 型安全 API | Hono RPC | クライアント-サーバー間の型共有 |
| ホスティング | Cloudflare Pages | Git 連携で自動デプロイ |
| フォーマッタ | Biome | lineWidth: 150 |
| リンター | ESLint (flat config) | |
| テスト | Vitest + Testing Library | |

## アーキテクチャ概要

SPA (Vite) + API (Pages Functions) の分離構成。同一オリジンで配信されるため CORS 不要。

```
https://k-drop.pages.dev
├── /              → React SPA（静的ファイル配信）
├── /api/*         → Hono API（Pages Functions = Workers）
```

### データフロー

```
[CSR] ブラウザ → fetch('/api/...') → Hono ルート → D1 → JSON → ブラウザ
[外部] 外部サービス → GET /api/... → Hono ルート → D1 → JSON
```

## 設計方針

- **DDD（ドメイン駆動設計）**を採用。集約境界を意識した設計を行う
- サーバー側は `functions/` 配下にドメインモジュールを配置し、集約単位でコードを組織化
- フロントエンドは TanStack Router + TanStack Query でデータ取得・状態管理
- ID は ULID を使用（テキスト型、ソート可能、衝突しにくい）
- 日時は UTC の ISO8601 文字列で D1 に保存

## API 設計

Hono RPC による型安全な API 呼び出し。

```ts
// functions/api/[[route]].ts — API 定義
const quizzesRoute = new Hono()
  .get('/', async (c) => {
    const quizzes = await listPublishedQuizzes(db)
    return c.json({ data: quizzes })
  })

export type AppType = typeof apiRoutes
```

```ts
// src/lib/api.ts — クライアント
import { hc } from 'hono/client'
import type { AppType } from '../../functions/api/[[route]]'

export const client = hc<AppType>('/api')
```

```ts
// src/routes/quizzes.tsx — TanStack Query で利用
const { data } = useQuery({
  queryKey: ['quizzes'],
  queryFn: async () => {
    const res = await client.quizzes.$get()
    return (await res.json()).data
  },
})
```

## ドキュメント索引

- `docs/architecture.md` — 本ドキュメント
- `docs/project-structure.md` — モジュール配置の判断フロー
- `docs/component-placement-guide.md` — レイヤーごとの責務整理
- `docs/aggregate-boundary-guide.md` — 集約境界の設計指針
- `docs/error-handling.md` — エラーハンドリング方針
- `docs/core-module-organization.md` — コアモジュール配置方針
- `er-diagram.md` — ER 図（ドメインモデルの論理スキーマ）
- `tech-plan.md` — 技術選定プラン・コスト見積もり
