# PR #97 チームレビュー懸念点

## 概要

- **PR**: v2: Cloudflare D1 データベースセットアップ
- **URL**: https://github.com/Eiji-Kudo/k-drop/pull/97
- **調査日**: 2026-04-05
- **レビュー回数**: 1回目
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
| CRITICAL | 2 | 0 |
| HIGH | 4 | 0 |
| MEDIUM | 11 | 0 |

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
SQLiteでは外部キー制約の検証がデフォルトで無効になっており、各接続ごとに `PRAGMA foreign_keys = ON` を明示的に実行しない限り、`REFERENCES` 句や `ON DELETE CASCADE` は構文としてパースされるだけで一切検証されない。現在のマイグレーション `0001_initial_schema.sql` には18個のテーブルにわたって多数のFK参照（`auth_identities.user_id -> users`, `quiz_choices.quiz_id -> quizzes`, `quiz_answers.quiz_choice_id -> quiz_choices` 等）と `ON DELETE CASCADE` が宣言されているが、PRAGMAの設定がどこにも存在しない。

Cloudflare D1はSQLiteベースであり同じ挙動をする。PRAGMAが未設定の状態では:
- 存在しない `user_id` を持つ `auth_identities` や `quiz_sessions` が作成できてしまう
- 存在しない `quiz_id` を持つ `quiz_choices` が作成できてしまう
- `users` テーブルのレコードを削除しても、`auth_identities`, `user_profiles`, `quiz_sessions`, `user_score_states`, `drop_wallets` 等の子レコードがカスケード削除されずに孤立レコードとして残る
- `idol_groups` を削除しても `quizzes`, `user_favorite_groups`, `quiz_sessions` 等の参照レコードが残り、JOINで不整合が顕在化する

**該当コード**:
```sql
-- マイグレーション内のすべてのREFERENCES句（例）
auth_identity_id TEXT PRIMARY KEY,
user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
```

**推奨対応**:
1. マイグレーションファイルの先頭に `PRAGMA foreign_keys = ON;` を追加する。ただしD1のマイグレーション実行がPRAGMAを許可するかの確認が必要（D1では一部PRAGMAが制限されている）
2. Honoミドルウェアとして、全APIリクエストの処理前にD1接続へ `PRAGMA foreign_keys = ON` を発行する共通ミドルウェアを `functions/core/db/` または `functions/core/http/` に配置する:
```ts
app.use("*", async (context, next) => {
  await getDatabase(context).prepare("PRAGMA foreign_keys = ON").first();
  await next();
});
```
3. D1がPRAGMAをサポートしない場合の代替策として、INSERT/UPDATE時にアプリケーション層で参照先の存在チェックを行うバリデーションをRepository層に組み込む

</details>

<details>
<summary>2. DatabaseBinding型がRepository/Query層で利用不可能なほど制限的（CRITICAL / 未対応）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **CRITICAL** |
| ファイル | `app/v2/functions/core/db/bindings.ts` (行4, 6-8) |
| 検出者 | architecture-reviewer, security-reviewer |

**問題点**:
`DatabaseStatement` は `Pick<D1PreparedStatement, "first">` で `first` のみを公開し、`DatabaseBinding` は `prepare` のみを公開している。この型定義には以下の問題がある:

1. **CLAUDE.mdのDI規約との乖離**: DI規約は `(db: D1Database) => ({...})` の形式を取るが、`DatabaseBinding` は `D1Database` と型互換性がない。Repository層（例: `fooRepository(db: D1Database)`）やQuery層（例: `listFoos(db: D1Database, args)`）を実装する際、`DatabaseBinding` を渡すと型エラーになる

