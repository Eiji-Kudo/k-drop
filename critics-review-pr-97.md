# PR #97 チームレビュー懸念点

## 概要

- **PR**: v2: Cloudflare D1 データベースセットアップ
- **URL**: https://github.com/Eiji-Kudo/k-drop/pull/97
- **調査日**: 2026-04-05
- **レビュー回数**: 2回目
- **レビュー方式**: 並列レビュー + 相互検証

## レビュワー構成

| レビュワー | 専門領域 | 選定理由 |
|------------|----------|----------|
| `data-integrity-reviewer` | データ整合性・スキーマ設計 | 255行の初期マイグレーションに多数のテーブル・制約・インデックスが含まれる |
| `architecture-reviewer` | アーキテクチャ・型設計 | D1バインディングの型抽象化、モジュール構成、DIパターンの妥当性 |
| `security-reviewer` | セキュリティ・運用 | ヘルスチェックエンドポイント露出、エラー情報漏洩リスク |

## サマリー

| 重要度 | 件数 | 対応済み |
|--------|------|----------|
| CRITICAL | 2 | 2 |
| HIGH | 5 | 1 |
| MEDIUM | 12 | 9 |

## 参照したガイドライン

- `CLAUDE.md` (root)
- `app/v2/docs/architecture.md`
- `app/v2/docs/project-structure.md`
- `app/v2/docs/component-placement-guide.md`
- `app/v2/docs/aggregate-boundary-guide.md`
- `app/v2/docs/error-handling.md`
- `app/v2/docs/core-module-organization.md`
- `er-diagram.md`

## 未対応の懸念点

<details>
<summary>1. SQLiteで外部キー制約がデフォルト無効（CRITICAL / 未対応）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **CRITICAL** |
| ファイル | `app/v2/functions/db/migrations/0001_initial_schema.sql` (全体) |
| 検出者 | data-integrity-reviewer |

**問題点**:
SQLiteでは外部キー制約の検証がデフォルトで無効になっており、各接続ごとに `PRAGMA foreign_keys = ON` を明示的に実行しない限り、`REFERENCES` 句や `ON DELETE CASCADE` は構文としてパースされるだけで一切検証されない。

Cloudflare D1はSQLiteベースであり同じ挙動をする。PRAGMAが未設定の状態では:
- 存在しない `user_id` を持つ `auth_identities` や `quiz_sessions` が作成できてしまう
- `users` テーブルのレコードを削除しても子レコードがカスケード削除されずに孤立する

**推奨対応**:
1. Honoミドルウェアとして、全APIリクエストの処理前にD1接続へ `PRAGMA foreign_keys = ON` を発行する共通ミドルウェアを配置する
2. D1がPRAGMAをサポートしない場合はアプリケーション層で参照先の存在チェックを行う

</details>

<details>
<summary>3. `/api/health/database` が認証なしで外部公開（HIGH / 未対応）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **HIGH** |
| ファイル | `app/v2/src/lib/api/app.ts` (13行目) |
| 検出者 | security-reviewer |

**問題点**:
`GET /api/health/database` エンドポイントは、認証やアクセス制御なしでD1データベースへのクエリを実行する。DoSベクターとなりうる。

**注記**: 情報漏洩（`database: "d1"`, `reason`フィールド）は2回目レビューで修正済みを確認。残る課題はアクセス制御の追加。

**推奨対応**:
シークレットトークンによるアクセス制御を追加:
```ts
.get("/health/database", async (context) => {
    const token = context.req.header("X-Health-Token");
    if (token !== context.env.HEALTH_CHECK_TOKEN) {
        return context.json({ error: "Not Found" }, 404);
    }
    // ...
})
```

</details>

<details>
<summary>5. score_tiersとuser_score_statesのscope整合性が未保証（HIGH / 未対応）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **HIGH** |
| ファイル | `app/v2/functions/db/schema/scores.ts` |
| 検出者 | data-integrity-reviewer |

**問題点**:
ER図に「`score_tiers.tier_scope` と `user_score_states.score_scope` は一致している必要があります」と明記されているがSQL制約がない。SQLiteの `CHECK` 制約はサブクエリをサポートしていないため、DB層単独での解決は困難。

**推奨対応**:
アプリケーション層バリデーション: `user_score_states` を更新するRepository層で `score_tiers.tier_scope` と `score_scope` の一致を検証する。不一致時は `DomainError` を `Result` で返す。

