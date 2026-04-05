# K-Drop v2 Architecture

## Scope

このドキュメントは `app/v2` 全体の構造を定義する。特に次の 3 点を明文化する。

- フロントエンドの package by feature 方針
- TanStack Router の file-based routing を前提にした route 配下の責務分離
- Cloudflare Pages Functions / D1 を含む全体の境界

個別のレイヤー詳細は以下を参照する。

- `docs/project-structure.md`
- `docs/component-placement-guide.md`
- `docs/aggregate-boundary-guide.md`
- `docs/core-module-organization.md`

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
| Testing | Vitest + Testing Library | unit / component / schema |

## System Overview

K-Drop v2 は SPA と API を同一リポジトリで管理するが、責務は明確に分ける。

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

## Architecture Principles

### 1. Frontend は package by feature を優先する

画面固有の UI、hook、formatter、schema、mock は、その画面に最も近い route 配下へ寄せる。  
先に `feature` 境界を切り、その中で必要なら `components` や `hooks` に分ける。

避けたい状態:

- `src/components/profile/*`
- `src/components/ranking/*`
- `src/components/quiz/*`

この構成は feature ごとに見ればまとまっているが、routing の文脈から遠く、route-local な依存を共有部品に見せてしまう。

### 2. Route file は薄く保つ

`src/routes/**/*.tsx` はルーティング関心に集中させる。

- `createFileRoute(...)`
- `loader` / `beforeLoad` / `validateSearch`
- URL params / search params の受け渡し
- route entry component の定義

画面本体の JSX や細かい UI ロジックは route 配下の補助ファイルへ逃がす。

### 3. Shared は「複数 feature で再利用されるもの」に限定する

以下のいずれかを満たすものだけを shared とみなす。

- 複数 route / 複数 feature で使う
- ドメイン非依存で見た目や基盤の責務が明確
- URL や feature 名が付くと不自然

### 4. Backend は domain boundary を守る

`functions/` 側は UI の都合で分けず、ドメインとユースケースで分ける。

- `core/`: 横断的な技術基盤
- `db/`: schema / migration / DB テスト
- `api/`: Hono app の入口
- `modules/<feature>/`: 将来的なドメインモジュール本体

## Current Structure

現状の `app/v2` は次の責務分割になっている。

```text
app/v2/
├── src/
│   ├── routes/         -> TanStack Router の route tree
│   ├── components/     -> 画面単位 UI がここに集まっている
│   ├── lib/            -> query client, rpc client, app providers
│   ├── constants/      -> shared constants
│   └── mocks/          -> app-wide mock data
├── functions/
│   ├── api/            -> Hono app entry
│   ├── core/           -> bindings / DB bootstrap
│   └── db/             -> schema / migrations / DB tests
└── docs/               -> design documents
```

この形でも動作はするが、フロントエンドは `route` と `feature UI` が分かれすぎている。今後は route 配下への co-location を標準にする。

## Target Frontend Structure

### Directory Model

```text
src/
├── routes/
│   ├── __root.tsx
│   ├── (tabs)/
│   │   ├── index.tsx
│   │   ├── profile/
│   │   │   ├── index.tsx
│   │   │   ├── -components/
│   │   │   │   ├── ProfilePage.tsx
│   │   │   │   ├── ProfileHeader.tsx
│   │   │   │   └── ProfileStats.tsx
│   │   │   ├── -utils/
│   │   │   │   └── format-fan-duration.ts
│   │   │   ├── -types.ts
│   │   │   └── -mock-data.ts
│   │   ├── ranking/
│   │   │   ├── index.tsx
│   │   │   └── -components/
│   │   └── quiz/
│   │       ├── route.tsx
│   │       ├── index.tsx
│   │       ├── create.tsx
│   │       ├── $sessionId.tsx
│   │       ├── result.tsx
│   │       ├── -components/
│   │       ├── -schemas/
│   │       ├── -queries/
│   │       └── -mock/
├── components/
│   └── bottom-tab-bar.tsx
├── lib/
│   ├── rpc/
│   ├── api/
│   ├── query-client.ts
│   └── app-providers.tsx
├── constants/
└── mocks/
```

### Decision Rule

新しいファイルは次の順で置き場所を判断する。

1. その route でしか使わないか  
   -> `src/routes/<feature>/...`
2. その feature の複数 route で使うか  
   -> `src/routes/<feature>/-components`, `-hooks`, `-utils`, `-schemas`
3. 複数 feature で使うか  
   -> `src/components`, `src/lib`, `src/constants`

## TanStack Router Conventions

現在の `vite.config.ts` は `tanstackRouter({ target: "react" })` を使っているため、TanStack Router の標準的な file naming conventions をそのまま採用できる。`-` prefix の ignored files と route groups を使うために追加設定は不要。

### Route Groups を使う

`(tabs)` や `(public)` のような directory は URL segment ではなく、route の論理グループとして使う。

用途:

- タブ配下の画面を 1 箇所にまとめる
- 認証必須画面と公開画面をディレクトリで分離する
- URL を汚さずに feature 群を整理する