2. **実用的なメソッドの欠落**:
   - `bind()`: パラメータバインディングが不可能。今後 `WHERE user_id = ?` のようなクエリで `bind` がないとテンプレートリテラルによる文字列結合に頼ることになり、SQLインジェクションのリスクを生む
   - `all()`: 複数行の取得が不可能。ランキング一覧やクイズ選択肢一覧のようなリスト系クエリが書けない
   - `run()`: INSERT/UPDATE/DELETEの実行が不可能。Repository層の `save()` メソッドが実装できない
   - `batch()`, `exec()`: バッチ実行やPRAGMA実行が不可能

3. **Drizzle ORMとの非互換**: `docs/architecture.md` で「DB | Cloudflare D1 (SQLite) | Drizzle ORM で操作」と明記されており、Drizzle は内部的に `D1Database` の全メソッドを必要とする

**該当コード**:
```ts
type DatabaseStatement = Pick<D1PreparedStatement, "first">;

export type DatabaseBinding = {
  prepare: (...args: Parameters<D1Database["prepare"]>) => DatabaseStatement;
};
```

**推奨対応**:
`DatabaseBinding` を廃止し、`D1Database` をそのまま使う（設計ガイドとも一致、Drizzle導入にも対応）:
```ts
import type { D1Database } from "@cloudflare/workers-types/latest";
import type { Context } from "hono";

export type AppBindings = {
  Bindings: {
    DB: D1Database;
  };
};

export const getDatabase = (context: Context<AppBindings>) => {
  return context.env.DB;
};
```

</details>

<details>
<summary>3. `/api/health/database` が認証なしで外部公開（HIGH / 未対応）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **HIGH** |
| ファイル | `app/v2/src/lib/api/app.ts` (13行目) |
| 検出者 | security-reviewer |

**問題点**:
`GET /api/health/database` エンドポイントは、認証やアクセス制御なしでD1データベースへの `SELECT 1 AS ok` クエリを実行する。現在のミドルウェアチェーンは `secureHeaders()` のみ。

具体的なリスク:
- **DoSベクター**: 大量リクエストでD1の読み取りクォータを消費。Workersの実行時間課金とD1の読み取り課金の両方が発生
- **インフラ情報の露出**: レスポンスに `"database": "d1"` が含まれ、バックエンドがCloudflare D1を使用していることが外部から判別できる。エラー時のレスポンスもDB内部状態のヒントを与える
- **基本の `/api/health` との差別化が不明確**: DB接続を伴わない `/api/health` は外部公開に適しているが、DB接続を伴う `/api/health/database` は内部監視用途であるべき

**該当コード**:
```ts
.get("/health/database", async (context) => {
    const result = await getDatabase(context).prepare("SELECT 1 AS ok").first<{ ok: number }>();
    // ...
    return context.json({
        status: "ok",
        database: "d1",
    });
})
```

**推奨対応**:
- レスポンスボディから `"database": "d1"` やエラー理由を除去し、`{ status: "ok" }` / `{ status: "error" }` のみ返す
- アクセス制御を追加（シークレットトークン照合など）:
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
<summary>4. worker-configuration.d.tsとbindings.tsの型二重管理（HIGH / 未対応）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **HIGH** |
| ファイル | `app/v2/functions/core/db/bindings.ts` (行1-8), `app/v2/worker-configuration.d.ts` (行5) |
| 検出者 | architecture-reviewer |

**問題点**:
同じD1バインディング `DB` に対して、2つの独立した型定義が存在する:
1. `worker-configuration.d.ts`: `DB: D1Database` — Wranglerの `cf:typegen` で自動生成
2. `bindings.ts`: `DB: DatabaseBinding` — 手動定義、`D1Database` のサブセット

`tsconfig.functions.json` の `include` に `worker-configuration.d.ts` が含まれており、TypeScriptコンパイル時に `Cloudflare.Env.DB` (= `D1Database`) と `AppBindings.Bindings.DB` (= `DatabaseBinding`) の2つの型が共存する。

リスク:
- `wrangler.toml` にバインディング追加 → `cf:typegen` 再実行で `worker-configuration.d.ts` は自動更新されるが `bindings.ts` は手動更新が必要
- 開発者がどちらの型を使うべきか判断に迷う
- Honoアプリは `AppBindings` で型付け、Pages Functionsの `onRequest` は `Cloudflare.Env` を受け取り、同じ `DB` に異なる型が適用される

