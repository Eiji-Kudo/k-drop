# PR #76 対応済みの懸念点

> 未対応の懸念点は現在なし（全件対応済み）

## 再発防止すべき知見

### 1. tsconfig の `types` フィールドは `@types/` 自動探索を無効化する

- `tsconfig.json` に `"types": ["vite/client"]` のように明示指定すると、`node_modules/@types/` 配下のパッケージが自動認識されなくなる
- Vite 公式テンプレートが `vite-env.d.ts` で triple-slash ディレクティブを使う理由はこの副作用を避けるため
- 同様に `vitest/globals` を `types` に含めると本番コードの型名前空間が汚染され、テスト用APIが型エラーなく本番コードで参照可能になる

### 2. フォーマッタ（ソフトリミット）とリンター（ハードリミット）の行長設定は競合する

- Biome の `lineWidth` はベストエフォートのソフトリミット（分割不可能なトークンでは超過する）
- ESLint の `max-len` はハードリミット（超過は常にエラー）
- 同じ値（150）を設定してもフォーマット後にリントエラーが発生しうる。行長管理はフォーマッタに一任すべき

### 3. 既存プロジェクトの設定を新規プロジェクトに移植する際はルール漏れを確認する

- v1 → v2 移植で `max-lines`, `consistent-type-assertions`, `no-unused-vars` が欠落していた
- READMEに「v1ベースの設定」と謳う場合、差分チェックリストを作るべき

## 修正サマリ

| # | 重要度 | 内容 | 修正 |
|---|--------|------|------|
| 1 | HIGH | v2のCI/CDワークフローが未作成 | `v2-ci.yml` を作成（pnpm対応） |
| 2 | MEDIUM | テストで `renderToStaticMarkup` 使用 | `@testing-library/react` に移行 |
| 3 | MEDIUM | `vitest/globals` 設定不統一・型汚染 | `globals: false` + `types` から除去 |
| 4 | MEDIUM | `vite-env.d.ts` 不在で `@types/` 自動探索無効化 | `vite-env.d.ts` 作成、`types` フィールド削除 |
| 5 | MEDIUM | `--ext` フラグが flat config で冗長 | `--ext` を削除 |
| 6 | MEDIUM | `max-len` と Biome `lineWidth` の競合 | `max-len` ルールを削除 |
| 7 | MEDIUM | v1の重要ESLintルール欠落 | `max-lines`, `consistent-type-assertions`, `no-unused-vars` を追加 |
| 8 | MEDIUM | `.gitignore` に `.env` パターンなし | `.env` / `.env.*` を追加 |
| 9 | MEDIUM | `lang="en"` のまま | `lang="ja"` に変更 |
| 10 | MEDIUM | テストファイルが `__tests__/` 外 | `src/__tests__/App.test.tsx` に移動 |
| 11 | MEDIUM | `eslint-plugin-import` flat config互換性 | 対応不要（YAGNI） |