</details>

<details>
<summary>6. quiz_answersのquiz_choice_idが対応するquizの選択肢であることが未検証（HIGH / 未対応）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **HIGH** |
| ファイル | `app/v2/functions/db/schema/quiz-sessions.ts` |
| 検出者 | data-integrity-reviewer |

**問題点**:
`quiz_answers` は `quiz_session_question_id` と `quiz_choice_id` の2つのFKを持つが、2つの参照先の `quiz_id` が同一であることを保証する制約がない。ER図に「実装では複合検証を入れます」と明記。

**推奨対応**:
アプリケーション層バリデーション: 回答記録のサービス層で `quiz_session_questions.quiz_id` と `quiz_choices.quiz_id` の一致を同一トランザクション内で検証する。

</details>

<details>
<summary>8. wrangler.tomlのプレースホルダdatabase_idが本番デプロイされるリスク（MEDIUM / 未対応）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **MEDIUM** |
| ファイル | `app/v2/wrangler.toml` (11行目) |
| 検出者 | security-reviewer |

**問題点**:
`database_id = "REPLACE_WITH_REAL_D1_DATABASE_ID"` のプレースホルダがCI/CDで検出されない。

**推奨対応**:
CIにプレースホルダ検出チェックを追加。

</details>

<details>
<summary>12. idol_groupsとeventsのFK ON DELETE動作が未定義（MEDIUM / 未対応）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **MEDIUM** |
| ファイル | `app/v2/functions/db/schema/groups.ts` (行15-17), `app/v2/functions/db/schema/events.ts` (行9-11) |
| 検出者 | data-integrity-reviewer |

**問題点**:
`idol_groups.group_category_id` と `events.created_by_user_id` の2つのFKにON DELETE句がない。他の全FKは `ON DELETE CASCADE` を明示。意図的なRESTRICTか記述漏れか不明。

**推奨対応**:
意図的にRESTRICTなら明示。CASCADEなら追加。

</details>

---

## 対応不要の懸念点

<details>
<summary>11. leaderboard_entriesのdisplay_rank一意制約が同順位（タイ）を許容しない（MEDIUM / 対応不要）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **MEDIUM** |
| ファイル | `app/v2/functions/db/schema/leaderboards.ts` |
| 検出者 | data-integrity-reviewer |

**問題点**:
`UNIQUE (leaderboard_snapshot_id, display_rank)` により同順位表現が不可能。

**チーム内議論**:
ER図で意図的にUNIQUE指定されていることを確認。リードがHIGHからMEDIUMに降格し、対応不要と判断。将来のタイ対応が必要になった場合はマイグレーションで変更する。

</details>

## 対応済みの懸念点

<details>
<summary>18. Drizzle移行でCHECK制約が消失（answered_le_total, answer_counts_sum, scope match）（HIGH / 修正済み）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **HIGH** |
| ファイル | `app/v2/functions/db/schema/quiz-sessions.ts`, `app/v2/functions/db/schema/leaderboards.ts` |
| 検出者 | data-integrity-reviewer, architecture-reviewer |

**問題点**:
手書きマイグレーションからDrizzle Kit生成に切り替えた際に、以下のCHECK制約が消失:
- `answered_question_count <= total_question_count`
- `correct_answer_count + incorrect_answer_count = answered_question_count`
- `leaderboard_snapshots` のscope/idol_group_id整合性CHECK

**修正内容**: イテレーション3でDrizzleスキーマに `answered_le_total`, `answer_counts_sum`, `leaderboard_scope_group_match` CHECK制約を追加。

</details>

<details>
<summary>19. 未使用のkysely依存（MEDIUM / 修正済み）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **MEDIUM** |
| ファイル | `app/v2/package.json` |
| 検出者 | architecture-reviewer |

**問題点**:
`devDependencies` に `kysely` が含まれているが、コード上で使用箇所がない。

**修正内容**: イテレーション3で `pnpm remove kysely` を実行。

</details>

<details>
<summary>2. DatabaseBinding型がRepository/Query層で利用不可能なほど制限的（CRITICAL / 修正済み）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **CRITICAL** |
| ファイル | `app/v2/functions/core/db/bindings.ts` |
| 検出者 | architecture-reviewer, security-reviewer |

