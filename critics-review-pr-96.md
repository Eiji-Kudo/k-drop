# PR #96 対応済みの懸念点

> 未対応の懸念点は [critics-review-pr-96.md](./critics-review-pr-96.md) を参照（現在なし）

## 再発防止すべき知見

### 1. DI設計はテスト戦略と整合させる

- Hono RPC のような「呼び出し時にグローバル fetch を参照する」ライブラリでは、各 query ファイルに factory DI を設ける必要はない。`vi.stubGlobal("fetch")` で十分
- factory パターンを導入するなら、テスト側もその DI 口を使うこと。使わないなら factory 自体が不要（YAGNI）
- エンドポイント追加時のボイラープレートを意識し、最小構成（fetch関数 + queryOptions + hook）を基本とする

### 2. UIの全状態分岐は初回実装時にテストする

- `useQuery` を使うコンポーネントは `isPending` / `isError` / `isSuccess` の3状態が必ず発生する。成功パスだけテストして残りを後回しにしない
- ローディングテストは `new Promise(() => {})` で、エラーテストは `mockRejectedValue` で再現できる
- テスト用 QueryClient には `retry: false` を設定し、エラーテストの即時完了を保証する

### 3. TanStack Query のデフォルト設定はクエリ特性に合わせて上書きする

- デフォルトの `retry: 3` + exponential backoff は、ヘルスチェックのような即時フィードバック目的のクエリでは過剰。APIダウン時に数十秒ユーザーを待たせる
- `refetchOnWindowFocus: true` も頻繁な呼び出しが不要なクエリでは無効にすべき
- クエリ特性ごとに `queryOptions` レベルで個別設定を検討する

## 修正サマリ

| # | 重要度 | 内容 | 修正 |
|---|--------|------|------|
| 1 | HIGH | factory パターンの過剰設計 | 2段factory除去、直接定義に簡素化 |
| 2 | HIGH | fetchHealthCheck エラーパス未テスト | 500レスポンス時のエラーテスト追加 |
| 3 | HIGH | App.tsx ローディング/エラー状態未テスト | 2テストケース追加、テスト用QueryClientにretry:false |
| 4 | MEDIUM | ヘルスチェッククエリのデフォルト設定が過剰 | refetchOnWindowFocus: false 追加 |
| 5 | MEDIUM | AppProviders の queryClient prop 型が不明瞭 | typeof → QueryClient 直接使用 |
| 9 | MEDIUM | テストで不要な dynamic import | static import に変更 |
| 10 | MEDIUM | テストで冗長な vi.stubGlobal | 冗長な呼び出し削除 |
| 6,7,8 | - | 対応不要と判断 | YAGNI / スコープ外 / WIP前提 |
