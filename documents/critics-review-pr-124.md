# PR #124 チームレビュー懸念点

## 概要

- **PR**: test: v2 ER図の設計検証テスト (Vitest)
- **URL**: https://github.com/Eiji-Kudo/k-drop/pull/124
- **調査日**: 2026-04-05
- **レビュー回数**: 2
- **レビュー方式**: 並列レビュー + 相互検証

## レビュワー構成

| レビュワー | 専門領域 | 選定理由 |
|------------|----------|----------|
| `test-quality-reviewer` | テスト設計品質・信頼性 | 76→169テストの品質・カバレッジ検証が必要 |
| `data-integrity-reviewer` | DB制約・データ整合性 | マイグレーションSQLとテストの整合性検証 |
| `architecture-reviewer` | コード構成・ガイドライン遵守 | プロジェクト規約準拠、ファイル構成の妥当性確認 |

## サマリー

| 重要度 | 件数 | 対応済み |
|--------|------|----------|
| CRITICAL | 0 | 0 |
| HIGH | 0 | 0 |
| MEDIUM | 10 | 10 |

## 参照したガイドライン

- `CLAUDE.md` (root)
- `app/v2/eslint.config.js`
- `app/v2/vite.config.ts`

## 未対応の懸念点

(なし)

---

## 対応不要の懸念点

<details>
<summary>1. .toThrow() のエラー内容が未検証（MEDIUM / 対応不要）</summary>

- **ファイル**: 全テストファイル
- **問題**: `.toThrow()` を引数なしで使用しており、意図した制約違反か検証していない
- **対応不要理由**: `beforeEach` で毎回DBを再作成しており、テスト間の状態汚染がないため実際のリスクは極めて低い。全テスト修正は大量の変更となりPRスコープを超える

</details>

<details>
<summary>8. user_score_states の answered_count_min / correct_count_min 個別テスト欠落（MEDIUM / 対応不要）</summary>

- **ファイル**: `er-boundary-values.test.ts`
- **問題**: `answered_count >= 0` と `correct_count >= 0` の個別CHECK制約テストがない
- **対応不要理由**: `er-boundary-values.test.ts` L97-98 で `score_total < 0` 拒��を検証、`er-quiz-session-checks.test.ts` L69 で `correct_count <= answered_count` を検証。`er-boundary-values.test.ts` L43-47 で負のカウンタ値が拒否されることも間接的に確認済み。個別テスト追加はYAGNI

</details>

## 対応済みの懸念点

<details>
<summary>2. ローカル insertUser 関数がヘルパーの insertUser を隠蔽（MEDIUM / 修正済み）</summary>

- **ファイル**: `er-quiz-session-checks.test.ts`
- **問題**: ローカルの `insertUser` 関数がヘルパーと重複していた
- **対応**: ローカル関数を削除し、`test-helper.ts` の `insertUser` をインポートに統一

</details>

<details>
<summary>3. user_score_snapshots の条件付きユニークインデックスとスコア制約のテスト欠如（MEDIUM / 修正済み）</summary>

- **ファイル**: `er-conditional-indexes.test.ts`, `er-quiz-session-checks.test.ts`
- **問題**: `user_score_snapshots` の条件付きユニークインデックスと `score_total >= 0` 制約のテストが欠如
- **対応**: `er-conditional-indexes.test.ts` にユニークインデックステスト、`er-quiz-session-checks.test.ts` に `score_total` 境界値テストを追加

</details>

<details>
<summary>4. quiz_answers.awarded_score >= 0 と quiz_session_questions.question_order >= 1 のテスト欠如（MEDIUM / 修正済み）</summary>

- **ファイル**: `er-boundary-values.test.ts`
- **問題**: `quiz_answers.awarded_score` と `quiz_session_questions.question_order` の CHECK 制約テストが欠如
- **対応**: `er-boundary-values.test.ts` に境界値テストを追加

</details>

<details>
<summary>5. ON DELETE no action (quiz_choices, score_tiers) のテスト欠如（MEDIUM / 修正済み）</summary>

- **ファイル**: `er-relations.test.ts`
- **問題**: ON DELETE NO ACTION の FK 動作がテストされていない
- **対応**: `er-relations.test.ts` に `quiz_choices` と `score_tiers` の削除ブロックテストを追加

</details>

<details>
<summary>6. マイグレーションファイルパスのハードコーディング（MEDIUM / 修正済み）</summary>

- **ファイル**: `test-helper.ts`
- **問題**: マイグレーションファイル名がハードコードされていた
- **対応**: `readdirSync` で migrations ディレクトリ内の全 `.sql` ファイルを動的に読み込む方式に変更

</details>

<details>
<summary>7. quizzes の enum CHECK 制約���対する否定テストが欠落（MEDIUM / 修正済み）</summary>

- **ファイル**: `er-constraints.test.ts`
- **問題**: `quizzes` の `difficulty` と `status` の不正値拒否テストが欠如（正常値テストのみ存在）
- **対応**: `er-constraints.test.ts` に `difficulty: "extreme"` と `status: "deleted"` の拒否テストを追加

</details>

<details>
<summary>9. group_categories の slug ユニーク制約テスト欠落（MEDIUM / 修正済み）</summary>

- **ファイル**: `er-constraints.test.ts`
- **問題**: `group_categories.slug` のユニーク制約テストが欠如（他テーブルのslugはテスト済み）
- **対応**: `er-constraints.test.ts` に重複slug���入の拒否テストを追加

</details>

<details>
<summary>10. event_participants の不正 participation_status 拒否テスト欠落（MEDIUM / 修正済み）</summary>

- **ファイル**: `er-constraints.test.ts`
- **問題**: `event_participants.participation_status` の不正値拒否テストが欠如（正常値テストのみ存在）
- **対応**: `er-constraints.test.ts` に `participation_status: "pending"` の拒否テストを追加

</details>
