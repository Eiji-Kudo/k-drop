# PR #126 チームレビュー懸念点

## 概要

- **PR**: test: @praha/drizzle-factory を導入し ER テストのヘルパーを置き換える
- **URL**: https://github.com/Eiji-Kudo/k-drop/pull/126
- **調査日**: 2026-04-05
- **レビュー回数**: 1
- **レビュー方式**: 並列レビュー + 修正後の再確認

## レビュワー構成

| レビュワー | 専門領域 | 選定理由 |
|------------|----------|----------|
| `data-integrity-reviewer` | DB 制約・fixture 整合性 | helper 置換が ER 制約テストの意味を壊していないか確認が必要 |
| `test-strategy-reviewer` | テスト戦略・ドキュメント整合性 | helper 運用方針と README、lint 方針のズレを確認する必要がある |
| `tooling-reviewer` | lint / dependency / test infra | eslint override と dependency 追加の repo-wide impact を確認する必要がある |
| `follow-up-verifier` | 修正反映確認 | 初回指摘の解消と新規懸念の有無を確認する必要がある |

## サマリー

| 重要度 | 件数 | 対応済み |
|--------|------|----------|
| CRITICAL | 0 | 0 |
| HIGH | 0 | 0 |
| MEDIUM | 3 | 3 |

## 参照したガイドライン

- `CLAUDE.md` (root)
- `app/v2/README.md`
- `app/v2/eslint.config.js`

## 未対応の懸念点

(なし)

## 対応済みの懸念点

<details>
<summary>1. `__tests__` 配下全体に `max-lines` 解除が広がっていた（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/eslint.config.js`
- **問題**: `**/__tests__/**/*.{ts,tsx}` を test override に追加したことで、今回対象外の UI/API テスト helper まで strict lint の一部と `max-lines` 監視から外れていた
- **対応**: `.test.ts(x)` 用 override と `functions/db/__tests__/**/*.{ts,tsx}` 用 `max-lines` override を分離し、今回の ER テスト群にだけ適用する形へ修正

</details>

<details>
<summary>2. README の helper/raw SQL 方針が実装と食い違っていた（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/README.md`
- **問題**: 「intentional constraint-violation は raw SQL」とだけ書くと、helper が明示的に invalid case を通せる実装方針と矛盾していた
- **対応**: valid setup は helper を使い、helper default を迂回したい低レベル制約チェックでは raw SQL を使う、という実際の運用に合わせて説明を修正

</details>

<details>
<summary>3. group scope helper が明示 `null` を既定値で潰していた（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/functions/db/__tests__/test-helper/score-state-inserts.ts`, `app/v2/functions/db/__tests__/test-helper/leaderboard-inserts.ts`
- **問題**: `group` 系 helper が `values.idolGroupId ?? "group-1"` のように補正しており、将来 helper 経由で `group + idol_group_id = NULL` の制約違反を検証すると valid fixture にすり替わる余地があった
- **対応**: 未指定時のみ default を入れ、明示指定された `null` は保持するよう `"idolGroupId" in values ? ... : ...` へ修正。`scoreTierId` も同様に property existence ベースで扱うよう修正

</details>

## 最終確認

- `follow-up-verifier` で再確認し、**no findings**
- 実行確認:
  - `pnpm exec eslint . --quiet`
  - `pnpm run test:types`
  - `pnpm run format:check`
  - `pnpm exec vitest run functions/db/__tests__ src/__tests__/api.test.ts`
  - `pnpm run build`
