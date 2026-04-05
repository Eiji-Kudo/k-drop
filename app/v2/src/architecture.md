# K-Drop v2 Frontend Architecture

## Scope

このドキュメントは `app/v2/src` の構造方針を定義する。  
方針の中心は route-centered package-by-feature であり、TanStack Router の file-based routing を前提にする。

## Goal

フロントエンドは `components first` ではなく、`route / feature first` で整理する。

避けたい状態:

- `src/components/profile/*`
- `src/components/ranking/*`
- `src/components/quiz/*`

この配置は feature ごとに見ればまとまっていても、route から見た時に変更の探索範囲が広がりやすい。

## Current State

現状の `src/` は次のような分割になっている。

```text
src/
├── routes/         -> TanStack Router の route tree と feature-local code
│   └── (tabs)/     -> home/profile/ranking/quiz の tab feature
├── components/     -> shared UI
├── lib/            -> query client, rpc client, app providers
└── mocks/          -> app-wide mock data
```

`profile` `ranking` `quiz` の feature-local UI / helper / schema / mock は、すでに route 配下へ colocate 済みである。  
今後の追加実装も同じルールに揃える。

## Core Principles

### 1. Route file は薄く保つ

`src/routes/**/*.tsx` はルーティング関心に集中させる。

- `createFileRoute(...)`
- `loader` / `beforeLoad` / `validateSearch`
- URL params / search params の受け渡し
- route entry component の定義

大量の JSX や画面固有 helper は route 配下の補助ファイルへ逃がす。

### 2. Route-local なものは route 配下へ置く

画面固有の UI、hook、formatter、schema、mock は、その route に最も近い場所へ置く。

### 3. Shared は「複数 feature で再利用されるもの」だけ

以下のいずれかを満たす時だけ `src/components` / `src/lib` へ上げる。

- 複数 route / 複数 feature で使う
- ドメイン非依存で見た目や基盤の責務が明確
- URL や feature 名が付くと不自然

## Target Structure

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

## Placement Rules

新しいファイルは次の順で置き場所を判断する。

1. その route でしか使わないか  
   -> `src/routes/<feature>/...`
2. その feature の複数 route で使うか  
   -> `src/routes/<feature>/-components`, `-hooks`, `-utils`, `-schemas`
3. 複数 feature で使うか  
   -> `src/components`, `src/lib`, `src/constants`

## TanStack Router Conventions

現在の `vite.config.ts` は `tanstackRouter({ target: "react" })` を使っているため、TanStack Router の標準的な file naming conventions をそのまま採用できる。

### Route Groups は directory-only で使う

`(tabs)` や `(public)` のような directory は URL segment ではなく、route の論理グループとして使う。

用途:

- feature 群を URL を汚さず整理する
- tabs 配下や公開画面配下をまとめる

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

注意:

- `(tabs).tsx` のような route group 自体の route file は作らない
- route group に共通ロジックを持たせたい場合は `_` pathless layout を使う

### `-components` などの ignored directory を使う

TanStack Router の route tree に含めたくない補助ファイルは、`-` prefix の付いた名前で route 配下に colocate する。

推奨サブディレクトリ:

- `-components/`: route-local UI
- `-hooks/`: route-local custom hooks
- `-queries/`: route-local TanStack Query helpers
- `-schemas/`: route-local Zod schema
- `-utils/`: formatter, mapper, pure helper
- `-mock/`: feature-local mock data

### `_` pathless layout は共通 wrapper 用

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
├── route.tsx
├── index.tsx
├── create.tsx
├── $sessionId.tsx
└── result.tsx
```

`index.tsx` はその directory の index page、`route.tsx` は feature 配下の layout route として扱う。

## Responsibility by Folder

### `src/routes/`

責務:

- route entry
- params / search params
- loader / guard
- route-level layout

置かないもの:

- 大量の JSX
- route 以外では使わない feature 固有 helper を shared へ逃がすこと

### `src/components/`

責務:

- 複数 feature から使われる shared UI
- app shell のような横断 UI

現時点の代表例:

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

feature ではなく基盤を置く場所とする。

### `src/constants/`

責務:

- 複数 feature で参照する定数

feature 固有の定数や文言は route 配下でもよい。

### `src/mocks/`

責務:

- app-wide mock data

feature に閉じる mock は route 配下の `-mock/` へ置く。

## Concrete Rules

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

## Migration Example

この方針は `profile` `ranking` `quiz` に適用済みであり、新規 feature も同じ考え方で配置する。

### Profile Example

移行前:

```text
src/components/profile/
├── ProfilePage.tsx
├── ProfileStats.tsx
└── format-fan-duration.ts
```

適用後:

```text
src/routes/(tabs)/profile/
├── index.tsx
├── -components/
│   ├── ProfilePage.tsx
│   └── ProfileStats.tsx
└── -utils/
    └── format-fan-duration.ts
```

この配置により、`profile` の変更は `profile` directory を見れば完結する。

## Operational Rules

- route を追加するときは、まず `src/routes/<group>/<feature>/` を切る
- その route だけで使う補助コードは `-components`, `-hooks`, `-utils`, `-schemas` に colocate する
- `src/components` に置く前に「本当に複数 feature で使うか」を確認する
- feature-local mock は route 配下へ置き、app-wide mock だけ `src/mocks` に置く
- generated file の `src/routeTree.gen.ts` は編集しない
