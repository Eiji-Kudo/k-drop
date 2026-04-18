# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

K-Drop is a KPOP fan app. This repository contains two independent apps:

- **app/v1/** — React Native/Expo mobile app (quiz, rankings, profile)
- **app/v2/** — PWA (Vite + React + TypeScript)

## Repository Structure

```
k-drop/
├── app/
│   ├── v1/    # Expo project (self-contained)
│   └── v2/    # PWA (Vite + React + TypeScript)
├── .github/   # CI/CD workflows
├── CLAUDE.md
└── README.md
```

## v1 (Expo App)

All commands should be run from `app/v1/`.

### Development

- `npm start` - Start Expo dev server
- `npx supabase start` - Start local Supabase instance (http://localhost:54323)
- `npx supabase stop --no-backup` - Stop local Supabase

### Testing & Quality

- `npm test` - Run Jest tests
- `npm run test:types` or `npx tsc --noEmit` - TypeScript type checking
- `npm run lint` or `npx eslint . --fix` - ESLint with auto-fix
- `npm run format` - Prettier formatting
- `npm run check:all` - Run all checks (tests, types, lint, format)

### Database

- `npm run gen-types` - Generate TypeScript types from Supabase schema

### Architecture Principles

#### File Structure

- **File-based routing** with Expo Router (`app/` directory)
- **Feature-based organization** (`features/answer-quiz/`)
- **Separation of concerns**: Components in `/components/`, feature-specific in feature folders
- **Test files** alongside components in `__tests__` folders

#### State Management Pattern

Follow the separation of concerns pattern:

```
Components → Custom Hooks → Context (UI State) + Utils (Pure Functions) → Repository (Data Access)
```

1. **Repository Layer** (`/repositories/`): Supabase data access
2. **Utils Layer** (`/utils/`): Pure business logic functions
3. **Context Layer** (`/context/`): UI state management only
4. **Custom Hooks** (`/hooks/`): Combine the above layers for component use

#### Key Guidelines

- **UI State in Context**: Current selections, modal states, session info
- **Business Logic in Utils**: Calculations, filtering, validation
- **Data Access in Repository**: Supabase queries, API calls
- **Use React Query** for server state management
- **Test pure functions** separately from React components

#### Testing Approach

- Unit tests with Jest and React Testing Library
- Mock Supabase client for data layer tests
- Test business logic as pure functions
- Use test utilities from `__tests__/testUtils.tsx`

### Environment Setup

Required environment variables:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### Code Style

- TypeScript with strict mode
- Path aliases configured (`@/*`)
- NO comments in code unless explicitly requested
- Follow existing patterns in the codebase

## v2 (PWA)

All commands should be run from `app/v2/`.

### Development

- `pnpm run dev` - Start Vite dev server
- `pnpm install` - Install dependencies (pnpm enforced via `preinstall`)

### Testing & Quality

- `pnpm run test` - Run Vitest tests
- `pnpm run test:types` or `tsc -b` - TypeScript type checking
- `pnpm run lint` - ESLint (flat config)
- `pnpm run format` - Biome formatting
- `pnpm run format:check` - Biome format check
- `pnpm run check:all` - Run all checks (tests, types, lint, format, build)

### Tooling

- **Package manager**: pnpm (enforced, do NOT use npm/yarn)
- **Formatter**: Biome (`lineWidth: 150`)
- **Linter**: ESLint flat config
- **Test runner**: Vitest + @testing-library/react
- **Build**: Vite 8

### Architecture

- **DDD（ドメイン駆動設計）** を採用。集約境界を意識した設計を行う
- 仕様・設計の確認が必要な場合は `app/v2/docs/` の各種ガイドを参照してから実装に着手

### Directory Structure

```
app/v2/
├── src/                        → フロントエンド (SPA)
│   ├── routes/                 → TanStack Router の route 定義
│   ├── features/               → feature 実装本体（page / component / schema / mock / utils）
│   ├── components/             → 複数 feature で使う shared UI
│   └── lib/                    → API クライアント、ユーティリティ
├── functions/                  → バックエンド (Pages Functions)
│   ├── core/                   → ドメイン知識を含まない共通技術コード
│   │   ├── errors/             → DomainError / InfraError / UnexpectedError
│   │   ├── result/             → Result<T, E> 型
│   │   ├── db/                 → D1 クライアント・トランザクション
│   │   └── http/               → Hono ミドルウェア、エラーハンドラ
│   ├── modules/                → ドメインモジュール
│   │   └── <feature>/
│   │       ├── domains/        → 集約・値オブジェクト
│   │       ├── repositories/   → 1 集約 = 1 Repository
│   │       ├── queries/        → 読み取り専用クエリ (CQRS)
│   │       ├── services/       → アプリケーションサービス
│   │       ├── handlers/       → Hono ハンドラ
│   │       └── schemas/        → Zod スキーマ
│   ├── db/                     → Drizzle スキーマ定義
│   └── api/
│       └── [[route]].ts        → Hono で全 API ルートをハンドル
└── docs/                       → 設計ガイド
```

- 新規コードの配置に迷った場合:
  1. ドメイン知識を含まない汎用技術 → `functions/core/`
  2. ドメイン固有の機能 → `functions/modules/<feature>/`

### Domain Design Principles

- `domains/` 配下では不正な状態を表現できないようファクトリ (`initialize*`) を通じて生成し、ビジネスルールをドメイン層に集約
- 状態遷移はメソッドで表現し、プロパティの直接書き換えは禁止
- Repository は集約の復元と永続化のみを担い、読み取り系は `queries/` に分離
- 集約間は ID 経由で参照。直接のオブジェクト参照は持たない

### DI Pattern

**ドメインエンティティ** (`domains/<name>/<name>.entity.ts`)

```ts
const FooEntity = z.object({ ... }).brand('Foo')
export type Foo = z.infer<typeof FooEntity>

export const initializeFoo = (input: { ... }): Foo => FooEntity.parse({ id: ulid(), ...input })
export const reconstructFoo = (raw: { ... }): Foo => FooEntity.parse(raw)
```

**リポジトリ** (`repositories/<name>.repository.ts`)

```ts
export const fooRepository = (db: D1Database) => ({
  findById: async (id: string) => { ... },
  save: async (entity: Foo) => { ... },
})
export type FooRepository = ReturnType<typeof fooRepository>
```

**クエリ** (`queries/<name>.query.ts`)

```ts
export const listFoos = async (db: D1Database, args: ListArgs) => { ... }
export type ListFoos = typeof listFoos
```

**ハンドラ** (`handlers/<name>.handler.ts`)

```ts
type Deps = { db: D1Database; listFoos: ListFoos }
export const foosListHandler = ({ db, listFoos }: Deps) => {
  return new Hono().get('/', async (c) => {
    const result = await listFoos(db, { ... })
    return c.json(result)
  })
}
```

### Error Handling

- 予期した失敗は Result で返す。throw してよいのは UnexpectedError のみ
- ハンドラーで switch + `satisfies never` による網羅性チェック
- 詳細: `docs/error-handling.md`

### Function Argument Convention

| 引数の数 | スタイル | 例 |
|---|---|---|
| 1 つ | positional | `findById(id: string)` |
| 2 つ以上 | named (オブジェクト) | `list({ idolGroupId, limit }: { ... })` |

### Code Quality

- TypeScript strict モード
- 型アサーション（`as` キャスト）は禁止。型を正しく定義して解決する
- `eslint-disable` コメントによるルール抑制は原則禁止。コードを再構造化して自然にルールを満たすこと

### Design Documents

- `docs/architecture.md` — 技術スタック・設計方針
- `docs/project-structure.md` — モジュール配置の判断フロー
- `docs/component-placement-guide.md` — レイヤーごとの責務整理
- `docs/aggregate-boundary-guide.md` — 集約境界の設計指針
- `docs/error-handling.md` — エラーハンドリング方針
- `docs/core-module-organization.md` — コアモジュール配置方針
- `er-diagram.md` — ER 図
