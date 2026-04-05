# K-Drop v2 Architecture

## Scope

このドキュメントは `app/v2` 全体の境界と責務分割を定義する。  
フロントエンドの詳細な構造方針は `src/architecture.md` に分離する。

## Technology Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | React 19 + Vite | SPA |
| Routing | TanStack Router | file-based routing |
| Server State | TanStack Query | fetch/cache/retry |
| API | Hono | Cloudflare Pages Functions |
| Database | Cloudflare D1 + Drizzle ORM | SQLite based |
| Validation | Zod | form / request schema |
| Hosting | Cloudflare Pages | same-origin SPA + API |
| Testing | Vitest + Testing Library | frontend / schema / DB test |

## System Overview

K-Drop v2 は SPA と API を同一リポジトリで管理するが、責務は分離する。

```text
Browser
  -> React UI
  -> TanStack Router
  -> Route Feature
  -> TanStack Query / RPC Client
  -> /api/*
  -> Hono
  -> D1 (via Drizzle)
```

同一オリジン配信のため、フロントエンドは `/api/*` をそのまま呼び出せる。

```text
https://k-drop.pages.dev
├── /            -> Vite build artifacts
└── /api/*       -> Cloudflare Pages Functions (Hono)
```

## Boundary Map

```text
app/v2/
├── src/         -> Frontend SPA
├── functions/   -> API / DB / backend runtime
├── docs/        -> design documents
├── er-diagram.md
└── tech-plan.md
```

### `src/`

フロントエンド本体。  
route-centered package-by-feature の詳細は `src/architecture.md` を参照する。

### `functions/`

バックエンド本体。UI 都合ではなく、ドメインと技術基盤で分ける。

現在の責務:

- `api/`: Hono app の入口
- `core/`: bindings / DB bootstrap などの横断基盤
- `db/`: schema / migration / DB テスト

将来的な目標構成:

```text
functions/
├── api/
├── core/
├── db/
└── modules/
    └── <feature>/
        ├── domains/
        ├── repositories/
        ├── queries/
        ├── services/
        ├── handlers/
        └── schemas/
```

## Architecture Principles

### 1. Frontend は feature 単位で組織化する

route-local な UI や helper は、共有ディレクトリではなく feature に閉じる。  
具体的な配置ルールは `src/architecture.md` で定義する。

### 2. Frontend と backend の境界は API で固定する

`src/` は `functions/` の内部実装へ依存せず、RPC client / API contract を通じて通信する。

### 3. Backend は domain boundary を守る

`functions/` 側はユースケースや集約境界をベースに分割し、`core` から feature module へ逆依存しない。

## Document Map

- `docs/architecture.md` -> 全体像と境界
- `src/architecture.md` -> フロントエンド構造と route 配下のルール
- `docs/project-structure.md` -> モジュール配置の判断フロー
- `docs/component-placement-guide.md` -> サーバー側レイヤー配置
- `docs/aggregate-boundary-guide.md` -> 集約境界の設計指針
- `docs/core-module-organization.md` -> core 判定ルール
