# データベーススキーマ

## エンティティ関連図

```mermaid
erDiagram
    group_category {
        int group_category_id PK "NOT NULL"
        string category_name "NOT NULL"
    }
    idol_group {
        int idol_group_id PK "NOT NULL"
        int group_category_id FK "NOT NULL"
        string idol_group_name "NOT NULL"
        text thumbnail_image "NULL allowed"
    }
    app_user {
        int app_user_id PK "NOT NULL"
        uuid supabase_uuid "NOT NULL"
        string line_account_id "NOT NULL"
    }
    user_profile {
        int user_profile_id PK "NOT NULL"
        int app_user_id FK "NOT NULL"
        string user_name "NOT NULL"
        int total_otaku_score "NOT NULL, 総合オタク力"
        int remaining_drop "NOT NULL, 所持中のドロップ数"
        int total_otaku_layer_id FK "NOT NULL, 総合オタクレイヤー"
    }
    total_otaku_layer {
        int total_otaku_layer_id PK "NOT NULL"
        string layer_name "NOT NULL"
        int min_score "NOT NULL"
        int max_score "NOT NULL"
    }
    group_otaku_layer {
        int group_otaku_layer_id PK "NOT NULL"
        string layer_name "NOT NULL"
        int min_score "NOT NULL"
        int max_score "NOT NULL"
    }
    user_idol_group_score {
        int user_idol_group_score_id PK "NOT NULL"
        int app_user_id FK "NOT NULL"
        int idol_group_id FK "NOT NULL"
        int otaku_score "NOT NULL"
        int group_otaku_layer_id FK "NOT NULL, グループ別オタクレイヤー"
    }
    quiz_difficulty {
        int quiz_difficulty_id PK "NOT NULL"
        string difficulty_name "NOT NULL"
    }
    quizzes {
        int quiz_id PK "NOT NULL"
        int idol_group_id FK "NOT NULL"
        int quiz_difficulty_id FK "NOT NULL"
        text prompt "NOT NULL"
        text explanation "NOT NULL"
    }
    quiz_choices {
        int quiz_choice_id PK "NOT NULL"
        int quiz_id FK "NOT NULL"
        string choice_text "NOT NULL"
        boolean is_correct "NOT NULL, indicates if this choice is correct"
    }
    user_quiz_answers {
        int user_quiz_answer_id PK "NOT NULL"
        int app_user_id FK "NOT NULL"
        int quiz_id FK "NOT NULL"
        int selected_choice "NOT NULL, 1-based index of selected choice"
        boolean is_correct "NOT NULL"
        datetime answered_at "NOT NULL"
    }
    ranking_total {
        int ranking_total_id PK "NOT NULL"
        int app_user_id FK "NOT NULL"
        int display_rank "NOT NULL, バッチ計算時点の総合順位"
        int display_score "NOT NULL, バッチ計算時点の総合スコア"
        datetime updated_at "NOT NULL"
    }
    ranking_group {
        int ranking_group_id PK "NOT NULL"
        int app_user_id FK "NOT NULL"
        int idol_group_id FK "NOT NULL"
        int display_rank "NOT NULL, バッチ計算時点のグループ順位"
        int display_score "NOT NULL, バッチ計算時点のグループ別スコア"
        datetime updated_at "NOT NULL"
    }
    event {
        int event_id PK "NOT NULL"
        int created_by FK "NOT NULL, イベント作成者(app_user_id)"
        string event_name "NOT NULL"
        text event_description "NOT NULL"
        string location "NOT NULL"
        datetime event_date "NOT NULL"
        datetime created_at "NOT NULL"
        datetime updated_at "NOT NULL"
    }
    event_participation {
        int event_participation_id PK "NOT NULL"
        int event_id FK "NOT NULL"
        int app_user_id FK "NOT NULL"
        datetime joined_at "NOT NULL"
    }
    event_group_participation {
        int event_group_participation_id PK "NOT NULL"
        int event_id FK "NOT NULL"
        int idol_group_id FK "NOT NULL"
        datetime registered_at "NOT NULL, グループ参加登録日時"
    }
    monthly_score_history {
        int monthly_score_history_id PK "NOT NULL"
        int app_user_id FK "NOT NULL"
        datetime month "NOT NULL, 月のスナップショット (例: 2023-04-01)"
        int score_snapshot "NOT NULL, 月初のユーザスコア"
        datetime updated_at "NOT NULL"
    }

    %% Relationship Definitions
    group_category ||--|{ idol_group : "has many"
    idol_group }|--|| group_category : "belongs to"

    app_user ||--|| user_profile : "has one profile"
    user_profile }|--|| app_user : "belongs to"

    user_profile }|--|| total_otaku_layer : "belongs to (total layer)"
    total_otaku_layer ||--|{ user_profile : "has many"

    app_user ||--|{ user_idol_group_score : "has many (per group score)"
    user_idol_group_score }|--|| app_user : "belongs to"
    idol_group ||--|{ user_idol_group_score : "has many"
    user_idol_group_score }|--|| idol_group : "belongs to"
    user_idol_group_score }|--|| group_otaku_layer : "belongs to (group layer)"
    group_otaku_layer ||--|{ user_idol_group_score : "has many"

    idol_group ||--|{ quizzes : "has many"
    quiz_difficulty ||--|{ quizzes : "has many"
    quizzes }|--|| idol_group : "belongs to"
    quizzes }|--|| quiz_difficulty : "belongs to"
    quizzes ||--|{ quiz_choices : "has many choices"
    quiz_choices }|--|| quizzes : "belongs to"

    app_user ||--|{ user_quiz_answers : "has many"
    user_quiz_answers }|--|| app_user : "belongs to"
    quizzes ||--|{ user_quiz_answers : "has many"
    user_quiz_answers }|--|| quizzes : "belongs to"

    app_user ||--|{ ranking_total : "has one total ranking entry"
    ranking_total }|--|| app_user : "belongs to"

    app_user ||--|{ ranking_group : "has many group ranking entries"
    ranking_group }|--|| app_user : "belongs to"
    idol_group ||--|{ ranking_group : "has many"
    ranking_group }|--|| idol_group : "belongs to"

    app_user ||--|{ event : "creates"
    event }|--|| app_user : "created by"

    event ||--|{ event_participation : "has many"
    event_participation }|--|| event : "belongs to"
    app_user ||--|{ event_participation : "participates in"
    event_participation }|--|| app_user : "belongs to"

    event ||--|{ event_group_participation : "has many participating groups"
    event_group_participation }|--|| event : "belongs to event"
    idol_group ||--|{ event_group_participation : "has many event participations"
    event_group_participation }|--|| idol_group : "belongs to idol group"

    app_user ||--|{ monthly_score_history : "has many monthly score entries"
    monthly_score_history }|--|| app_user : "belongs to"
```
