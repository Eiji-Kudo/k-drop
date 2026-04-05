# PR #147 チームレビュー懸念点

## 概要

- **PR**: app/v2 の Node.js 要件を Vite 8 に合わせて明示する
- **URL**: https://github.com/Eiji-Kudo/k-drop/pull/147
- **調査日**: 2026-04-05
- **レビュー回数**: 1回目
- **レビュー方式**: critics-lite / 修正反映済み

## レビュワー構成

- `tooling-reviewer`
  - `package.json` の script 再帰、Corepack 経由の実行経路、Node 24 固定の整合性を確認
- `docs-reviewer`
  - `.nvmrc` / README / package.json の案内が contributors の実行手順と矛盾しないか確認

## サマリー

| 重要度 | 件数 | 対応済み |
|--------|------|----------|
| CRITICAL | 0 | 0 |
| HIGH | 0 | 0 |
| MEDIUM | 1 | 1 |

## 参照したガイドライン

- `CLAUDE.md`
- `README.md`
- `app/v2/README.md`

## 未対応の懸念点

- なし

## 対応済みの懸念点

### 1. MEDIUM: Node major を切り替えた既存 `node_modules` で `better-sqlite3` の ABI mismatch が発生する

- **対象**: `app/v2/package.json`, `app/v2/README.md`, `app/v2/scripts/check-better-sqlite3-runtime.mjs`
- **問題点**:
  - Node 20 で生成済みの `node_modules` を残したまま Node 24 に切り替えると、`better-sqlite3` が古い ABI のまま残り、`pnpm run test` / `pnpm run ci` が `NODE_MODULE_VERSION` mismatch で失敗した
  - `corepack pnpm install` だけでは既存バイナリが自動で再生成されず、README の切り替え手順だけでは contributors が詰まる状態だった
- **対応**:
  - `rebuild:native` script を追加し、Node major 切り替え後の標準復旧コマンドを用意
  - `pretest` / `pretest:watch` に `check-better-sqlite3-runtime.mjs` を追加し、ABI mismatch 時に再ビルド手順を明示して早期失敗するよう変更
  - `app/v2/README.md` に `node_modules` を持ち越した場合の `corepack pnpm run rebuild:native` 手順を追記

## 最終確認

- 未対応の懸念点: 0件
- 対応済みの懸念点: 1件
- 新規発見: なし
