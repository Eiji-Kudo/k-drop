# PR #144 チームレビュー懸念点

## 概要

- **PR**: app/v2 フロントエンドを route-centered package-by-feature 構成へ移行する
- **URL**: https://github.com/Eiji-Kudo/k-drop/pull/144
- **調査日**: 2026-04-05（初回）/ 2026-04-19（再レビュー）
- **レビュー方式**: 並列レビュー + 相互検証

## レビュワー構成

| レビュワー | 専門領域 | 選定理由 |
|------------|----------|----------|
| `router-reviewer` | TanStack Router / navigation | route group 導入と route id 変化の影響確認 |
| `architecture-reviewer` | 配置方針 / 依存境界 | feature-local code の移設が shared 責務を壊していないか確認 |
| `docs-reviewer` | docs / verification | architecture 文書と実装結果の不整合確認 |
| `testing-reviewer` | テスト戦略 / 回帰検知 | 追加 route smoke test と schema テストが回帰を固定できるか確認 |
| `frontend-quality-reviewer` | React / TypeScript / UX | 移動した feature コンポーネントの型・依存・UX 面の回帰確認 |

## サマリー

| 重要度 | 件数 | 対応済み |
|--------|------|----------|
| CRITICAL | 0 | 0 |
| HIGH | 5 | 5 |
| MEDIUM | 41 | 41 |
| LOW | 4 | 0（対応不要） |
| LOW-MEDIUM | 1 | 1 |

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

## 2 回目レビュー（2026-04-19）で追加された対応

<details>
<summary>11. `HIDDEN_BOTTOM_TAB_ROUTE_IDS` の route id 文字列が型で保護されていなかった（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/src/routes/__root.tsx`
- **検出者**: `router-reviewer`, `frontend-quality-reviewer`
- **問題**: denylist の文字列が `routeTree.gen.ts` の `FileRoutesById` と型で連動しておらず、route group のリネーム/typo を TypeScript / ESLint が拾えない状態だった。
- **対応**: `as const satisfies ReadonlyArray<keyof FileRoutesById>` を使って文字列配列をコンパイル時に検証し、そこから `ReadonlySet<string>` を派生させた。route id が変わると型エラーで即検知できる。

</details>

<details>
<summary>12. `QuizGroup.thumbnailUrl` が必須型なのに描画側で使われていなかった（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/src/features/quiz/types.ts`, `app/v2/src/features/quiz/mock/idol-groups.ts`
- **検出者**: `frontend-quality-reviewer`
- **問題**: `GroupButton` で thumbnail を描画しておらず、mock 全件で `thumbnailUrl: ""` を機械的に埋めるだけの dead field になっていた。
- **対応**: `thumbnailUrl` を optional (`thumbnailUrl?: string`) に変更し、mock から空文字フィールドを除去した。将来 thumbnail を実装する際に「未定義か文字列か」で状態を表現できる。

</details>

<details>
<summary>13. `features/profile/mock-data.ts` が `@/mocks/profile` の薄い re-export wrapper のまま残っていた（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/src/features/profile/mock-data.ts` → 削除、`profile-page.tsx` を直接参照に変更
- **検出者**: `architecture-reviewer`
- **問題**: app-wide mock (`@/mocks/profile`) を 1 行 re-export するだけのファイルが残り、`lib/ux/mock-state.ts` は `@/mocks/profile` を直接 import しているのに profile-page だけ indirection を経由していた。
- **対応**: `features/profile/mock-data.ts` を削除し、`profile-page.tsx` の import を `@/mocks/profile` 直参照に変更した。feature-local mock と app-wide mock の境界を明確にした。

</details>

<details>
<summary>14. `features/profile/badge-colors.ts` が pure util なのに feature root に置かれていた（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/src/features/profile/badge-colors.ts` → `app/v2/src/features/profile/utils/badge-colors.ts`
- **検出者**: `architecture-reviewer`
- **問題**: 同じ feature 内で `format-fan-duration.ts` は `utils/` 配下だが、`badge-colors.ts` が feature root に裸で置かれており、pure util の配置ルールが feature 内で割れていた。
- **対応**: `features/profile/utils/badge-colors.ts` へ移動し、`ProfileBadges.tsx` の import path も更新した。

