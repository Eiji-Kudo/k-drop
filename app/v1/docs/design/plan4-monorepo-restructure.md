# モノレポ化計画: app/v1 + app/v2 構造への移行

作成日: 2026-04-05
ステータス: 計画中

## 目的

現在のシングルパッケージExpoプロジェクトを、`app/v1`（既存Expoアプリ）と `app/v2`（将来のPWA）に分離した構造に移行する。v1とv2は完全に独立。共有リソースはない。

## 移行後のディレクトリ構造

```
k-drop/
├── app/
│   ├── v1/                        # 既存Expoプロジェクト (React Native) — 完全自己完結
│   │   ├── app/                   # Expo Router (ファイルベースルーティング)
│   │   ├── features/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── repositories/
│   │   ├── utils/
│   │   ├── context/
│   │   ├── constants/
│   │   ├── types/
│   │   ├── assets/
│   │   ├── supabase/              # Edge Functions, migrations, seed
│   │   ├── drizzle/               # ORM schema
│   │   ├── docs/                  # v1ドキュメント
│   │   ├── __mocks__/
│   │   ├── eslint-rules/
│   │   ├── scripts/
│   │   ├── tests/
│   │   ├── cline/
│   │   ├── package.json
│   │   ├── package-lock.json
│   │   ├── app.config.ts
│   │   ├── tsconfig.json
│   │   ├── drizzle.config.ts
│   │   ├── .eslintrc.js
│   │   ├── .prettierrc
│   │   ├── jest-setup.js
│   │   ├── jest.integration.config.js
│   │   ├── database.types.ts
│   │   ├── expo-env.d.ts
│   │   ├── .env
│   │   └── .env.local
│   │
│   └── v2/                        # 将来のPWA (技術選定未定)
│       └── .gitkeep
│
├── .github/                       # CI/CD (GitHubがルート必須)
│   ├── workflows/
│   │   ├── v1-ci.yml              # v1用CI (旧ci.yml)
│   │   └── claude.yml
│   └── pull_request_template.md
│
├── .gitignore
├── CLAUDE.md
└── README.md
```

## 方針

- **v1とv2は完全に独立** — 共有リソースなし。v2はv1のsupabase/drizzle等を使わない
- **ルートには最低限のみ** — `.github/`, `.gitignore`, `CLAUDE.md`, `README.md` のみ
- **husky・lefthook削除** — git hooksは廃止（CIで担保）
- **v1内のディレクトリ構造は現状維持** — `src/` 階層は挟まない。Expo Routerの `app/` もそのまま `app/v1/app/` に置く
- **git履歴を維持** — `git mv` で移動

## v1に移動するもの（現在のルートから）

### ソースコード
| 移動元 | 移動先 |
|--------|--------|
| `app/` (Expo Router) | `app/v1/app/` |
| `features/` | `app/v1/features/` |
| `components/` | `app/v1/components/` |
| `hooks/` | `app/v1/hooks/` |
| `repositories/` | `app/v1/repositories/` |
| `utils/` | `app/v1/utils/` |
| `context/` | `app/v1/context/` |
| `constants/` | `app/v1/constants/` |
| `types/` | `app/v1/types/` |

### インフラ・バックエンド
| 移動元 | 移動先 |
|--------|--------|
| `supabase/` | `app/v1/supabase/` |
| `drizzle/` | `app/v1/drizzle/` |
| `drizzle.config.ts` | `app/v1/drizzle.config.ts` |

### 設定ファイル
| 移動元 | 移動先 |
|--------|--------|
| `package.json` | `app/v1/package.json` |
| `package-lock.json` | `app/v1/package-lock.json` |
| `app.config.ts` | `app/v1/app.config.ts` |
| `tsconfig.json` | `app/v1/tsconfig.json` |
| `.eslintrc.js` | `app/v1/.eslintrc.js` |
| `.prettierrc` | `app/v1/.prettierrc` |
| `jest-setup.js` | `app/v1/jest-setup.js` |
| `jest.integration.config.js` | `app/v1/jest.integration.config.js` |
| `database.types.ts` | `app/v1/database.types.ts` |
| `expo-env.d.ts` | `app/v1/expo-env.d.ts` |
| `.env` / `.env.local` | `app/v1/.env` / `app/v1/.env.local` |

### その他
| 移動元 | 移動先 |
|--------|--------|
| `assets/` | `app/v1/assets/` |
| `__mocks__/` | `app/v1/__mocks__/` |
| `eslint-rules/` | `app/v1/eslint-rules/` |
| `scripts/` | `app/v1/scripts/` |
| `tests/` | `app/v1/tests/` |
| `docs/` | `app/v1/docs/` |
| `documents/` | `app/v1/documents/` |
| `cline/` | `app/v1/cline/` |
| `IMPLEMENTATION_SUMMARY.md` | `app/v1/IMPLEMENTATION_SUMMARY.md` |