**該当コード**:
```ts
// worker-configuration.d.ts
DB: D1Database;

// bindings.ts
DB: DatabaseBinding;  // D1Database のサブセット
```

**推奨対応**:
`D1Database` を直接使うか、`Cloudflare.Env` から導出して Single Source of Truth を保つ:
```ts
// 案1: D1Database 直接使用
export type AppBindings = {
  Bindings: {
    DB: D1Database;
  };
};

// 案2: worker-configuration.d.ts から導出
type AppBindings = { Bindings: Cloudflare.Env };
```

</details>

<details>
<summary>5. score_tiersとuser_score_statesのscope整合性が未保証（HIGH / 未対応）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **HIGH** |
| ファイル | `app/v2/functions/db/migrations/0001_initial_schema.sql` (行129-142) |
| 検出者 | data-integrity-reviewer |

**問題点**:
ER図セクション4「主な制約」に「`score_tiers.tier_scope` と `user_score_states.score_scope` は一致している必要があります」と明記されているが、SQL制約がない。

具体的に発生しうる不整合:
- `score_scope = 'overall'` の `user_score_states` レコードに、`tier_scope = 'group'` の `score_tier` が紐付けられる。例えば全体スコア500点のユーザーに「BTSブロンズ」のようなグループ専用ティアが割り当てられてしまう
- 逆に `score_scope = 'group'` のレコードに `tier_scope = 'overall'` のティアが紐付けられ、グループ別ランキング画面で不適切なティア名が表示される

SQLiteの `CHECK` 制約はサブクエリをサポートしていないため、DB層単独での解決は困難。

**該当コード**:
```sql
CREATE TABLE user_score_states (
  ...
  score_scope TEXT NOT NULL CHECK (score_scope IN ('overall', 'group')),
  ...
  score_tier_id TEXT NOT NULL REFERENCES score_tiers(score_tier_id),
  ...
);
```

**推奨対応**:
アプリケーション層バリデーション（推奨）: `user_score_states` を更新するRepository層またはドメインサービスで、`score_tier_id` から引いた `score_tiers.tier_scope` と `score_scope` の一致を検証する。不一致時は `DomainError` を `Result` で返す。

またはDBトリガー:
```sql
CREATE TRIGGER user_score_states_tier_scope_check
  BEFORE INSERT ON user_score_states
  FOR EACH ROW
  WHEN (SELECT tier_scope FROM score_tiers WHERE score_tier_id = NEW.score_tier_id) <> NEW.score_scope
BEGIN
  SELECT RAISE(ABORT, 'score_tier.tier_scope must match user_score_states.score_scope');
END;
```

</details>

<details>
<summary>6. quiz_answersのquiz_choice_idが対応するquizの選択肢であることが未検証（HIGH / 未対応）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **HIGH** |
| ファイル | `app/v2/functions/db/migrations/0001_initial_schema.sql` (行121-127) |
| 検出者 | data-integrity-reviewer |

**問題点**:
`quiz_answers` は `quiz_session_question_id` と `quiz_choice_id` の2つのFKを持つが、2つの参照先の `quiz_id` が同一であることを保証する制約がない:

```
quiz_answers.quiz_session_question_id
  -> quiz_session_questions.quiz_id = 'QUIZ_A'

quiz_answers.quiz_choice_id
  -> quiz_choices.quiz_id = 'QUIZ_B'  (異なるクイズの選択肢でも参照可能)
```

ER図セクション4にも「`quiz_choice_id` は、その `quiz_session_question_id` が指す `quiz_id` に属する選択肢である必要があります。実装では複合検証を入れます」と明記されている。

Quiz Aの出題に対してQuiz Bの選択肢で回答が記録されると、`is_correct` の判定が狂い、`awarded_score` → `user_score_states` への累積まで不正確になる。