推奨例:

```text
src/routes/
├── __root.tsx
├── (public)/
│   └── index.tsx
└── (tabs)/
    ├── profile/
    │   └── index.tsx
    ├── ranking/
    │   └── index.tsx
    └── quiz/
        ├── index.tsx
        └── create.tsx
```

### `-components` を使う

TanStack Router の route tree に含めたくない補助ファイルは、`-` prefix の付いた名前で route 配下に colocate する。

推奨サブディレクトリ:

- `-components/`: route-local UI
- `-hooks/`: route-local custom hooks
- `-queries/`: route-local TanStack Query helpers
- `-schemas/`: route-local Zod schema
- `-utils/`: formatter, mapper, pure helper
- `-mock/`: feature-local mock data

### `_` pathless layout は「共通ロジックを包む時」だけ使う

directory を整理したいだけなら route groups を使う。  
URL に segment を増やさず、複数 route に共通の layout / guard / provider を掛けたい時だけ `_` prefix の pathless layout を使う。

例:

```text
src/routes/
├── _authenticated.tsx
├── _authenticated.profile.index.tsx
└── _authenticated.ranking.index.tsx
```

### `route.tsx` は feature layout に使う

複数の子 route が同じ wrapper を持つ場合は `route.tsx` を使う。

例:

```text
src/routes/(tabs)/quiz/
├── route.tsx      -> quiz feature 共通 layout / guard
├── index.tsx
├── create.tsx
├── $sessionId.tsx
└── result.tsx
```

`index.tsx` はその directory の index page、`route.tsx` は layout route として扱う。

## Responsibility by Layer

### `src/routes/`

責務:

- route entry
- params / search params
- loader / guard
- route-level layout

置かないもの:

- 大量の JSX
- route 以外でも流用しない feature 固有 helper を `src/components` に逃がすこと

### `src/components/`

責務:

- 複数 feature から使われる shared UI
- app shell のような横断 UI

現時点の該当例:

- `bottom-tab-bar.tsx`

ここに置かないもの:

- `profile` 専用
- `ranking` 専用
- `quiz` 専用

### `src/lib/`

責務:

- app-wide infrastructure
- RPC client
- query client
- provider
- shared API integration

ここは feature ではなく基盤を置く場所とする。

### `src/constants/`

責務:

- 複数 feature で参照する定数

feature 固有の文言や enum 的な値は route 配下でもよい。

### `functions/`

責務:

- API endpoint
- DB access bootstrap
- schema / migration
- 将来的な domain module

目標構成:

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

## Concrete Placement Rules

### Route-local な UI

例:

- `ProfilePage`
- `ProfileStats`
- `RankingTabs`
- `QuizCreateForm`

配置先:

- `src/routes/<feature>/-components/`

### Route-local な純粋関数

例:

- `format-fan-duration.ts`
- mapper
- display formatter
- page 専用の select helper

配置先:

- `src/routes/<feature>/-utils/`
- 必要なら `-formatters/`

`format-fan-duration.ts` は UI ではないため、`-components` ではなく `-utils` に置く。

### Shared UI

例:

- app shell
- modal primitive
- shared form field

配置先:

- `src/components/`

### Shared infrastructure

例:

- `createApiClient`
- `createAppQueryClient`
- provider
- environment helper

配置先:

- `src/lib/`

## Recommended Migration for Current Code

優先順位は次の通り。

1. `src/routes/(tabs)/profile/` 配下へ `profile` 画面の UI と helper を移す
2. `src/routes/(tabs)/ranking/` 配下へ `ranking` 画面の UI を移す
3. `src/routes/(tabs)/quiz/` 配下へ `quiz` 画面の form / mocks / helpers を移す
4. 複数 feature で使うものだけ `src/components` / `src/lib` に残す

### First Concrete Example

現在:

```text
src/components/profile/
├── ProfilePage.tsx
├── ProfileStats.tsx
└── format-fan-duration.ts
```

推奨:

```text
src/routes/(tabs)/profile/
├── index.tsx
├── -components/
│   ├── ProfilePage.tsx
│   └── ProfileStats.tsx
└── -utils/
    └── format-fan-duration.ts
```

この移動により、`profile` の変更は `profile` directory を見れば完結する。

## Operational Rules

- route を追加するときは、まず `src/routes/<group>/<feature>/` を切る
- その route だけで使う補助コードは `-components`, `-hooks`, `-utils`, `-schemas` に colocate する
- `src/components` に置く前に「本当に複数 feature で使うか」を確認する
- feature-local mock は route 配下へ置き、app-wide mock だけ `src/mocks` に置く
- generated file の `src/routeTree.gen.ts` は編集しない

## Summary

K-Drop v2 のフロントエンドは、今後 `components first` ではなく `route-centered package by feature` に寄せる。

- feature の入口は `src/routes/`
- route-local な UI は `-components`
- route-local な helper は `-utils`
- URL に出したくない整理単位は route groups で表現する
- shared は `src/components` / `src/lib` に限定する

この方針を基準として、既存の `profile`, `ranking`, `quiz` から段階的に移行する。