## 設定ファイルの修正

### 1. app/v1/package.json
- `scripts.gen-types`: パス変更不要（supabaseもv1内に移動するため相対パス維持）
- `scripts.test:types:functions`: `cd supabase/functions` はv1内で動くので変更不要
- `scripts.prepare`: `lefthook install` — v1内で実行する場合のパス確認
- `jest.setupFilesAfterEnv`: `./jest-setup.js` — 変更不要

### 2. app/v1/tsconfig.json
- `paths.@/*`: `./*` → 変更不要（v1がプロジェクトルートになるため）
- `exclude`: `supabase/functions`, `drizzle` — 変更不要

### 3. app/v1/.eslintrc.js
- `parserOptions.project`: `./tsconfig.json` → 変更不要
- `ignorePatterns`: `supabase/`, `drizzle/` → 変更不要

### 4. app/v1/app.config.ts
- アセットパス (`./assets/images/...`) → 変更不要（assetsもv1内）

### 5. app/v1/drizzle.config.ts
- `schema`: `./supabase/functions/_shared/schema.ts` → 変更不要
- `out`: `./drizzle` → 変更不要

### 6. .github/workflows/v1-ci.yml (旧 ci.yml)
```yaml
on:
  push:
    branches: [main]
    paths: ['app/v1/**']
  pull_request:
    branches: [main]
    paths: ['app/v1/**']

jobs:
  test:
    defaults:
      run:
        working-directory: app/v1
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'
          cache-dependency-path: app/v1/package-lock.json
      - run: npm install
      - run: npm run test
      - run: npm run test:types
      - run: npm run lint
```

### 7. .gitignore (ルート)
- `node_modules/` → そのまま（再帰マッチ）
- `ios/`, `android/` → `app/v1/ios/`, `app/v1/android/`
- `.env` 系 → `app/v1/.env*.local` に更新
- `.expo/` → そのまま（再帰マッチ）

### 8. CLAUDE.md (ルート)
- v1/v2の構造説明を追加
- コマンドに `cd app/v1` プレフィックス追加

## タスクチェックリスト

### Phase 1: ディレクトリ作成・ファイル移動
- [ ] `app/v1/` ディレクトリ作成
- [ ] 現在の `app/` (Expo Router) を退避してから `app/v1/app/` に移動
- [ ] ソースディレクトリを `app/v1/` に `git mv`: features, components, hooks, repositories, utils, context, constants, types
- [ ] インフラを `app/v1/` に `git mv`: supabase, drizzle, drizzle.config.ts
- [ ] 設定ファイルを `app/v1/` に `git mv`: package.json, package-lock.json, app.config.ts, tsconfig.json, .eslintrc.js, .prettierrc, jest-setup.js, jest.integration.config.js, database.types.ts, expo-env.d.ts
- [ ] その他を `app/v1/` に `git mv`: assets, __mocks__, eslint-rules, scripts, tests, docs, documents, cline, IMPLEMENTATION_SUMMARY.md
- [ ] .env, .env.local を `app/v1/` に移動
- [ ] `app/v2/` ディレクトリ作成 + `.gitkeep`

### Phase 2: 不要ファイル削除
- [ ] `.husky/` ディレクトリ削除
- [ ] `lefthook.yml` 削除
- [ ] `app/v1/package.json` から `scripts.prepare` (`lefthook install`) 削除
- [ ] `app/v1/package.json` の devDependencies から `lefthook` 削除

### Phase 3: 設定ファイル修正
- [ ] `.github/workflows/ci.yml` → `v1-ci.yml` にリネーム、working-directory + paths フィルタ追加
- [ ] `.gitignore` のパス更新
- [ ] ルート `CLAUDE.md` 更新

### Phase 4: 動作確認
- [ ] `cd app/v1 && npm install` が成功する
- [ ] `cd app/v1 && npm test` が全パスする
- [ ] `cd app/v1 && npm run test:types` がパスする
- [ ] `cd app/v1 && npm run lint` がパスする
- [ ] `cd app/v1 && npm start` でExpo dev serverが起動する
- [ ] `cd app/v1 && npx supabase start` が動作する

## 注意点

- **Expo Routerの `app/` 検出**: v1内の `app/` はExpo Routerが自動検出する。v1がプロジェクトルートになるため問題ない
- **パスエイリアス `@/*`**: v1がプロジェクトルートなので `@/*` → `./*` のまま変更不要。ソースコード内のimportは一切変更不要
- **node_modules**: `app/v1/node_modules` に生成される。ルートにはnode_modulesは不要
- **設定ファイルの修正が最小限**: v1内の相対パスは全て維持されるため、ほとんどの設定は変更不要