**問題点**:
`DatabaseBinding` が `D1Database` と型互換性がなく、DI規約と乖離していた。

**修正内容**: `DatabaseBinding` を廃止し、`D1Database` 直接使用 + Drizzle ORM統合に変更。2回目レビューで修正済みを確認。

</details>

<details>
<summary>4. worker-configuration.d.tsとbindings.tsの型二重管理（HIGH / 修正済み）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **HIGH** |
| ファイル | `app/v2/functions/core/db/bindings.ts`, `app/v2/worker-configuration.d.ts` |
| 検出者 | architecture-reviewer |

**問題点**:
同じDB bindingに対して2つの異なる型定義が存在していた。

**修正内容**: 両方とも `D1Database` を使用するよう統一。2回目レビューで修正済みを確認。

</details>

<details>
<summary>7. エラーレスポンスのreasonフィールドが内部状態を漏洩（MEDIUM / 修正済み）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **MEDIUM** |
| ファイル | `app/v2/src/lib/api/app.ts` |
| 検出者 | security-reviewer |

**問題点**:
エラー時に `reason` や `database: "d1"` を外部に返していた。

**修正内容**: レスポンスを `{ status: "error" }` のみに変更し、詳細は `console.error` に限定。2回目レビューで修正済みを確認。

</details>

<details>
<summary>9. AppBindingsの配置がDB専用ファイル内（MEDIUM / 修正済み）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **MEDIUM** |
| ファイル | `app/v2/functions/core/bindings.ts` |
| 検出者 | architecture-reviewer |

**問題点**:
`AppBindings` が `core/db/` に配置されていた。

**修正内容**: `functions/core/bindings.ts` に移動。2回目レビューで修正済みを確認。

</details>

<details>
<summary>10. HealthチェックでD1例外が500で返る（MEDIUM / 修正済み）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **MEDIUM** |
| ファイル | `app/v2/src/lib/api/app.ts` |
| 検出者 | architecture-reviewer |

**問題点**:
D1例外時にtry-catchがなく500が返っていた。

**修正内容**: try-catch追加、例外時に503を返すよう修正。テストも追加。2回目レビューで修正済みを確認。

</details>

<details>
<summary>13. quiz_sessionsのstatusとcurrent_question_orderの整合性が未強制（MEDIUM / 修正済み）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **MEDIUM** |
| ファイル | `app/v2/functions/db/schema/quiz-sessions.ts` |
| 検出者 | data-integrity-reviewer |

**修正内容**: DrizzleスキーマにCHECK制約 `status_current_question_order` を追加。2回目レビューで修正済みを確認。

</details>

<details>
<summary>14. quiz_sessionsのcompleted状態でcompleted_at/last_answered_atの整合性が未強制（MEDIUM / 修正済み）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **MEDIUM** |
| ファイル | `app/v2/functions/db/schema/quiz-sessions.ts` |
| 検出者 | data-integrity-reviewer |

**修正内容**: 4つのCHECK制約を追加。2回目レビューで修正済みを確認。

</details>

<details>
<summary>15. total_question_count >= 0で0問セッションが許容される（MEDIUM / 修正済み）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **MEDIUM** |
| ファイル | `app/v2/functions/db/schema/quiz-sessions.ts` |
| 検出者 | data-integrity-reviewer |

**修正内容**: CHECK制約を `>= 1` に変更。2回目レビューで修正済みを確認。

</details>

<details>
<summary>16. leaderboard_snapshotsに同一スコープ・同一時点の重複防止がない（MEDIUM / 修正済み）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **MEDIUM** |
| ファイル | `app/v2/functions/db/schema/leaderboards.ts` |
| 検出者 | data-integrity-reviewer |

**修正内容**: 部分ユニークインデックス `leaderboard_snapshots_overall_unique` と `leaderboard_snapshots_group_unique` を追加。2回目レビューで修正済みを確認。

</details>

<details>
<summary>17. quizzesにstatus+idol_group_idの複合インデックスが不足（MEDIUM / 修正済み）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **MEDIUM** |
| ファイル | `app/v2/functions/db/schema/quizzes.ts` |
| 検出者 | data-integrity-reviewer |

**修正内容**: `quizzes_idol_group_id_status_idx` 複合インデックスに変更。2回目レビューで修正済みを確認。

</details>
