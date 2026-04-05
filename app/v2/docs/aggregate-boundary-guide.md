# 集約境界設計ガイドライン

## 概要

K-Drop v2 でドメイン集約の境界を一貫して判断するためのガイドライン。ER 図 (`er-diagram.md`) のテーブル群を、どの集約にまとめるかの判断基準を定義する。

## 集約の基本概念

**集約（Aggregate）** は、データ整合性の境界を定義する関連するエンティティと値オブジェクトの集合。

### 重要な特徴

1. **整合性境界**: 集約内でのみ強い整合性を保証
2. **トランザクション境界**: 一回のトランザクションで一つの集約のみを変更
3. **アクセス制御**: 集約ルート以外への直接アクセスを禁止

## 集約境界の判断基準

### 同一集約に含めるべき条件

- データ変更時に同時に整合性チェックが必要
- ビジネスルール違反の検証を同時に行う必要がある
- 一つが変更されると他も必ず更新される関係

### 別集約に分離すべき条件

- データ変更の影響が遅延しても業務上問題ない
- 異なる業務プロセスで変更される
- パフォーマンス上の理由で分離が必要

### 判断フロー

1. **同時変更チェック** — 同じビジネス操作で同時に変更されるか？ → YES なら同一集約候補
2. **整合性要件チェック** — 強い整合性が必須か？ → YES なら同一集約
3. **トランザクション境界チェック** — 単一トランザクションでの変更が必要か？ → YES なら同一集約

## K-Drop v2 の集約定義

### 1. User 集約

| 集約ルート | 含まれるエンティティ |
|---|---|
| `users` | `users`, `user_profiles` |

- `users` はアカウント状態（有効/停止）の管理主体
- `user_profiles` は公開プロフィール。ユーザー作成時に同時に作り、1:1 の関係を維持
- `auth_identities` は認証境界であり User 集約には含めない。Better Auth が管理する外部テーブルとして扱う

**不変条件**:
- `user_profiles.user_id` は `users.user_id` と 1:1
- `user_profiles.handle` は一意

### 2. IdolGroup 集約

| 集約ルート | 含まれるエンティティ |
|---|---|
| `idol_groups` | `idol_groups` |

- `group_categories` はリファレンスデータ（マスタ）として独立管理
- `user_favorite_groups` はユーザーとグループの関係テーブルであり、どちらの集約にも含めない。独立した関係データとして扱う

**不変条件**:
- `idol_groups.slug` は一意

### 3. Quiz 集約（コンテンツ）

| 集約ルート | 含まれるエンティティ |
|---|---|
| `quizzes` | `quizzes`, `quiz_choices` |

- クイズ本文と選択肢は強い整合性が必要（1 クイズにつき正解はちょうど 1 つ）
- 公開・非公開の状態遷移はこの集約のメソッドで管理

**不変条件**:
- `quiz_choices` は `unique(quiz_id, choice_order)`
- 1 クイズにつき `is_correct = true` の選択肢はちょうど 1 つ
- `status` は `draft` → `published` → `archived` の遷移のみ許可

### 4. QuizSession 集約（プレイ・回答・進捗）

| 集約ルート | 含まれるエンティティ |
|---|---|
| `quiz_sessions` | `quiz_sessions`, `quiz_session_questions`, `quiz_answers` |

- 「1 回の挑戦」全体を管理する最も複雑な集約
- セッション開始時に出題セットを固定し、回答ごとに進捗を更新
- 回答時に `quiz_sessions` の `answered_question_count`, `correct_answer_count` 等を同一トランザクションで更新

**不変条件**:
- `quiz_session_questions` は `unique(quiz_session_id, question_order)` / `unique(quiz_session_id, quiz_id)`
- `quiz_answers` は `unique(quiz_session_question_id)`（1 出題枠 = 1 回答）
- `total_question_count` = `quiz_session_questions` の件数
- `status` は `in_progress` → `completed` / `abandoned`

### 5. UserScoreState 集約

| 集約ルート | 含まれるエンティティ |
|---|---|
| `user_score_states` | `user_score_states` |

- 現在スコアのキャッシュ。クイズセッション完了時に更新される
- `score_tiers` はリファレンスデータとして独立管理
- `user_score_snapshots` は日次バッチで生成する read model であり集約には含めない

**不変条件**:
- `unique(user_id, score_scope, idol_group_id)`
- `score_scope = overall` なら `idol_group_id = NULL`、`score_scope = group` なら `idol_group_id` 必須

### 6. DropWallet 集約

| 集約ルート | 含まれるエンティティ |
|---|---|
| `drop_wallets` | `drop_wallets`, `drop_transactions` |

- 残高とトランザクション履歴は強い整合性が必要
- `drop_transactions` が source of truth、`drop_wallets.balance` はキャッシュ
- 残高ズレが起きたときも再集計で復旧可能

**不変条件**:
- `drop_wallets.user_id` は `users.user_id` と 1:1
- `drop_transactions.delta` は 0 禁止（正負どちらも取る）
- `balance` = `sum(delta)` と常に一致

### 7. Event 集約

| 集約ルート | 含まれるエンティティ |
|---|---|
| `events` | `events`, `event_groups`, `event_participants` |

- イベント作成時に関連グループを設定し、参加者を管理する
- 参加状態は `participation_status`（`joined`, `waitlisted`, `cancelled`）で管理

**不変条件**:
- `event_groups` は `unique(event_id, idol_group_id)`
- `event_participants` は `unique(event_id, user_id)`
- `ends_at >= starts_at`

### 8. Leaderboard 集約

| 集約ルート | 含まれるエンティティ |
|---|---|
| `leaderboard_snapshots` | `leaderboard_snapshots`, `leaderboard_entries` |

- ランキング更新ジョブで一括生成する read model
- 一度作ったスナップショットは変更しない（イミュータブル）

**不変条件**:
- `leaderboard_entries` は `unique(leaderboard_snapshot_id, user_id)` / `unique(leaderboard_snapshot_id, display_rank)`

## 集約間の関係（ID 参照）

```
User ──(user_id)──→ QuizSession
User ──(user_id)──→ UserScoreState
User ──(user_id)──→ DropWallet
User ──(user_id)──→ Event (参加者)
User ──(user_id)──→ Leaderboard (エントリ)
IdolGroup ──(idol_group_id)──→ Quiz
IdolGroup ──(idol_group_id)──→ QuizSession
Quiz ──(quiz_id)──→ QuizSession (出題)
QuizSession ──(完了時)──→ UserScoreState (更新)
QuizSession ──(完了時)──→ DropWallet (報酬)
```

集約間は必ず ID で参照し、直接のオブジェクト参照は持たない。

## 実装時のチェックリスト

### 設計段階

- [ ] 集約ルートが明確に定義されている
- [ ] 集約内の不変条件が明文化されている
- [ ] 他の集約との依存関係が ID 参照のみになっている
- [ ] トランザクション境界が適切に設定されている

### 実装段階

- [ ] 集約ルート以外への直接アクセスが禁止されている
- [ ] 状態遷移はメソッドで表現し、プロパティの直接書き換えは禁止
- [ ] ファクトリ関数（`initialize*`）を通じて生成し、不正な状態を表現できない
- [ ] ビジネスルールが集約内で実装されている

### 関連ドキュメント

- ER 図: `er-diagram.md`
- モジュール配置: `docs/project-structure.md`
- レイヤー別の配置規約: `docs/component-placement-guide.md`
