# モノレポ化計画: app/v1 + app/v2 構造への移行

作成日: 2026-04-05
ステータス: 計画中

## 目的

現在のシングルパッケージExpoプロジェクトを、`app/v1`（既存Expoアプリ）と `app/v2`（将来のPWA）に分離したモノレポ構造に移行する。

## 移行後のディレクトリ構造

```
k-drop/
├── app/
│   ├── v1/                        # 既存Expoプロジェクト (React Native)
│   │   ├── src/
│   │   │   ├── app/               # Expo Router (ファイルベースルーティング)
│   │   │   ├── features/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── repositories/
│   │   │   ├── utils/
│   │   │   ├── context/
│   │   │   ├── constants/
│   │   │   └── types/
│   │   ├── assets/
│   │   ├── __mocks__/
│   │   ├── eslint-rules/
│   │   ├── scripts/
│   │   ├── tests/
│   │   ├── package.json
│   │   ├── app.config.ts
│   │   ├── tsconfig.json
│   │   ├── .eslintrc.js
│   │   ├── .prettierrc
│   │   ├── jest-setup.js
│   │   ├── jest.integration.config.js
│   │   ├── database.types.ts
│   │   ├── expo-env.d.ts
│   │   └── lefthook.yml
│   └── v2/                        # 将来のPWA (技術選定未定)
│       └── (空 or 最小構成)
│
├── supabase/                      # 共有バックエンド (v1/v2共通)
│   ├── config.toml
│   ├── functions/
│   ├── migrations/
│   └── seed/
│
├── drizzle/                       # 共有ORM設定
│   ├── schema.ts
│   ├── relations.ts
│   └── meta/
│
├── docs/                          # 共有ドキュメント
├── .github/                       # CI/CD
│   ├── workflows/
│   │   ├── v1-ci.yml              # v1用CI (旧ci.yml)
│   │   └── claude.yml
│   └── pull_request_template.md
│
├── drizzle.config.ts              # ルートのDrizzle設定
├── CLAUDE.md
├── README.md
├── .gitignore
└── .husky/
```

## 判断ポイント

