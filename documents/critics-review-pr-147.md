# PR #147 チームレビュー懸念点

## 概要

- **PR**: app/v2 の Node.js 要件を Vite 8 に合わせて明示する
- **URL**: https://github.com/Eiji-Kudo/k-drop/pull/147
- **調査日**: 2026-04-05
- **レビュー回数**: 2回目
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
| HIGH | 2 | 2 |
| MEDIUM | 2 | 2 |

## 参照したガイドライン

- `CLAUDE.md`
- `README.md`
- `app/v2/README.md`

## 未対応の懸念点

- なし

## 対応済みの懸念点

### 1. HIGH: package script 内の `corepack pnpm` 再帰が選択済み Node 24 ツールチェーンを外してしまう

- **対象**: `app/v2/package.json`, `app/v2/README.md`
- **問題点**:
  - outer shell では `node -v` が `v24.14.1` でも、script 内で `corepack pnpm ...` を再帰呼び出しすると別の Node / pnpm を拾う環境があり、`check:all` / `ci` / `dev:full` / `rebuild:native` が誤った runtime で動く状態だった
  - README も steady-state の実行経路として `corepack pnpm ...` を案内しており、mixed-manager 環境では issue の再現条件を自ら作っていた
- **対応**:
  - `corepack` は pnpm の provisioning 手順に限定し、日常の実行コマンドは `pnpm ...` に整理
  - script の再帰実行は `run-package-manager.mjs` 経由で現在の package manager binary を再利用する形に変更し、外側で確定した toolchain を維持するように修正

### 2. HIGH: README に pnpm shim の健全性確認と shadowing 時の復旧手順が足りない

- **対象**: `app/v2/README.md`, `app/v2/scripts/check-better-sqlite3-runtime.mjs`
- **問題点**:
  - `corepack enable` だけでは `pnpm` が Node 24 の shim を向かない環境があり、`pnpm exec node -v` が古い runtime のままでも contributors が先に進んでしまう
  - README の期待値表現も `v24.14.1` 固定で、許容範囲である `24.14.2+` を不正に見せる余地があった
- **対応**:
  - `corepack prepare pnpm@10.33.0 --activate` と `pnpm exec node -v` の確認手順を追加
  - 期待値を「`v24.14.1` 以上の 24.x」に修正し、`command -v pnpm` で shadowing を診断する案内を README と runtime error message の両方に追記

### 3. MEDIUM: Node major を切り替えた既存 `node_modules` で `better-sqlite3` の ABI mismatch が発生する

- **対象**: `app/v2/package.json`, `app/v2/README.md`, `app/v2/scripts/check-better-sqlite3-runtime.mjs`
- **問題点**:
  - Node 20 で生成済みの `node_modules` を残したまま Node 24 に切り替えると、`better-sqlite3` が古い ABI のまま残り、`pnpm run test` / `pnpm run ci` が `NODE_MODULE_VERSION` mismatch で失敗した
  - install だけでは既存バイナリが自動で再生成されず、切り替え手順だけでは contributors が詰まる状態だった
- **対応**:
  - `rebuild:native` script を追加し、Node major 切り替え後の標準復旧コマンドを用意
  - `pretest` / `pretest:watch` に `check-better-sqlite3-runtime.mjs` を追加し、ABI mismatch 時に再ビルド手順を明示して早期失敗するよう変更
  - `app/v2/README.md` に `node_modules` を持ち越した場合の `pnpm run rebuild:native` 手順を追記

### 4. MEDIUM: `$npm_execpath` を shell 展開する再帰実装は POSIX 依存で Windows 互換性がない

- **対象**: `app/v2/package.json`, `app/v2/scripts/run-package-manager.mjs`
- **問題点**:
  - `node "$npm_execpath"` のような shell 展開は POSIX shell 依存であり、Windows shell では literal として扱われて script が壊れる懸念があった
- **対応**:
  - `run-package-manager.mjs` を追加し、`process.env.npm_execpath` を Node 側で解決して `spawn` するよう変更
  - `check:all` / `ci` / `rebuild:native` / `dev:full` の再帰実行をすべて同ラッパー経由へ統一

## 最終確認

- 未対応の懸念点: 0件
- 対応済みの懸念点: 4件
- 新規発見: なし