**該当コード**:
```sql
CREATE TABLE quiz_answers (
  quiz_answer_id TEXT PRIMARY KEY,
  quiz_session_question_id TEXT NOT NULL REFERENCES quiz_session_questions(quiz_session_question_id) ON DELETE CASCADE,
  quiz_choice_id TEXT NOT NULL REFERENCES quiz_choices(quiz_choice_id),
  awarded_score INTEGER NOT NULL CHECK (awarded_score >= 0),
  answered_at TEXT NOT NULL,
  UNIQUE (quiz_session_question_id)
);
```

**推奨対応**:
アプリケーション層バリデーション（推奨）: 回答記録のサービス層で以下の検証を同一トランザクション内で行う:
1. `quiz_session_question_id` から `quiz_session_questions.quiz_id` を取得
2. `quiz_choice_id` から `quiz_choices.quiz_id` を取得
3. 両者が一致しない場合は `DomainError` を `Result` で返して拒否

またはDBトリガー:
```sql
CREATE TRIGGER quiz_answers_choice_belongs_to_quiz
  BEFORE INSERT ON quiz_answers
  FOR EACH ROW
  WHEN (
    SELECT qc.quiz_id FROM quiz_choices qc WHERE qc.quiz_choice_id = NEW.quiz_choice_id
  ) <> (
    SELECT qsq.quiz_id FROM quiz_session_questions qsq WHERE qsq.quiz_session_question_id = NEW.quiz_session_question_id
  )
BEGIN
  SELECT RAISE(ABORT, 'quiz_choice does not belong to the quiz of this session question');
END;
```

</details>

<details>
<summary>7. エラーレスポンスのreasonフィールドが内部状態を漏洩（MEDIUM / 未対応）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **MEDIUM** |
| ファイル | `app/v2/src/lib/api/app.ts` (17行目, 21行目) |
| 検出者 | security-reviewer |

**問題点**:
`/api/health/database` のエラー時に `reason: "query returned no rows"` や `reason: "unexpected query result"` をJSONレスポンスとして外部に返している。さらに `database: "d1"` というフィールドにより、バックエンドのデータベース種別が外部から特定できる。懸念点3（認証なし公開）と合わせると、攻撃者がD1の障害状態を詳細に観測できてしまう。

**該当コード**:
```ts
return context.json({ status: "error", database: "d1", reason: "query returned no rows" }, 503);
return context.json({ status: "error", database: "d1", reason: "unexpected query result" }, 503);
```

**推奨対応**:
外部レスポンスには `{ status: "error" }` のような汎用メッセージのみを返し、`reason` や `database` の詳細は `console.error` に限定する:
```ts
if (result == null || result.ok !== 1) {
  console.error("D1 health check failed", { result });
  return context.json({ status: "error" }, 503);
}
return context.json({ status: "ok" });
```

</details>

<details>
<summary>8. wrangler.tomlのプレースホルダdatabase_idが本番デプロイされるリスク（MEDIUM / 未対応）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **MEDIUM** |
| ファイル | `app/v2/wrangler.toml` (11行目) |
| 検出者 | security-reviewer |

**問題点**:
`database_id = "REPLACE_WITH_REAL_D1_DATABASE_ID"` というプレースホルダがハードコードされている。コメントで手動置換の指示はあるが、CI/CDでの検出機構がない。プレースホルダのままデプロイされると、D1バインディングの解決に失敗しランタイムでアプリケーション全体がクラッシュする可能性がある。

**該当コード**:
```toml
database_id = "REPLACE_WITH_REAL_D1_DATABASE_ID"
```

**推奨対応**:
CIにプレースホルダ検出チェックを追加:
```yaml
- name: Validate wrangler.toml
  run: |
    if grep -q 'REPLACE_WITH_REAL_D1_DATABASE_ID' app/v2/wrangler.toml; then
      echo "::error::wrangler.toml contains placeholder database_id"
      exit 1
    fi
```