</details>

<details>
<summary>15. `quiz-create-schema.test.ts` がテスト colocate 規約から外れて `src/__tests__/` に残っていた（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/src/__tests__/quiz-create-schema.test.ts` → `app/v2/src/features/quiz/schemas/__tests__/quiz-create-schema.test.ts`
- **検出者**: `architecture-reviewer`
- **問題**: 同じ PR 内で `format-fan-duration.test.ts` が feature 配下に colocate されている一方、schema テストだけ central `__tests__/` に残り、方針が PR 内で割れていた。
- **対応**: `features/quiz/schemas/__tests__/` に移動。route smoke test (`App.test.tsx`) だけが central `__tests__/` に残るルールで統一した。

</details>

<details>
<summary>16. quiz create route の tabs wrapper smoke test が不足していた（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/src/__tests__/App.test.tsx`
- **検出者**: `testing-reviewer`
- **問題**: テスト名は "through the tabs wrapper" と謳っていたが、アサーションが heading と button の確認のみで、tab bar (navigation landmark) の存在を固定していなかった。
- **対応**: `profile` route のテストと同じく `screen.getByRole("navigation", { name: "メインナビゲーション" })` を追加して wrapper 経由を固定した。

</details>

<details>
<summary>17. 作成完了→home 遷移テストが hero title の文字列比較だけで遷移自体を検証していなかった（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/src/__tests__/App.test.tsx`
- **検出者**: `testing-reviewer`
- **問題**: `"今日もオタ力を伸ばそう"` の findByText のみで遷移完了を判定しており、hero コピー変更で false positive/negative が発生しうる状態だった。また作成完了通知 (`alert`) が呼ばれたかも検証されていなかった。
- **対応**: `renderRoute` から router を返すようにし、`waitFor(() => expect(router.state.location.pathname).toBe("/"))` でパスを直接検証する形に変更。`alertMock` を参照可能にし `toHaveBeenCalledWith("クイズを作成しました！")` も追加した。

</details>

<details>
<summary>18. `vi.useRealTimers()` がデッドコードとして残っていた（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/src/__tests__/App.test.tsx`
- **検出者**: `testing-reviewer`
- **問題**: `afterEach` で `vi.useRealTimers()` を呼んでいたが、対応する `useFakeTimers` が存在せず、読み手が「どこかで fake timer が使われている」と誤読する要因になっていた。
- **対応**: 不要な `vi.useRealTimers()` 呼び出しを削除した。

</details>

<details>
<summary>19. `/quiz/question` の direct route テストが `(tabs)` 配下に所属することを固定していなかった（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/src/__tests__/App.test.tsx`
- **検出者**: `testing-reviewer`
- **問題**: tab bar 非表示のみを確認しており、route が `(tabs)` wrapper 配下にあるかは検証されていなかった。route group から外して routeId が `/quiz/question` になっても、テストは通過してしまう状態だった。
- **対応**: `router.state.matches.map((m) => m.routeId)` が `/(tabs)/quiz/question` を含むことを検証する expect を追加した。

</details>

<details>
<summary>20. quiz-create-schema の tuple 上限・下端・undefined の境界テストが不足していた（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/src/features/quiz/schemas/__tests__/quiz-create-schema.test.ts`
- **検出者**: `testing-reviewer`
- **問題**: `z.tuple([...])` で上限 4 を要求しているのに 5 個以上のテストがなく、`correctChoiceIndex` の下端 `0` と form 初期値 `undefined` のケースも検証されていなかった。
- **対応**: 以下の 3 件を追加:
  - `rejects more than 4 choices`（`choices: [A, B, C, D, E]` で reject）
  - `accepts min boundary correctChoiceIndex`（`correctChoiceIndex: 0` で accept）
  - `rejects undefined correctChoiceIndex`（form 初期値での未選択を reject）

</details>

<details>
<summary>21. `src/architecture.md` が削除済みの `src/constants/` を shared 上げ候補として参照し続けていた（HIGH / 修正済み）</summary>

