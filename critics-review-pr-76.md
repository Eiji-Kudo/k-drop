# PR #76 チームレビュー懸念点

## 概要

- **PR**: app/v2: Vite + React + TypeScript プロジェクト初期セットアップ
- **URL**: https://github.com/Eiji-Kudo/k-drop/pull/76
- **調査日**: 2026-04-05
- **レビュー回数**: 2
- **レビュー方式**: 並列レビュー + 相互検証

## レビュワー構成

| レビュワー | 専門領域 | 選定理由 |
|------------|----------|----------|
| `config-consistency-reviewer` | 設定ファイル間の整合性 | 前回修正後の設定の矛盾検出 |
| `ci-test-reviewer` | CI/CDとテスト基盤 | 新規追加のv2-ci.ymlとテスト基盤の検証 |

## サマリー

| 重要度 | 件数 | 対応済み |
|--------|------|----------|
| CRITICAL | 0 | 0 |
| HIGH | 1 | 1 |
| MEDIUM | 2 | 2 |

## 参照したガイドライン

- `CLAUDE.md` (root)
- `app/v2/README.md`

## 未対応の懸念点

なし

---

## 対応不要の懸念点

<details>
<summary>11. eslint-plugin-import v2 のフラットコンフィグ互換性の既知制限（MEDIUM / 対応不要）</summary>

- **ファイル**: `app/v2/eslint.config.js`, `app/v2/package.json`
- **問題**: `eslint-plugin-import` v2 の `flatConfigs` は後付けで、一部ルールがフラットコンフィグ環境で不安定な既知問題がある
- **理由**: 現時点で問題が発生しておらず、YAGNI原則により対応不要。不具合が出た場合に `eslint-plugin-import-x` への移行を検討する

</details>

## 対応済みの懸念点

<details>
<summary>1. v2のCI/CDワークフローが未作成（HIGH / 修正済み）</summary>

- **ファイル**: `.github/workflows/v2-ci.yml`
- **問題**: v1にはCIワークフローがあるがv2には存在せず、品質チェックが自動実行されなかった
- **対応**: `.github/workflows/v2-ci.yml` を作成（pnpm対応）

</details>

<details>
<summary>2. テストで renderToStaticMarkup を使用（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/src/__tests__/App.test.tsx`
- **問題**: サーバーサイドレンダリング用APIで静的HTML文字列マッチしていた
- **対応**: `@testing-library/react` に移行

</details>

<details>
<summary>3. vitest/globals 設定不統一・型汚染（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/vite.config.ts`, `app/v2/tsconfig.app.json`
- **問題**: `globals: true` と明示インポートが混在、本番コードの型汚染リスク
- **対応**: `globals: false` + `types` から除去

</details>

<details>
<summary>4. vite-env.d.ts 不在で @types/ 自動探索無効化（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/src/vite-env.d.ts`, `app/v2/tsconfig.app.json`
- **問題**: `types` フィールドで `@types/` 自動探索が無効化されていた
- **対応**: `vite-env.d.ts` 作成、`types` フィールド削除

</details>

<details>
<summary>5. --ext フラグが flat config で冗長（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/package.json`
- **問題**: flat config では `--ext` は無視され冗長
- **対応**: `--ext` を削除

</details>

<details>
<summary>6. max-len と Biome lineWidth の競合（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/eslint.config.js`
- **問題**: ハードリミットとソフトリミットの競合リスク
- **対応**: `max-len` ルールを削除

</details>

<details>
<summary>7. v1の重要ESLintルール欠落（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/eslint.config.js`
- **問題**: `max-lines`, `consistent-type-assertions`, `no-unused-vars` が欠落
- **対応**: 3ルールを追加

</details>

<details>
<summary>8. .gitignore に .env パターンなし（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/.gitignore`
- **問題**: v2独立時にシークレット漏洩リスク
- **対応**: `.env` / `.env.*` を追加

</details>

<details>
<summary>9. lang="en" のまま（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/index.html`
- **問題**: 日本語ユーザー向けなのに `lang="en"`
- **対応**: `lang="ja"` に変更

</details>

<details>
<summary>10. テストファイルが __tests__/ 外（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/src/__tests__/App.test.tsx`
- **問題**: CLAUDE.mdのガイドラインに従っていなかった
- **対応**: `src/__tests__/App.test.tsx` に移動

</details>

<details>
<summary>12. packageManagerフィールド欠落によりCIでpnpmバージョンが不定（HIGH / 修正済み）</summary>

- **ファイル**: `app/v2/package.json`, `.github/workflows/v2-ci.yml`
- **問題**: `pnpm/action-setup@v4` が `packageManager` フィールドからバージョンを決定するが、未設定のためlatestがインストールされる
- **対応**: `packageManager: "pnpm@10.33.0"` を追加、CI側で `package_json_file: app/v2/package.json` を指定

</details>

<details>
<summary>13. CIでbuildステップが実行されていない（MEDIUM / 修正済み）</summary>

- **ファイル**: `.github/workflows/v2-ci.yml`
- **問題**: Viteのバンドル処理がCIで検証されていなかった
- **対応**: `pnpm run build` ステップを追加

</details>

<details>
<summary>14. GitHub Actions ワークフローに permissions が未設定（MEDIUM / 修正済み）</summary>

- **ファイル**: `.github/workflows/v2-ci.yml`
- **問題**: 最小権限の原則に反し、不必要に広い権限が付与される可能性
- **対応**: `permissions: contents: read` を追加

</details>