</details>

<details>
<summary>9. AppBindingsの配置がDB専用ファイル内（MEDIUM / 未対応）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **MEDIUM** |
| ファイル | `app/v2/functions/core/db/bindings.ts` (行10-14) |
| 検出者 | architecture-reviewer |

**問題点**:
`AppBindings` 型はHonoアプリケーション全体の環境バインディングを表す型であるにもかかわらず、`core/db/` というDB専用ディレクトリに配置されている。KV Namespace、R2 Bucket等のバインディングが追加される際に、DB固有のファイルにアプリケーション横断の型定義が集積する不自然な構造になる。`core-module-organization.md` でも `core/db/` は「D1クライアント、トランザクションユーティリティ」と定義されている。

**該当コード**:
```ts
// functions/core/db/bindings.ts
export type AppBindings = {
  Bindings: {
    DB: DatabaseBinding;
  };
};
```

**推奨対応**:
`functions/core/bindings.ts` などDB非依存の場所に `AppBindings` を移動:
```ts
// functions/core/bindings.ts
import type { D1Database } from "@cloudflare/workers-types/latest";

export type AppBindings = {
  Bindings: {
    DB: D1Database;
  };
};
```

```ts
// functions/core/db/client.ts
import type { Context } from "hono";
import type { AppBindings } from "../bindings";

export const getDatabase = (context: Context<AppBindings>) => {
  return context.env.DB;
};
```

</details>

<details>
<summary>10. HealthチェックでD1例外が500で返る（503ではない）（MEDIUM / 未対応）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **MEDIUM** |
| ファイル | `app/v2/src/lib/api/app.ts` (13-28行目) |
| 検出者 | architecture-reviewer |

**問題点**:
`/api/health/database` ハンドラでは `getDatabase(context).prepare("SELECT 1 AS ok").first()` を `await` しているが、このPromiseがrejectされた場合（D1のネットワーク障害、バインディング未設定等）の例外がハンドラ内でcatchされていない。Honoの `app.onError` に委譲されて 500 が返る。ヘルスチェックでのDB接続不能は 503 Service Unavailable が適切。ロードバランサーや監視システムは 500 と 503 を異なるシグナルとして扱う（500は即座にアラート、503はバックエンドの一時的切り離し）。

**該当コード**:
```ts
.get("/health/database", async (context) => {
  const result = await getDatabase(context).prepare("SELECT 1 AS ok").first<{ ok: number }>();
  // prepare/first が例外をthrowした場合、onError経由で500が返る
```

**推奨対応**:
```ts
.get("/health/database", async (context) => {
  try {
    const result = await getDatabase(context).prepare("SELECT 1 AS ok").first<{ ok: number }>();
    if (result == null || result.ok !== 1) {
      console.error("D1 health check failed", { result });
      return context.json({ status: "error" }, 503);
    }
    return context.json({ status: "ok" });
  } catch (error) {
    console.error("D1 health check exception", error);
    return context.json({ status: "error" }, 503);
  }
});
```

</details>

<details>
<summary>11. leaderboard_entriesのdisplay_rank一意制約が同順位（タイ）を許容しない（MEDIUM / 未対応）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **MEDIUM** |
| ファイル | `app/v2/functions/db/migrations/0001_initial_schema.sql` (行217) |
| 検出者 | data-integrity-reviewer |

**問題点**:
`UNIQUE (leaderboard_snapshot_id, display_rank)` により、同一スナップショット内で同じ `display_rank` 値を持つエントリを複数作成できない。同スコアのユーザーが複数いた場合に「1位、1位、3位」のような同順位表現が不可能。ER図では意図的にUNIQUE指定されており、ランキング生成ジョブがタイブレークルールで一意のランクを割り当てる前提の設計と読み取れる。

**該当コード**:
```sql
UNIQUE (leaderboard_snapshot_id, display_rank)
```