- **ファイル**: `app/v2/src/architecture.md`
- **検出者**: `docs-reviewer`, `architecture-reviewer`, `frontend-quality-reviewer`
- **問題**: 本 PR で `src/constants/quiz.ts` を削除し `src/constants/` ディレクトリを廃止したにもかかわらず、Shared Principle と Placement Rules に `src/constants` が残っており、新規 contributor が空ディレクトリを作る誤読を招く状態だった。
- **対応**: `src/architecture.md` 57 行目と 126 行目から `src/constants` の言及を除去し、`src/components` / `src/lib` のみに統一した。

</details>

<details>
<summary>22. `docs/project-structure.md` のディレクトリ図が実態と乖離していた（HIGH / 修正済み）</summary>

- **ファイル**: `app/v2/docs/project-structure.md`
- **検出者**: `docs-reviewer`, `frontend-quality-reviewer`
- **問題**: ディレクトリ図に存在しない `components/layout/` と `components/<entity>-detail/` が残り、実在する `components/ui/` が列挙されていなかった。`component-placement-guide.md` の「feature 固有は `features/<feature>/components/`」方針とも矛盾していた。
- **対応**: 図を実態に合わせて `components/ui/` に置き換え、`mocks/` も追記した。

</details>

<details>
<summary>23. `docs/component-placement-guide.md` が `components/layout/` を shared 配置例として残していた（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/docs/component-placement-guide.md`
- **検出者**: `docs-reviewer`
- **問題**: 同 PR 内で周辺 4 行は feature 方針に合わせて更新されていたが、直後の 189 行目だけ旧記述 `components/layout/` が残り、矛盾していた。
- **対応**: 「共通プリミティブ（`PageShell` / `PageHeader` / CTA 等）は `src/components/ui/` に配置する」へ書き換えた。

</details>

<details>
<summary>24. `src/architecture.md` `src/components/` 責務の代表例が実態と乖離していた（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/src/architecture.md`
- **検出者**: `docs-reviewer`
- **問題**: 代表例として `bottom-tab-bar.tsx` のみ記載され、実際に広く参照されている `components/ui/*` プリミティブ群が抜けていた。
- **対応**: `ui/PageShell.tsx` / `ui/PageHeader.tsx` / `ui/cta.tsx` / `ui/PillTab.tsx` / `ui/SectionCard.tsx` / `ui/EmptyState.tsx` を代表例に追記した。

</details>

<details>
<summary>25. `quiz` だけ `pages/` サブディレクトリを持つ構造の基準が説明されていなかった（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/src/architecture.md`
- **検出者**: `docs-reviewer`
- **問題**: `home` / `profile` / `ranking` は `<feature>-page.tsx` を feature 直下に置き、`quiz` だけ `pages/` サブディレクトリを使う非対称構造だが、どちらを選ぶ基準が明文化されていなかった。
- **対応**: Feature page セクションに「page が 1 つの feature は `<feature>-page.tsx` を直下に、複数 page を持つ feature は `pages/` サブディレクトリに」と基準を追記した。

</details>

<details>
<summary>26. ルート `CLAUDE.md` の v2 Directory Structure から `features/` が抜けていた（MEDIUM / 修正済み）</summary>

- **ファイル**: `CLAUDE.md`
- **検出者**: `docs-reviewer`
- **問題**: v2 の主要方針は `src/features` を実装本体の置き場にすることだが、プロジェクト全体の指示書である `CLAUDE.md` に `features/` が載っておらず、Claude Code が最初に参照する tree が旧構成のままだった。
- **対応**: v2 セクションの Directory Structure に `routes/` と `features/` の説明を追加し、`components/` の責務も現行方針に揃えた。

</details>

<details>
<summary>27. `docs/architecture.md` と `src/architecture.md` の方針名表記がずれていた（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/docs/architecture.md`
- **検出者**: `docs-reviewer`
- **問題**: `src/architecture.md` Scope で "route-centered package-by-feature" を明示している一方、`docs/architecture.md` の `src/` 節は方針名を書かず記述だけで説明しており、2 ドキュメントが同じ方針を指していることが即座には読み取れなかった。
- **対応**: `docs/architecture.md` の該当文に "（route-centered package-by-feature）" を追記し、方針名を揃えた。

</details>

