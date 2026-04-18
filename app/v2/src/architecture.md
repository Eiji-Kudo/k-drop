# K-Drop v2 Frontend Architecture

## Scope

このドキュメントは `app/v2/src` の構造方針を定義する。  
方針の中心は route-centered package-by-feature であり、TanStack Router の file-based routing を前提にする。

## Goal

フロントエンドは `components first` ではなく、`route / feature first` で整理する。

避けたい状態: feature 固有の UI / schema / mock / formatter を `src/components/<feature>/` に集約すること。

例: `src/components/profile/*` / `src/components/ranking/*` / `src/components/quiz/*` / `src/components/home/*`。

この配置は feature ごとに見ればまとまっていても、URL 起点で変更を追いづらい。

## Current State

現状の `src/` は次の責務分割を採用する。

```text
src/
├── routes/       -> TanStack Router の route tree と URL 定義
│   └── (tabs)/   -> home / profile / ranking / quiz の route group
├── features/     -> feature 実装本体
├── components/   -> shared UI
├── lib/          -> query client, rpc client, app providers
└── mocks/        -> app-wide mock data
```

`profile` `ranking` `quiz` の UI / schema / mock / formatter は `src/features` 配下へ移し、  
`src/routes` は page import と router 設定に集中させる。

## Core Principles

### 1. Route file は薄く保つ

`src/routes/**/*.tsx` はルーティング関心に集中させる。

- `createFileRoute(...)`
- `loader` / `beforeLoad` / `validateSearch`
- URL params / search params の受け渡し
- feature page の接続

大量の JSX や feature 固有 helper は `src/features` に置く。

### 2. Feature 実装は `src/features/<feature>` に集約する

その feature の複数 route で使う page / component / schema / mock / utility は、  
`src/features/<feature>` から辿れるようにまとめる。

### 3. Shared は「複数 feature で再利用されるもの」だけ

以下のいずれかを満たす時だけ `src/components` / `src/lib` へ上げる。

- 複数 route / 複数 feature で使う
- ドメイン非依存で見た目や基盤の責務が明確
- feature 名が付くと不自然

### 4. Route group は URL を汚さず構造化するために使う

`(tabs)` や `(public)` のような directory は URL segment ではなく、route の論理グループとして使う。  
構造整理が目的であり、実装本体の置き場ではない。

## Target Structure

```text
src/
├── routes/
│   ├── __root.tsx
│   └── (tabs)/
│       ├── index.tsx
│       ├── profile/
│       │   └── index.tsx
│       ├── ranking/
│       │   └── index.tsx
│       └── quiz/
│           ├── index.tsx
│           ├── create.tsx
│           ├── question.tsx
│           ├── $sessionId.tsx
│           └── result.tsx
├── features/
│   ├── home/
│   │   ├── home-page.tsx
│   │   └── components/
│   ├── profile/
│   │   ├── profile-page.tsx
│   │   ├── components/
│   │   ├── utils/
│   │   ├── types.ts
│   │   ├── mock-data.ts
│   │   └── badge-colors.ts
│   ├── ranking/
│   │   ├── ranking-page.tsx
│   │   ├── components/
│   │   ├── types.ts
│   │   ├── mock-data.ts
│   │   ├── mock-group-rankings-1.ts
│   │   └── mock-group-rankings-2.ts
│   └── quiz/
│       ├── pages/
│       ├── components/
│       ├── schemas/
│       ├── mock/
│       ├── constants.ts
│       └── types.ts
├── components/
│   └── bottom-tab-bar.tsx
├── lib/
└── mocks/
```

## Placement Rules

新しいファイルは次の順で置き場所を判断する。

1. URL / params / loader / guard に直接関係するか  
   -> `src/routes/**`
2. 1 feature の実装本体か  
   -> `src/features/<feature>/**`
3. 複数 feature で使うか  
   -> `src/components`, `src/lib`

## TanStack Router Conventions

### Route Groups は directory-only で使う

`(tabs)` や `(public)` は URL segment ではなく、route の論理グループとして使う。

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