**推奨対応**:
現時点ではER図の設計意図に合致しており、変更不要。ただしタイブレークルールの仕様（何を基準に同スコアユーザーの順位を決定するか）をドキュメント化しておくことを推奨する。将来タイ対応が必要になった場合はマイグレーションで変更する。

**チーム内議論**:
data-integrity-reviewerがHIGHとして報告したが、ER図で意図的に設計されていることを確認し、リードがMEDIUMに降格。将来の仕様変更リスクとしての認識にとどめる。

</details>

<details>
<summary>12. idol_groupsとeventsのFK ON DELETE動作が未定義（MEDIUM / 未対応）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **MEDIUM** |
| ファイル | `app/v2/functions/db/migrations/0001_initial_schema.sql` (行38, 170) |
| 検出者 | data-integrity-reviewer |

**問題点**:
`idol_groups.group_category_id`（行38）と `events.created_by_user_id`（行170）の2つのFK定義にON DELETE句が記述されていない。スキーマ全体では他の全FK（20箇所以上）がすべて `ON DELETE CASCADE` を明示しているため、意図的な省略か記述漏れかが判別できない。

SQLiteのデフォルト動作は `ON DELETE NO ACTION`。`events.created_by_user_id` について、同じ `users` テーブルを参照するFKで `quiz_sessions.user_id` 等はCASCADEだが `events` は無指定、という非対称な動作になる。ユーザー削除時に `events` だけ残り、削除が失敗する原因の切り分けが困難になる。

**該当コード**:
```sql
group_category_id TEXT NOT NULL REFERENCES group_categories(group_category_id),
-- ...
created_by_user_id TEXT NOT NULL REFERENCES users(user_id),
```

**推奨対応**:
意図的にRESTRICTとしたい場合は `ON DELETE RESTRICT` を明示。判断基準:
- `group_category_id`: マスタデータ保護なら `ON DELETE RESTRICT`
- `created_by_user_id`: 監査証跡保持なら `ON DELETE RESTRICT`、ユーザー削除に追従するなら `ON DELETE CASCADE`

</details>

<details>
<summary>13. quiz_sessionsのstatusとcurrent_question_orderの整合性が未強制（MEDIUM / 未対応）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **MEDIUM** |
| ファイル | `app/v2/functions/db/migrations/0001_initial_schema.sql` (行88-104) |
| 検出者 | data-integrity-reviewer |

**問題点**:
`status` と `current_question_order` の関係を検証するCHECK制約がない。以下の不整合が許容される:
- `status = 'in_progress'` かつ `current_question_order = NULL` — 進行中なのに現在の問題番号が不明
- `status = 'completed'` かつ `current_question_order = 5` — 完了済みなのに次の問題番号が残っている
- ER図には「完了時はNULLにするか `total_question_count + 1` に寄せるかを統一する」と記載あり

**該当コード**:
```sql
CHECK (current_question_order IS NULL OR current_question_order >= 1)
```

**推奨対応**:
```sql
CHECK (
  (status = 'in_progress' AND current_question_order IS NOT NULL) OR
  (status IN ('completed', 'abandoned') AND current_question_order IS NULL)
)
```

</details>

<details>
<summary>14. quiz_sessionsのcompleted状態でcompleted_at/last_answered_atの整合性が未強制（MEDIUM / 未対応）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **MEDIUM** |
| ファイル | `app/v2/functions/db/migrations/0001_initial_schema.sql` (行88-104) |
| 検出者 | data-integrity-reviewer |

**問題点**:
`status = 'completed'` で `completed_at = NULL` が可能。`answered_question_count > 0` で `last_answered_at = NULL` も可能。ER図セクション8では「全問回答したら `status` を `completed` にし、`completed_at` を埋める」と明記されている。

**該当コード**:
```sql
started_at TEXT NOT NULL,
last_answered_at TEXT,
completed_at TEXT,
```

