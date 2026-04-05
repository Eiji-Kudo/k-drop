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
| MEDIUM | 8 | 8 |

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
<summary>8. UX ブラッシュアップ計画が旧ディレクトリ構成を編集対象として案内していた（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/docs/ux/ui-design-brushup-plan.md`
- **問題**: `src/routes/quiz/index.tsx` や `src/components/home/*` など、移行前の file path が実務ドキュメントに残っており、次の UI 改修で削除済みパスを辿る誤読を招く状態だった。
- **対応**: group selection の作業対象を `src/features/quiz/pages/group-selection-page.tsx` に修正し、主要な編集対象ファイル一覧も `src/routes/(tabs)` と `src/features/*` ベースの現構成へ更新した。

</details>

<details>
<summary>9. `quiz-create-page` が app-level の home route を直接参照していた（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/src/features/quiz/pages/quiz-create-page.tsx`, `app/v2/src/routes/(tabs)/quiz/create.tsx`
- **問題**: `QuizCreatePage` が `navigate({ to: "/" })` を直接持ち、feature 実装が app-level route 契約を知っている状態だった。
- **対応**: submit 完了後の app-level 遷移は route file 側へ戻し、`QuizCreatePage` には `onCreated` callback だけを渡す形に変更した。feature 側は作成完了通知に留め、home route 依存を外した。

</details>

<details>
<summary>10. `quiz/create` の callback 契約が弱く、submit 後遷移の回帰を検知できなかった（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/src/features/quiz/pages/quiz-create-page.tsx`, `app/v2/src/__tests__/App.test.tsx`
- **問題**: `QuizCreatePage` の `onCreated` が optional だったため、route file 側で callback を渡し忘れても型で検知できず、`/quiz/create` の smoke test も submit 完了後の遷移までは固定できていなかった。
- **対応**: `onCreated` を必須 prop に変更し、`App.test.tsx` にクイズ作成完了後に home route へ戻ることを確認する route test を追加した。

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

<details>
<summary>6. feature page 内の local navigation 許容範囲がドキュメント上で曖昧だった（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/src/architecture.md`, `app/v2/docs/project-structure.md`
- **問題**: `quiz` page が `Link` / `useNavigate` を持つ実装に対し、ドキュメントが「routing 関心は routes に集中」とだけ読める状態で、許容境界が曖昧だった。
- **対応**: route path / loader / guard の定義元は `src/routes` としつつ、feature page が local navigation のために router hook を使うこと自体は許容する、と明文化した。

</details>

<details>
<summary>7. tab shell を route 構造で表現しきれていない点は将来の pathless layout 化で検討する（MEDIUM / 対応不要）</summary>

- **ファイル**: `app/v2/src/routes/__root.tsx`
- **問題**: tab bar の表示制御は root layout の denylist で管理しており、将来 full-screen route が増えた場合は明示追加が必要になる。
- **対応**: 現時点では既知の full-screen route が `quiz/$sessionId` と `quiz/question` に限られ、実害は解消済みのためこの PR では対応不要とした。tab shell を route tree で表現する pathless layout 化は別リファクタで扱う。

</details>