### `_` pathless layout は共通 wrapper 用

URL に segment を増やさず、複数 route に共通の layout / guard / provider を掛けたい時だけ `_` prefix を使う。

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

### `-components` / `-utils` は route-only helper 用に限定する

TanStack Router の route tree に含めたくない補助ファイルは、`-` prefix の directory を route 配下で使える。  
ただし K-Drop v2 の基本方針では、UI や schema の大半は `src/features` に置く。

使う場面:

- 特定 route file にだけ紐づく helper
- route layout 専用の小さな UI
- loader / guard 専用の mapper や validator

使わない場面:

- feature の複数 route から使う component
- feature 固有の schema / mock / formatter

## Responsibility by Folder

### `src/routes/`

責務:

- route entry
- params / search params
- loader / guard
- route-level layout

置かないもの:

- 大量の JSX
- feature 実装本体
- feature 固有の schema / mock / utility

### `src/features/`

責務:

- feature page
- feature-local component
- feature-local schema
- feature-local mock
- feature-local utility / type / constant
- feature 内で閉じる local navigation UI

`profile` `ranking` `quiz` のように、1つの feature を触る時の探索起点にする。

補足:

- route path / params / loader / guard の定義元は `src/routes` に置く
- ただし feature page が自身の UI フローのために `Link` / `useNavigate` を使うこと自体は許容する

### `src/components/`

責務:

- 複数 feature から使われる shared UI
- app shell のような横断 UI

現時点の代表例:

- `bottom-tab-bar.tsx` — app shell のタブバー
- `ui/PageShell.tsx` / `ui/PageHeader.tsx` / `ui/cta.tsx` / `ui/PillTab.tsx` / `ui/SectionCard.tsx` / `ui/EmptyState.tsx` — 複数 feature で使う共通 UI プリミティブ

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

### `src/mocks/`

責務:

- app-wide mock data

feature に閉じる mock は `src/features/<feature>/mock/` などへ置く。

## Concrete Rules

### Feature page

例:

- `src/features/home/home-page.tsx`
- `src/features/profile/profile-page.tsx`
- `src/features/ranking/ranking-page.tsx`
- `src/features/quiz/pages/quiz-result-page.tsx`

route file はこれらを import して接続するだけに保つ。

page が 1 つの feature は `<feature>-page.tsx` を feature 直下に置き、複数 page を持つ feature は `pages/` サブディレクトリにまとめる。  
`quiz` は `pages/` を持つが、`home` / `profile` / `ranking` は現時点で single page のため feature 直下に置く。

### Feature-local UI

例:

- `ProfileStats`
- `RankingTabs`
- `QuizCreateForm`

配置先:

- `src/features/<feature>/components/`

### Feature-local な純粋関数

例:

- `format-fan-duration.ts`
- mapper
- display formatter

配置先:

- `src/features/<feature>/utils/`

`format-fan-duration.ts` は UI ではないため、`components/` ではなく `utils/` に置く。

### Feature-local schema / mock / constants

例:

- `quiz-create-schema.ts`
- `idol-groups.ts`
- `quiz-questions.ts`
- `constants.ts`

配置先:

- `src/features/<feature>/schemas/`
- `src/features/<feature>/mock/`
- `src/features/<feature>/constants.ts`

### Shared UI

例:

- app shell
- shared form field

配置先:

- `src/components/`

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
└── index.tsx

src/features/profile/
├── profile-page.tsx
├── components/
│   └── ProfileStats.tsx
└── utils/
    └── format-fan-duration.ts
```

この配置により、`profile` の実装変更は `src/features/profile` を見ればほぼ完結する。

## Operational Rules

- route を追加するときは、まず `src/routes/<group>/<feature>/` に route file を切る
- 実装本体は `src/features/<feature>/` に置く
- `src/components` に置く前に「本当に複数 feature で使うか」を確認する
- feature-local mock は `src/features/<feature>/mock/` に置き、app-wide mock だけ `src/mocks` に置く
- generated file の `src/routeTree.gen.ts` は編集しない