**推奨対応**:
```sql
CHECK (status != 'completed' OR completed_at IS NOT NULL),
CHECK (status = 'completed' OR completed_at IS NULL),
CHECK (answered_question_count = 0 OR last_answered_at IS NOT NULL),
CHECK (answered_question_count > 0 OR last_answered_at IS NULL)
```

</details>

<details>
<summary>15. total_question_count >= 0で0問セッションが許容される（MEDIUM / 未対応）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **MEDIUM** |
| ファイル | `app/v2/functions/db/migrations/0001_initial_schema.sql` (行93) |
| 検出者 | data-integrity-reviewer |

**問題点**:
`total_question_count >= 0` により問題数0のクイズセッション作成可能。ER図では「セッション開始時に出題セットを固定する」設計で、0問のセッションはビジネス的に無意味。`total_question_count = 0` では開始直後に全問回答完了の状態が成立し、スコア0の空セッションが量産される可能性がある。

**該当コード**:
```sql
total_question_count INTEGER NOT NULL CHECK (total_question_count >= 0),
```

**推奨対応**:
```sql
total_question_count INTEGER NOT NULL CHECK (total_question_count >= 1),
```

</details>

<details>
<summary>16. leaderboard_snapshotsに同一スコープ・同一時点の重複防止がない（MEDIUM / 未対応）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **MEDIUM** |
| ファイル | `app/v2/functions/db/migrations/0001_initial_schema.sql` (行201-208) |
| 検出者 | data-integrity-reviewer |

**問題点**:
`leaderboard_snapshots` にはPKとCHECK制約のみ定義されており、同じスコープ・同じ時点のスナップショットの重複を防ぐユニーク制約がない。バッチジョブのリトライ（タイムアウト、ワーカー再起動、at-least-once保証等）で同じ組み合わせの重複スナップショットが作成される。同じパターンの部分ユニークインデックスは `user_score_snapshots` で既に使用されている。

**該当コード**:
```sql
CREATE TABLE leaderboard_snapshots (
  leaderboard_snapshot_id TEXT PRIMARY KEY,
  leaderboard_scope TEXT NOT NULL CHECK (leaderboard_scope IN ('overall', 'group')),
  idol_group_id TEXT REFERENCES idol_groups(idol_group_id) ON DELETE CASCADE,
  snapshot_at TEXT NOT NULL,
  ...
);
```

**推奨対応**:
```sql
CREATE UNIQUE INDEX leaderboard_snapshots_overall_unique
  ON leaderboard_snapshots (leaderboard_scope, snapshot_at)
  WHERE idol_group_id IS NULL;

CREATE UNIQUE INDEX leaderboard_snapshots_group_unique
  ON leaderboard_snapshots (leaderboard_scope, idol_group_id, snapshot_at)
  WHERE idol_group_id IS NOT NULL;
```

</details>

<details>
<summary>17. quizzesにstatus+idol_group_idの複合インデックスが不足（MEDIUM / 未対応）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **MEDIUM** |
| ファイル | `app/v2/functions/db/migrations/0001_initial_schema.sql` (行242) |
| 検出者 | data-integrity-reviewer |

**問題点**:
`quizzes` テーブルのインデックスは `(idol_group_id)` の単一カラムのみ。「特定グループの公開中クイズ一覧取得」（`WHERE idol_group_id = ? AND status = 'published'`）が頻出するが、`status` のフィルタリングがインデックスに含まれていない。セッション開始時の出題セット選定でもこの条件のクエリが実行される可能性が高い。

**該当コード**:
```sql
CREATE INDEX quizzes_idol_group_id_idx ON quizzes (idol_group_id);
```

**推奨対応**:
既存インデックスを複合インデックスに置き換え:
```sql
CREATE INDEX quizzes_idol_group_id_status_idx ON quizzes (idol_group_id, status);
```
単一カラムインデックスは複合インデックスに包含されるため削除可能。ただし初期段階ではクエリパターンが確定していないため、後からの追加でも問題ない。

</details>