### 共有リソース（ルートに残すもの）
- **supabase/**: バックエンドはv1/v2で共有。マイグレーション・Edge Functionsは一元管理
- **drizzle/**: DB スキーマ定義はバックエンドに紐づくためルート
- **drizzle.config.ts**: drizzle/と同様
- **docs/**: プロジェクト全体のドキュメント
- **.github/**: CI/CDワークフロー（パスフィルタで各app向けに分岐）
- **.husky/**: Git hooks はリポジトリ単位
- **.gitignore**: リポジトリ全体
- **CLAUDE.md**: プロジェクト全体のガイド

### v1配下に移動するもの
- **app/** (Expo Routerルーティング) → `app/v1/src/app/`
- **features/** → `app/v1/src/features/`
- **components/** → `app/v1/src/components/`
- **hooks/** → `app/v1/src/hooks/`
- **repositories/** → `app/v1/src/repositories/`
- **utils/** → `app/v1/src/utils/`
- **context/** → `app/v1/src/context/`
- **constants/** → `app/v1/src/constants/`
- **types/** → `app/v1/src/types/`
- **assets/** → `app/v1/assets/`
- **__mocks__/** → `app/v1/__mocks__/`
- **eslint-rules/** → `app/v1/eslint-rules/`
- **scripts/** → `app/v1/scripts/`
- **tests/** → `app/v1/tests/`
- **package.json** → `app/v1/package.json`
- **package-lock.json** → `app/v1/package-lock.json`
- **app.config.ts** → `app/v1/app.config.ts`
- **tsconfig.json** → `app/v1/tsconfig.json`
- **.eslintrc.js** → `app/v1/.eslintrc.js`
- **.prettierrc** → `app/v1/.prettierrc`
- **jest-setup.js** → `app/v1/jest-setup.js`
- **jest.integration.config.js** → `app/v1/jest.integration.config.js`
- **database.types.ts** → `app/v1/database.types.ts`
- **expo-env.d.ts** → `app/v1/expo-env.d.ts`

## 設定ファイルの修正が必要な箇所

### 1. app/v1/tsconfig.json
- `paths` の `@/*` エイリアスを `./src/*` に変更
- `include` / `exclude` パスの調整

### 2. app/v1/.eslintrc.js
- `parserOptions.project` パスの更新
- `ignorePatterns` の調整（supabase, drizzleはもうv1内にない）
- `overrides` のファイルパターン更新 (`app/**` → `src/app/**` 等)

### 3. app/v1/app.config.ts
- `icon`, `adaptiveIcon`, `splash` のアセットパス更新

### 4. app/v1/package.json
- `main` エントリポイント確認
- `scripts` のパス更新（`gen-types` のパスなど）
- `jest` 設定のパス更新

### 5. CI: .github/workflows/v1-ci.yml (旧 ci.yml)
- `working-directory: app/v1` の追加
- パスフィルタ追加: `paths: ['app/v1/**']`
- npm install / test / lint のワーキングディレクトリ指定

### 6. lefthook.yml
- v1のlefthookはapp/v1内に移動
- ルートにも最小限のlefthookを残すか検討

### 7. drizzle.config.ts (ルート)
- パスはsupabase/がルートに残るため変更不要

### 8. .gitignore
- `ios/` / `android/` のパスを `app/v1/ios/` / `app/v1/android/` に更新

### 9. CLAUDE.md
- パス参照の更新、v1/v2の説明追加

### 10. Expo Router
- `app.config.ts` で `expo-router` プラグインのルートディレクトリ設定が必要になる可能性
- Expo Routerはデフォルトで `app/` ディレクトリを探すため、`src/app/` に変えた場合は明示的に指定する

## タスクチェックリスト

### Phase 1: ディレクトリ作成・ファイル移動
- [ ] `app/v1/` ディレクトリ作成
- [ ] `app/v1/src/` ディレクトリ作成
- [ ] 現在の `app/` (Expo Router) を `app/v1/src/app/` に移動
- [ ] `features/`, `components/`, `hooks/`, `repositories/`, `utils/`, `context/`, `constants/`, `types/` を `app/v1/src/` へ移動
- [ ] `assets/` を `app/v1/` へ移動
- [ ] `__mocks__/`, `eslint-rules/`, `scripts/`, `tests/` を `app/v1/` へ移動
- [ ] 設定ファイル群を `app/v1/` へ移動 (package.json, tsconfig.json, .eslintrc.js, .prettierrc, app.config.ts, jest-setup.js, jest.integration.config.js, database.types.ts, expo-env.d.ts, package-lock.json)
- [ ] `app/v2/` ディレクトリ作成（空）

### Phase 2: 設定ファイル修正
- [ ] `app/v1/tsconfig.json` のパスエイリアス・include/exclude更新
- [ ] `app/v1/.eslintrc.js` のパス参照更新
- [ ] `app/v1/app.config.ts` のアセットパス更新 + Expo Routerルート設定
- [ ] `app/v1/package.json` のscripts・jest設定パス更新
- [ ] `app/v1/jest.integration.config.js` のパス更新
- [ ] ルート `.gitignore` の更新
- [ ] ルート `CLAUDE.md` の更新

### Phase 3: CI/CD・Git Hooks修正
- [ ] `.github/workflows/ci.yml` → `v1-ci.yml` にリネーム、working-directory・パスフィルタ追加
- [ ] `lefthook.yml` を `app/v1/` に移動、ルートから参照する形に変更
- [ ] `.husky/` のフック内容がv1のディレクトリで動作するよう修正

### Phase 4: 動作確認
- [ ] `cd app/v1 && npm install` が成功する
- [ ] `cd app/v1 && npm test` が全パスする
- [ ] `cd app/v1 && npm run test:types` がパスする
- [ ] `cd app/v1 && npm run lint` がパスする
- [ ] `cd app/v1 && npm start` でExpo dev serverが起動する
- [ ] ルートから `npx supabase start` が動作する
- [ ] ルートから `drizzle-kit` コマンドが動作する

## 注意点・リスク

- **Expo Routerの `app/` ディレクトリ検出**: Expo Routerはプロジェクトルートの `app/` を自動検出する。`src/app/` に移動した場合、`app.json` or `app.config.ts` で明示的に指定するか、`expo-router` プラグインの設定で `root` を指定する必要がある
- **パスエイリアス `@/*`**: 現在 `@/*` → `./*` だが、`src/` を挟むため全importに影響する可能性。`@/*` → `./src/*` に変更し、ソースコード内のimport自体は変更不要にする
- **git履歴**: `git mv` を使うことで履歴を維持する
- **node_modules**: v1の `npm install` 後に `node_modules` が `app/v1/node_modules` に生成される
- **env files**: `.env`, `.env.local` もv1に移動が必要（Expoが参照するため）
