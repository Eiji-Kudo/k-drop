# PR #96 チームレビュー懸念点

## 概要

- **PR**: [WIP] Set up Hono RPC client for type-safe API calls
- **URL**: https://github.com/Eiji-Kudo/k-drop/pull/96
- **調査日**: 2026-04-05
- **レビュー方式**: 並列レビュー + 相互検証
- **レビュー回数**: 1回目

## レビュワー構成

| レビュワー | 専門領域 | 選定理由 |
|------------|----------|----------|
| `architecture-reviewer` | モジュール構成・DI・関心の分離 | 新規ディレクトリ(lib/rpc/)追加、factoryパターン導入のため設計妥当性の評価が必要 |
| `correctness-reviewer` | エラーハンドリング・型安全性・クエリ設定 | Hono RPC + TanStack Queryの型整合性、エラー処理、設定の適切性を評価 |
| `testing-reviewer` | テストカバレッジ・モックパターン | 新規追加コードのテスト網羅性、モック戦略の堅牢性を評価 |

## サマリー

| 重要度 | 件数 | 対応済み |
|--------|------|----------|
| CRITICAL | 0 | 0 |
| HIGH | 3 | 3 |
| MEDIUM | 5 | 5 |

## 参照したガイドライン

- `CLAUDE.md` (root)
- `app/v2/docs/architecture.md`
- `app/v2/docs/project-structure.md`

## 未対応の懸念点

（なし）

---

## 対応不要の懸念点

<details>
<summary>6. vi.stubGlobal モック戦略の脆弱性（MEDIUM / 対応不要）</summary>

- **ファイル**: `app/v2/src/__tests__/App.test.tsx`
- **問題**: `vi.stubGlobal("fetch")` がHonoの `hc` 内部実装に依存。MSW導入が推奨されるが、現時点で実害なし
- **理由**: MSW導入はこのPRのスコープ外。現行のモック戦略は動作しており、YAGNI原則に基づき将来必要になった時点で対応する

</details>

<details>
<summary>7. lib/rpc/ ディレクトリの配置がドキュメントのガイダンスと齟齬（MEDIUM / 対応不要）</summary>

- **ファイル**: ディレクトリ構成 `app/v2/src/lib/rpc/`
- **問題**: `docs/architecture.md` では `src/lib/api.ts` にクライアントを配置する例が示されているが、本PRでは `lib/rpc/` に配置
- **理由**: ドキュメント更新はこのPRのスコープ外。`rpc/` 構成自体は合理的であり、ドキュメント側の更新で対応すべき

</details>

<details>
<summary>8. ヘルスチェックロジックがルートコンポーネントに直接記述（MEDIUM / 対応不要）</summary>

- **ファイル**: `app/v2/src/App.tsx`
- **問題**: ヘルスチェックのAPI呼び出しと表示ロジックがルートコンポーネントに直接記述されている
- **理由**: PRタイトルが[WIP]であり、初期セットアップの動作確認目的。本格実装時にコンポーネント分離またはルートローダー活用で対応する

</details>

## 対応済みの懸念点

<details>
<summary>1. factory パターンの過剰設計（HIGH / 修正済み）</summary>

- **ファイル**: `app/v2/src/lib/rpc/health-check.ts`
- **問題**: 1エンドポイントに対し `createFetchHealthCheck` / `createHealthCheckQueryOptions` の2段factory + シングルトン定数で6エクスポートが過剰
- **対応**: factoryパターンを除去し、`fetchHealthCheck` を通常のエクスポート関数に、`healthCheckQueryOptions` を直接定義に簡素化。エクスポートを6→4に削減

</details>

<details>
<summary>2. fetchHealthCheck のエラーパスが未テスト（HIGH / 修正済み）</summary>

- **ファイル**: `app/v2/src/__tests__/api.test.ts`
- **問題**: `!response.ok` 時の throw 分岐をテストするユニットテストが存在しなかった
- **対応**: `api.test.ts` に500レスポンス時のエラーテストを追加。`vi.stubGlobal("fetch")` で500レスポンスをモックし、`fetchHealthCheck` がエラーメッセージ付きで throw することを検証

</details>

<details>
<summary>3. App.tsx のエラー状態・ローディング状態の表示が未テスト（HIGH / 修正済み）</summary>

- **ファイル**: `app/v2/src/__tests__/App.test.tsx`
- **問題**: `isPending` 時の "Checking API..." と `isError` 時の "API status: unavailable" の表示テストが欠如
- **対応**: ローディング状態テスト（never-resolving Promise）とエラー状態テスト（mockRejectedValue）の2テストケースを追加。テスト用 QueryClient に `retry: false` を設定し、明示的な `cleanup()` を追加

</details>

<details>
<summary>4. ヘルスチェッククエリのデフォルト設定が過剰（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/src/lib/rpc/health-check.ts`
- **問題**: TanStack Query v5 のデフォルト `refetchOnWindowFocus: true` によりタブ切り替え時に不要なヘルスチェックリクエストが発生
- **対応**: `healthCheckQueryOptions` に `refetchOnWindowFocus: false` を追加

</details>

<details>
<summary>5. AppProviders の queryClient prop の型（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/src/lib/app-providers.tsx`
- **問題**: `typeof appQueryClient` で型を定義しており、意図が不明瞭で不要な変数依存
- **対応**: `QueryClient` 型を `@tanstack/react-query` から直接使用するように変更

</details>
