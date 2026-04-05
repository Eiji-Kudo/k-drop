# PR #133 チームレビュー懸念点

## 概要

- **PR**: v2: @typescript-eslint/no-unsafe-assignment を error にする
- **URL**: https://github.com/Eiji-Kudo/k-drop/pull/133
- **調査日**: 2026-04-05
- **レビュー方式**: ルール変更影響確認 + CI 実行

## レビュワー構成

| レビュワー | 専門領域 | 選定理由 |
|------------|----------|----------|
| `lint-type-safety-reviewer` | ESLint / 型安全 | `no-unsafe-assignment` 引き上げが既存コードを壊さないか確認するため |
| `tooling-reviewer` | Tooling / CI | `app/v2` の lint, format, build 導線と整合するか確認するため |

## サマリー

| 重要度 | 件数 |
|--------|------|
| CRITICAL | 0 |
| HIGH | 0 |
| MEDIUM | 0 |

## 参照したガイドライン

- `CLAUDE.md`
- `README.md`

## 懸念点一覧

未対応の懸念点はありません。

## メモ

- `@typescript-eslint/no-unsafe-assignment` を `error` に変更しても `app/v2` の lint と typecheck は通過した
- `origin/main` 取り込み後、今回の本質的な差分は ESLint ルール 1 行のみであることを確認した
- `pnpm run ci` を通すため、PR 差分外で残っていた `src/components/home/BentoGrid.tsx` の既存 Biome formatting drift 1 箇所だけを機械整形した
