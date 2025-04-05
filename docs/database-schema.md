# データベーススキーマ

## エンティティ関連図

```mermaid
erDiagram
    group_category {
        int group_category_id PK NOT NULL
        string category_name NOT NULL
    }
    idol_group {
        int idol_group_id PK NOT NULL
        int group_category_id FK NOT NULL
        string idol_group_name NOT NULL
        text thumbnail_image NULL
    }
    app_user {
        int app_user_id PK NOT NULL
        uuid supabase_uuid NOT NULL "Supabaseで発行されたUUID"
        string line_account_id NOT NULL
    }
    user_profile {
        int user_profile_id PK NOT NULL
        int app_user_id FK NOT NULL
        string user_name NOT NULL
        int total_otaku_score NOT NULL "総合オタク力"
        int remaining_drop NOT NULL "所持中のドロップ数"
        int total_otaku_layer_id FK NOT NULL "総合オタクレイヤー"
    }
    total_otaku_layer {
        int total_otaku_layer_id PK NOT NULL
        string layer_name NOT NULL
        int min_score NOT NULL
        int max_score NOT NULL
    }
    group_otaku_layer {
        int group_otaku_layer_id PK NOT NULL
        string layer_name NOT NULL
        int min_score NOT NULL
        int max_score NOT NULL
    }
    user_idol_group_score {
        int user_idol_group_score_id PK NOT NULL
        int app_user_id FK NOT NULL
        int idol_group_id FK NOT NULL
        int otaku_score NOT NULL
        int group_otaku_layer_id FK NOT NULL "グループ別オタクレイヤー"
    }
    quiz_difficulty {
        int quiz_difficulty_id PK NOT NULL
        string difficulty_name NOT NULL
    }
    quiz_question {
        int quiz_question_id PK NOT NULL
        int idol_group_id FK NOT NULL
        int quiz_difficulty_id FK NOT NULL
        text question_text NOT NULL
        string choice1 NOT NULL
        string choice2 NOT NULL
        string choice3 NOT NULL
        string choice4 NOT NULL
        int correct_choice NOT NULL
        text explanation NOT NULL
    }
    user_quiz_answer {
        int user_quiz_answer_id PK NOT NULL
        int app_user_id FK NOT NULL
        int quiz_question_id FK NOT NULL
        int selected_choice NOT NULL
        boolean is_correct NOT NULL
        datetime answered_at NOT NULL
    }
    ranking_total {
        int ranking_total_id PK NOT NULL
        int app_user_id FK NOT NULL
        int display_rank NOT NULL "実際の総合順位"
        int display_score NOT NULL "バッチ計算時点の総合スコア"
        datetime updated_at NOT NULL
    }
    ranking_group {
        int ranking_group_id PK NOT NULL
        int app_user_id FK NOT NULL
        int idol_group_id FK NOT NULL
        int display_rank NOT NULL "実際のグループ順位"
        int display_score NOT NULL "バッチ計算時点のグループ別スコア"
        datetime updated_at NOT NULL
    }
    event {
        int event_id PK NOT NULL
        int created_by FK NOT NULL "イベント作成者(app_user_id)"
        string event_name NOT NULL
        text event_description NOT NULL
        string location NOT NULL
        datetime event_date NOT NULL
        datetime created_at NOT NULL
        datetime updated_at NOT NULL
    }
    event_participation {
        int event_participation_id PK NOT NULL
        int event_id FK NOT NULL
        int app_user_id FK NOT NULL
        datetime joined_at NOT NULL
    }
    event_group_participation {
        int event_group_participation_id PK NOT NULL
        int event_id FK NOT NULL
        int idol_group_id FK NOT NULL
        datetime registered_at NOT NULL "グループ参加登録日時"
    }
```
