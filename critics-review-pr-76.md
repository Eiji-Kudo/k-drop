# PR #76 対応済みの懸念点

> 未対応の懸念点なし（全件対応済み）

## 再発防止すべき知見

### 1. tsconfig の `types` フィールドは `@types/` 自動探索を無効化する

- `"types": ["vite/client"]` のように明示指定すると、`node_modules/@types/` の自動認識が止まる（silent failure）
- `vitest/globals` を `types` に含めると本番コードでテスト用APIが型エラーなく参照可能になる
- Vite公式が `vite-env.d.ts` を使う理由はこの副作用を避けるため

### 2. フォーマッタのソフトリミットとリンターのハードリミットは競合する

- Biome `lineWidth` はベストエフォート（分割不可能トークンでは超過する）
- ESLint `max-len` はハードリミット（超過は常にエラー）
- 同じ値でもフォーマット後にリントエラーが発生しうる。行長管理はフォーマッタに一任すべき

### 3. 既存プロジェクトの設定を移植する際はルール差分を確認する

- v1→v2移植で `max-lines`, `consistent-type-assertions`, `no-unused-vars` が欠落していた
- 「v1ベースの設定」と謳うなら差分チェックリストを作るべき

### 4. pnpm/action-setup@v4 は packageManager フィールド必須

- `packageManager` 未設定だと pnpm の latest がインストールされ、lockfile互換性が壊れうる
- モノレポでは `package_json_file` パラメータでサブディレクトリの package.json を明示指定する必要がある

### 5. ESLint flat config は --ext フラグを無視する

- flat config では `files` パターンがファイル対象を制御し、CLI の `--ext` は効果がない（silent ignore）
- 将来のESLintバージョンでフラグ自体が削除された場合にスクリプトが壊れる

## 修正サマリ

| # | 重要度 | 内容 | 修正 |
|---|--------|------|------|
| 1 | HIGH | v2のCI/CDワークフロー未作成 | `v2-ci.yml` 作成（後に削除） |
| 2 | MEDIUM | テストで `renderToStaticMarkup` 使用 | `@testing-library/react` に移行 |
| 3 | MEDIUM | `vitest/globals` 設定不統一・型汚染 | `globals` 削除、`types` から除去 |
| 4 | MEDIUM | `vite-env.d.ts` 不在 | `vite-env.d.ts` 作成、`types` フィールド削除 |
| 5 | MEDIUM | `--ext` フラグが flat config で冗長 | `--ext` を削除 |
| 6 | MEDIUM | `max-len` と Biome `lineWidth` の競合 | `max-len` ルールを削除 |
| 7 | MEDIUM | v1の重要ESLintルール欠落 | `max-lines`, `consistent-type-assertions`, `no-unused-vars` 追加 |
| 8 | MEDIUM | `.gitignore` に `.env` パターンなし | `.env` / `.env.*` 追加 |
| 9 | MEDIUM | `lang="en"` のまま | `lang="ja"` に変更 |
| 10 | MEDIUM | テストファイルが `__tests__/` 外 | `src/__tests__/App.test.tsx` に移動 |
| 11 | - | `eslint-plugin-import` flat config互換性 | 対応不要（YAGNI） |
| 12 | HIGH | `packageManager` フィールド欠落 | `pnpm@10.33.0` 追加、`package_json_file` 指定 |
| 13 | MEDIUM | CIで `build` 未実行 | `pnpm run build` ステップ追加 |
| 14 | MEDIUM | GitHub Actions `permissions` 未設定 | `contents: read` 追加 |
| 15 | HIGH | README.md が `npm run` と記載 | `pnpm run` に変更 |
| 16 | HIGH | CLAUDE.md に v2 セクションなし | v2セクション追加 |
| 17 | MEDIUM | `check:all` に build 未含 | `&& pnpm run build` 追加 |
| 18 | MEDIUM | `@types/node` v24 vs CI Node.js 20 | `@types/node` を `^22`、CI を `node-version: 22` に |
