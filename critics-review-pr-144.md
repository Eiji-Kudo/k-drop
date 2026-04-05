# PR #144 チームレビュー懸念点

## 概要

- **PR**: app/v2 フロントエンドを route-centered package-by-feature 構成へ移行する
- **URL**: https://github.com/Eiji-Kudo/k-drop/pull/144
- **調査日**: 2026-04-05
- **レビュー方式**: 並列レビュー + 相互検証

## レビュワー構成

| レビュワー | 専門領域 | 選定理由 |
|------------|----------|----------|
| `router-reviewer` | TanStack Router / navigation | route group 導入と route id 変化の影響確認 |
| `architecture-reviewer` | 配置方針 / 依存境界 | feature-local code の移設が shared 責務を壊していないか確認 |
| `docs-reviewer` | docs / verification | architecture 文書と実装結果の不整合確認 |

## サマリー

| 重要度 | 件数 | 対応済み |
|--------|------|----------|
| CRITICAL | 0 | 0 |
| HIGH | 2 | 2 |
| MEDIUM | 3 | 3 |

## 参照したガイドライン

- `CLAUDE.md`
- `README.md`
- `app/v2/README.md`

## 未対応の懸念点

なし

## 対応済みの懸念点

<details>
<summary>1. `src/architecture.md` の Current State / migration example が移行前の説明のまま残っていた（MEDIUM / 修正済み）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **MEDIUM** |
| ファイル | `app/v2/src/architecture.md` |
| 検出者 | `docs-reviewer` |

**問題点**:
`Current State` が `src/components` に feature-local UI が集まっている前提のままで、`Recommended Migration` も未適用の future tense になっていた。今回の PR 自体がその移行を完了させているため、文書を参照した開発者が「まだ移行前」と誤読する状態だった。

**該当コード**:
```md
## Current State

現状の `src/` は次のような分割になっている。
...
├── components/     -> 画面単位 UI がここに集まっている
...
## Recommended Migration
```

**対応**:
`Current State` を移行後の構造に更新し、`Recommended Migration` を `Migration Example` に変更した。`現在/推奨` も `移行前/適用後` に置き換え、実装済みの内容を historical example として読めるようにした。

</details>

<details>
<summary>2. `quiz` feature 内でグループ一覧の mock source が二重化していた（HIGH / 修正済み）</summary>

- **ファイル**: `app/v2/src/features/quiz/constants.ts`, `app/v2/src/features/quiz/mock/idol-groups.ts`, `app/v2/src/features/quiz/components/QuizCreateFields.tsx`
- **問題**: グループ一覧が `MOCK_IDOL_GROUPS` と `MOCK_QUIZ_GROUPS` に分かれ、ID 体系と命名規約も不一致だったため、create と solve で master data が drift する状態だった。
- **対応**: `MOCK_QUIZ_GROUPS` を単一ソースに寄せ、create form 側も同じデータを参照するように変更した。`constants.ts` には定数だけを残した。

</details>

<details>
<summary>3. route wrapper の smoke test が不足し、Testing 欄も route 回帰の実態を十分に表していなかった（HIGH / 修正済み）</summary>

- **ファイル**: `app/v2/src/__tests__/App.test.tsx`, `PR #144 description`
- **問題**: `/profile` `/quiz/create` `/quiz/question` の接続が直接検証されておらず、PR description の Testing 欄も focused test だけで route 再編の確認範囲を誤読させる状態だった。
- **対応**: `App.test.tsx` に route smoke test を追加し、`/profile` `/quiz/create` `/quiz/question` を明示的に確認するようにした。PR description の Testing 欄も実際に回した route smoke を含む内容へ更新した。

</details>

<details>
<summary>4. `BottomTabBar` が route 固有知識を持ち、`/quiz/question` と `$sessionId` で挙動が分かれていた（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/src/routes/__root.tsx`, `app/v2/src/components/bottom-tab-bar.tsx`
- **問題**: shared UI の `BottomTabBar` が `routeId` 判定を抱えた結果、同じ question screen を返す `/quiz/question` では tab bar が表示されたままになっていた。
- **対応**: tab bar の表示可否を route layer の `__root.tsx` 側へ移し、`BottomTabBar` は純粋な shared UI に戻した。`/quiz/question` でも tab bar を隠すよう統一した。

</details>

<details>
<summary>5. `src/features` 方針に対して周辺ガイドが古い配置ルールのままだった（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/docs/project-structure.md`, `app/v2/docs/component-placement-guide.md`
- **問題**: `src/architecture.md` では `src/features/<feature>` を frontend 実装本体の置き場とした一方、周辺ガイドは `src/components` / `src/routes` 前提の説明を残していた。
- **対応**: 両ドキュメントを更新し、`src/routes` は routing 関心、`src/features` は feature 実装、`src/components` は shared UI という分担を明文化した。

</details>
