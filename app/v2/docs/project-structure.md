# プロジェクト構造配置ガイドライン

## 概要

K-Drop v2 で新しい機能をどこに配置するかを一貫して判断するためのガイドライン。

## ディレクトリ構成

```
app/v2/
├── src/                        → フロントエンド (SPA)
│   ├── routes/                 → TanStack Router の route 定義
│   ├── features/               → feature 実装本体
│   ├── components/             → 共有 UI コンポーネント
│   │   ├── layout/             → ヘッダー・フッター等
│   │   └── <entity>-detail/    → 詳細ページのサブコンポーネント
│   ├── lib/                    → API クライアント、ユーティリティ
│   └── main.tsx
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
├── docs/                       → 設計ガイド
├── tests/
│   └── factories/              → テストデータ生成
├── wrangler.toml               → D1 バインディング等
└── vite.config.ts
```

## モジュール配置の判断フロー

### ステップ 1: 機能の性質を特定

1. **横断的技術機能チェック**
   - Q: ドメイン知識を含まない技術機能か？
   - YES → `functions/core/` に配置
   - NO → 次へ

2. **ドメイン機能チェック**
   - Q: 特定のビジネス領域に特化した機能か？
   - YES → `functions/modules/<feature>/` に配置
   - NO → `functions/core/` に配置

3. **フロントエンド UI チェック**
   - Q: ユーザーに表示する UI コンポーネントか？
   - YES → 次へ

4. **フロントエンド routing チェック**
   - Q: URL / loader / guard / params に直接関わる route 定義か？
   - YES → `src/routes/` に配置
   - NO → `src/features/<feature>/` に配置

補足:

- `src/routes/` は route 定義の入口を置く
- `src/features/<feature>/` の page / component が local navigation のために `Link` / `useNavigate` を使うのは許容する

### ステップ 2: レイヤーの決定

サーバー側のドメイン機能は `docs/component-placement-guide.md` の判断フローに従い、レイヤーを決定する。

## モジュール間の依存関係ルール

### 許可される依存方向

```
functions/modules/<feature> → functions/core
src/ → functions/ の型定義（Hono RPC の AppType）
```

### 禁止される依存

```
functions/core → functions/modules（上位への依存）
moduleA ↔ moduleB（モジュール間の直接依存）
```

モジュール間の連携は ID 参照で行う。

## 新機能追加時の判断プロセス

1. **技術機能 vs ビジネス機能** を判定
2. **配置先**: `core`（技術 + 横断的）or `modules/<feature>`（ビジネス + ドメイン固有）
3. **レイヤー構成**: `component-placement-guide.md` の標準構成に従う
4. **依存関係**: 一方向依存を維持

## 想定するドメインモジュール

| モジュール | 対応する集約 |
|---|---|
| `users` | User, UserProfile |
| `groups` | IdolGroup, GroupCategory |
| `quizzes` | Quiz (コンテンツ管理) |
| `quiz-sessions` | QuizSession (プレイ・回答・進捗) |
| `scores` | UserScoreState, ScoreTier |
| `drops` | DropWallet (残高・トランザクション) |
| `events` | Event |
| `leaderboards` | Leaderboard (ランキングスナップショット) |

### 関連ドキュメント

- レイヤー別の詳細な配置規約: `docs/component-placement-guide.md`
- 集約境界: `docs/aggregate-boundary-guide.md`
- コアモジュール判断: `docs/core-module-organization.md`