<details>
<summary>28. `src/architecture.md` "Goal" の avoid リストが `home` を含まず、一般原則化されていなかった（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/src/architecture.md`
- **検出者**: `docs-reviewer`
- **問題**: 避けたい状態として `src/components/profile/*` `src/components/ranking/*` `src/components/quiz/*` のみ列挙し、本 PR で追加された `home` feature が含まれていなかった。
- **対応**: 「feature 固有の UI / schema / mock / formatter を `src/components/<feature>/` に集約すること」と一般原則化し、代表例として `profile` / `ranking` / `quiz` / `home` の 4 つを列挙する形に変更した。

</details>

## 対応不要の懸念点（2 回目レビュー）

<details>
<summary>29. `Choice` 型の snake_case と camelCase の混在（MEDIUM / 対応不要）</summary>

- **ファイル**: `app/v2/src/features/quiz/types.ts`
- **検出者**: `frontend-quality-reviewer`
- **問題**: `Choice` が `choice_order` / `choice_text` / `is_correct` の snake_case、`QuizGroup` / `QuizResultEntry` が camelCase という二重規約になっている。
- **対応不要の理由**: 本 PR は型を移動したのみで命名規約を変更していない。API レスポンス形状（snake_case）との整合可否は別途 backend schema と合わせて再設計するべき範囲で、PR scope 外の既存問題。

</details>

<details>
<summary>30. `QuizCreatePage` の `alert()` によるブロッキング通知（MEDIUM / 対応不要）</summary>

- **ファイル**: `app/v2/src/features/quiz/pages/quiz-create-page.tsx`
- **検出者**: `frontend-quality-reviewer`
- **問題**: 作成成功通知に `alert("クイズを作成しました！")` を使っている。
- **対応不要の理由**: PR scope 外の既存実装。UX ブラッシュアップ計画 (`docs/ux/ui-design-brushup-plan.md`) の toast / inline 通知移行タスクで扱うため、本 PR では alert 呼び出しをテストでも `toHaveBeenCalledWith` 固定して将来の差し替え時に検知できる形にとどめる。

</details>

<details>
<summary>31. idol group mock が `src/mocks/groups.ts` と `features/quiz/mock/idol-groups.ts` に二重化（HIGH / 対応不要）</summary>

- **ファイル**: `app/v2/src/mocks/groups.ts`, `app/v2/src/features/quiz/mock/idol-groups.ts`
- **検出者**: `architecture-reviewer`
- **問題**: app-wide mock (`idolGroups`, 8 件, ULID `01JQXV0001GRPA...`) と quiz feature 専用 (`MOCK_QUIZ_GROUPS`, 10 件, ULID `01J000000000...`) で ID 体系もラインナップもずれている。
- **対応不要の理由**: `MOCK_QUIZ_GROUPS` には `app-wide` に存在しない TWICE / BTS が含まれ、UI 上の表示データが変わるため単純統合できない。adapter 設計と UX 判断が必要で、route-centered 構造移行の scope を超える。別 issue で「quiz mock を app-wide mock に統合」の設計・実施を扱う。

</details>

<details>
<summary>32. mock fetch の 404 stub が将来 loader エラーパスのテストで false positive を生みうる（LOW-MEDIUM / 対応不要）</summary>

- **ファイル**: `app/v2/src/__tests__/App.test.tsx`
- **検出者**: `testing-reviewer`
- **問題**: 現在のテストは fetch を 404 にグローバル stub しているため、将来 loader/queries が追加された時に呼び出しをサイレントに握り潰して最低限描画される可能性がある。
- **対応不要の理由**: 現時点で `features/*` / `routes/(tabs)/*` のいずれも fetch を呼んでおらず、false positive が発生する状況にない。YAGNI の範囲で本 PR では対応しない。ローダー追加時に該当 test で個別 stub を上書きする方針。

</details>

## 3 回目レビュー（2026-04-19 再実行）で追加された対応

<details>
<summary>33. `src/architecture.md` Target Structure の `profile/` が 2 回目対応（#13, #14）に追従していなかった（HIGH / 修正済み）</summary>

- **ファイル**: `app/v2/src/architecture.md` (88-94 行目)
- **検出者**: `docs-reviewer`, `architecture-reviewer`
- **問題**: 2 回目で `features/profile/mock-data.ts` を削除し、`features/profile/badge-colors.ts` を `features/profile/utils/` に移したのに、Target Structure 図は両ファイルが feature 直下にある旧構造のまま残っていた。
- **対応**: `profile/` ブロックを `profile-page.tsx` / `components/` / `utils/ (badge-colors.ts, format-fan-duration.ts)` / `types.ts` の実態構造に更新した。

</details>

<details>
<summary>34. `src/architecture.md` の mock 配置ルールが `ranking` 実態（`feature` 直下平置き）と矛盾していた（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/src/architecture.md` (267, 321-324, 373 行目)
- **検出者**: `docs-reviewer`, `architecture-reviewer`
- **問題**: `Concrete Rules` と `Operational Rules` が「feature-local mock は `src/features/<feature>/mock/` に置く」と明言する一方、`ranking` は `mock-data.ts` / `mock-group-rankings-1.ts` / `mock-group-rankings-2.ts` を feature 直下に置いており、docs と実装で矛盾していた。
- **対応**: ruleを「ファイル数が多い feature は `mock/` にまとめ、少ない場合は feature 直下の `mock-*.ts` も許容する」と柔軟化し、`quiz` / `ranking` それぞれの現状例を明記した。

</details>

<details>
<summary>35. `features/` 配下のテスト colocate 方式が `__tests__/` 方針と sibling 方針で割れていた（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/src/features/profile/utils/format-fan-duration.test.ts` → `app/v2/src/features/profile/utils/__tests__/format-fan-duration.test.ts`
- **検出者**: `architecture-reviewer`, `testing-reviewer`
- **問題**: 2 回目で `quiz-create-schema.test.ts` を `features/quiz/schemas/__tests__/` に移した一方、`format-fan-duration.test.ts` は `utils/` 直下に sibling 配置されており方針が割れていた。`lib/ux/__tests__/` も `__tests__/` 方式のためそちらに揃えるのが既存との整合が良い。
- **対応**: `format-fan-duration.test.ts` を `utils/__tests__/` に移動し、import を `../format-fan-duration` に変更した。

</details>

<details>
<summary>36. `app/v2/tech-plan.md` のディレクトリ構成が route-centered package-by-feature 移行を反映していなかった（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/tech-plan.md` (17-24 行目)
- **検出者**: `docs-reviewer`
- **問題**: 本 PR で `CLAUDE.md` / `docs/*.md` / `src/architecture.md` は新構成に更新済みだが、`tech-plan.md` のプロジェクト構成図だけ旧構成のまま残り、新規 contributor が旧方針で読む余地があった。
- **対応**: `routes/` / `features/` / `components/` / `mocks/` の責務を併記した図に更新した。

</details>

<details>
<summary>37. `/profile` と `/quiz/create` の smoke test が `(tabs)` wrapper 経由を routeId で固定していなかった（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/src/__tests__/App.test.tsx`
- **検出者**: `testing-reviewer`
- **問題**: 2 回目で `/quiz/question` テストに `router.state.matches.map(...).toContain("/(tabs)/quiz/question")` を追加した一方、同種の `/profile` / `/quiz/create` は navigation landmark しか見ておらず、`(tabs)` 外へ route を移しても通過してしまう状態だった。
- **対応**: 両 smoke test で `renderRoute` が返す `router` を受け取り、`toContain("/(tabs)/profile/")` / `toContain("/(tabs)/quiz/create")` の routeId assertion を追加した。

</details>

<details>
<summary>38. `alertMock` が module-level `let` で保持されており describe スコープに閉じていなかった（LOW / 修正済み）</summary>

- **ファイル**: `app/v2/src/__tests__/App.test.tsx`
- **検出者**: `testing-reviewer`
- **問題**: `let alertMock` が describe 外に置かれており、将来 `describe.concurrent` や並列化フラグが入った際にテスト間で参照が競合する余地があった。
- **対応**: `describe("App routes", ...)` ブロック内に `let alertMock` を移動し、mock のライフサイクルをテストスイートに限定した。

</details>

## 対応不要の懸念点（3 回目レビュー）

<details>
<summary>39. `navigates back to the home route after creating a quiz` で alert→navigate の順序が固定されていない（LOW-MEDIUM / 対応不要）</summary>

- **ファイル**: `app/v2/src/__tests__/App.test.tsx`
- **検出者**: `testing-reviewer`
- **問題**: `waitFor(pathname === "/")` の後に `toHaveBeenCalledWith` を検証しているため、alert が navigate commit の前後どちらに呼ばれても test は通過する。
- **対応不要の理由**: `QuizCreatePage` の `alert()` そのものが懸念 30 で「UX 改修別 PR で toast 化予定」としており、順序を固定すると将来 UX 改修時にテストも合わせて書き換える必要がある。alert が呼ばれた事実だけ固定しておけば toast 化 PR で挙動差分が自然に浮き上がる。

</details>

<details>
<summary>40. `renderRoute` 返却後の `router.state` 確定タイミングが `waitFor` で保護されていない（LOW / 対応不要）</summary>

- **ファイル**: `app/v2/src/__tests__/App.test.tsx`
- **検出者**: `testing-reviewer`
- **問題**: 現行テストは `findByRole(...)` で描画完了を待ってから `router.state.matches` を同期参照するが、将来 `createAppRouter` に `defaultPendingComponent` 等が入ると transient 状態を拾う可能性がある。
- **対応不要の理由**: 現状の `createAppRouter` には pending component がなく、`findByRole` 解決時には初期 match が確定している。実害が顕在化した時点で `waitFor` に差し替える方針。

</details>

## 4 回目レビュー（2026-04-19 再実行）で追加された対応

<details>
<summary>41. `src/architecture.md` `route.tsx は feature layout に使う` 節が新 Target Structure と矛盾していた（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/src/architecture.md`
- **検出者**: `architecture-reviewer`, `docs-reviewer`
- **問題**: Target Structure からは `route.tsx` を除去したのに、TanStack Router Conventions の `route.tsx` 節は実在しない `(tabs)/quiz/route.tsx` を含む tree を標準例として残していた。新規 contributor が `routes/` 側に layout を作り始める誘導になっていた。
- **対応**: 「現時点の K-Drop v2 では採用していない」「将来共通 wrapper が必要になった時の例」と明記し、例の tree を `question.tsx` を含む実構成＋コメント `route.tsx` の組み合わせに更新した。

</details>

<details>
<summary>42. ルート `CLAUDE.md` の v2 Directory Structure に `mocks/` が抜けていた（MEDIUM / 修正済み）</summary>

- **ファイル**: `CLAUDE.md`
- **検出者**: `architecture-reviewer`, `docs-reviewer`
- **問題**: 2 回目対応 (#26) で `features/` を追記したが `mocks/` は追加されず、`app/v2/tech-plan.md` / `docs/project-structure.md` / `src/architecture.md` の 3 つの tree が `mocks/` を含むのに root の `CLAUDE.md` だけ非対称になっていた。
- **対応**: `CLAUDE.md` の v2 Directory Structure に `mocks/ → app-wide mock data` を追記した。

</details>

<details>
<summary>43. `src/architecture.md` `Current State` の移行ナラティブが `home` を含まなかった（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/src/architecture.md`
- **検出者**: `docs-reviewer`, `architecture-reviewer`
- **問題**: 2 回目対応 (#28) で Goal の avoid リストは `home` を含む一般原則化をしたが、直後の `Current State` の移行対象の列挙は `profile` `ranking` `quiz` のまま。また `Migration Example` の「この方針は `profile` `ranking` `quiz` に適用済み」も 3 feature 固定だった。
- **対応**: `Current State` と `Migration Example` の 2 箇所を `home` `profile` `ranking` `quiz` の 4 feature 列挙に揃えた。

</details>

<details>
<summary>44. `features/` 配下テストの import path style が `quiz` と `profile` で割れていた（LOW-MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/src/features/quiz/schemas/__tests__/quiz-create-schema.test.ts`
- **検出者**: `architecture-reviewer`
- **問題**: 2 回目で配置規約（`__tests__/` サブディレクトリ）は統一されたが、import path が `quiz-create-schema.test.ts` では `@/features/quiz/...` と absolute、`format-fan-duration.test.ts` では `../format-fan-duration` と relative で、方針が割れていた。feature 内の他ソース（`ProfileBadges.tsx` の `../types` 等）は relative 主体で、テストもそれに揃えるのが自然。
- **対応**: `quiz-create-schema.test.ts` の import を `../../constants` / `../quiz-create-schema` に変更し、relative style に統一した。

</details>

<details>
<summary>45. `features/quiz/pages/` 配下のファイル名 prefix が非対称だった（LOW / 修正済み）</summary>

- **ファイル**: `app/v2/src/features/quiz/pages/group-selection-page.tsx` → `quiz-group-selection-page.tsx`
- **検出者**: `architecture-reviewer`
- **問題**: `pages/` 配下で `quiz-create-page.tsx` / `quiz-question-page.tsx` / `quiz-result-page.tsx` は `quiz-` prefix を持つ一方、`group-selection-page.tsx` だけ prefix なしで非対称だった。`pages/` 自体が `features/quiz/` 配下にあるため prefix は冗長ではあるが、既存 3 ファイルが prefix を持つ以上 PR 内の新設ファイルも揃える方が grep / IDE navigation が一貫する。
- **対応**: `group-selection-page.tsx` を `quiz-group-selection-page.tsx` にリネームし、`routes/(tabs)/quiz/index.tsx` と `docs/ux/ui-design-brushup-plan.md` の参照も更新した。

</details>

<details>
<summary>46. `/quiz/$sessionId` smoke test が `(tabs)` 配下の routeId を固定していなかった（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/src/__tests__/App.test.tsx`
- **検出者**: `testing-reviewer`
- **問題**: 3 回目で `/profile` / `/quiz/create` / `/quiz/question` には routeId assertion を追加したが、同じ `HIDDEN_BOTTOM_TAB_ROUTE_IDS` に属する `/quiz/$sessionId` だけ「tab bar 非表示」のみで `(tabs)` 配下固定が抜けていた。
- **対応**: `renderRoute` が返す router を受け取り、`router.state.matches.map(m => m.routeId)` が `/(tabs)/quiz/$sessionId` を含むことを検証する expect を追加した。

</details>

<details>
<summary>47. `/ranking` smoke test に tabs wrapper / navigation landmark / routeId assertion が無かった（MEDIUM / 修正済み）</summary>

- **ファイル**: `app/v2/src/__tests__/App.test.tsx`
- **検出者**: `testing-reviewer`
- **問題**: 3 回目で `/profile` / `/quiz/create` には追加した wrapper 固定が、同じく `(tabs)` 配下で tab bar が出る `/ranking` には適用されておらず、content assertion のみで通過する状態だった。
- **対応**: `renderRoute` の router を受け取り、`navigation` landmark の存在と `/(tabs)/ranking/` routeId を検証する 2 行を追加した（default total ranking テスト）。

</details>

## 対応不要の懸念点（4 回目レビュー）

<details>
<summary>48. `alertMock` が他テストで意図しない呼び出しを検知できない（LOW / 対応不要）</summary>

- **ファイル**: `app/v2/src/__tests__/App.test.tsx`
- **検出者**: `testing-reviewer`
- **問題**: `beforeEach` で alertMock を常に stub しているが、`alert()` が quiz-create テスト以外で誤って呼ばれた時の検知がない。
- **対応不要の理由**: 現時点で他テストに alert 呼び出し経路はなく、reviewer 自身が「3 回目スコープでは影響が限定的で LOW」と判断している。alert UX は懸念 30 で toast 化別 PR に送っており、toast 化タイミングで alertMock 運用自体を見直す方が効率的。

</details>

<details>
<summary>49. quiz-create-schema tuple の boundary テストが「5 個」と「3 個」のみで空配列などが無い（LOW / 対応不要）</summary>

- **ファイル**: `app/v2/src/features/quiz/schemas/__tests__/quiz-create-schema.test.ts`
- **検出者**: `testing-reviewer`
- **問題**: tuple 超過は 5 個、不足は 3 個のみで、0 件や 6 件以上は検証していない。
- **対応不要の理由**: Zod tuple の挙動は一貫しており、3 個で落ちれば 0 個も落ちる想定。reviewer 自身が「追加価値は限定的、次回 schema 変更 PR で boundary を増やす方が費用対効果が高い」と判断し LOW 扱い。

</details>
