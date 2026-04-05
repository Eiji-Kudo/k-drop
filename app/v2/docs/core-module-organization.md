# コアモジュール配置ガイドライン

## 概要

`functions/core/` への機能配置を一貫して判断するためのガイドライン。

## 配置判断の必須条件（すべて満たす必要がある）

1. **ドメイン知識の完全排除** — ビジネスロジック・ドメイン固有の概念を一切含まない
2. **技術的横断機能** — 純粋に技術的な関心事のみ。複数モジュールで共通利用可能
3. **外部依存の抽象化** — 外部ライブラリやサービスのラッパー。技術変更時の影響を局所化

## 配置判断フロー

1. **ビジネス知識チェック** — ビジネス概念が含まれているか？ → YES ならドメインモジュールへ
2. **利用範囲チェック** — 単一モジュールでのみ使用されるか？ → YES ならそのモジュール内へ
3. **技術機能チェック** — 純粋に技術的な横断機能か？ → YES なら `core/` へ

## 想定する構成

```
functions/core/
├── db/              → D1 クライアント、トランザクションユーティリティ
├── errors/          → DomainError, InfraError, UnexpectedError 定義
├── result/          → Result<T, E> 型と success/err ヘルパー
├── http/            → Hono ミドルウェア、エラーハンドラ
└── utils/           → 汎用ユーティリティ（日付、文字列操作等）
```

### db/

- D1 クライアント初期化（Hono の `c.env.DB` から取得）
- トランザクション管理ヘルパー
- Drizzle ORM の設定

### errors/

- `DomainError<Reason>` — 業務ルール違反
- `InfraError<Reason>` — DB/外部 API の決定的な失敗
- `UnexpectedError` — 復旧に人手が必要な障害
- 具体的な reason コード（`quiz.not_found` 等）はドメインモジュール側で定義

### result/

- `Result<T, E>` 型定義
- `success()` / `err()` ヘルパー関数
- Railway-oriented な合成パターン

### http/

- 認証ミドルウェア（Better Auth セッション検証）
- リクエストログ・トレース
- グローバルエラーハンドラ（`app.onError`）
- 共通バリデーションヘルパー

### utils/

- ULID 生成
- 日付操作（ISO8601 変換等）
- 汎用ヘルパー

## コアモジュールに配置すべきでない機能

- 特定のビジネス領域に特化した処理
- ドメイン固有の設定や定数
- ドメインモデルや業務ルール
- ビジネス検証ロジック
- 具体的なエラー reason コード

## 依存関係ルール

### 許可される依存

```
functions/modules/<feature> → functions/core
core 内部: http → errors → result
```

### 禁止される依存

```
functions/core → functions/modules（ドメインへの逆依存）
```

新しい機能を追加する場合はまず既存ディレクトリで表現できないか検討し、どうしても適合しない場合のみ新しいサブディレクトリを作成する。

### 関連ドキュメント

- プロジェクト全体のモジュール構造: `docs/project-structure.md`
- レイヤー別の配置規約: `docs/component-placement-guide.md`
- エラーハンドリング方針: `docs/error-handling.md`
