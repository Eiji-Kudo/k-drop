# Otaku Power (オタク力) ER Diagram

## Overview

This document describes the database schema for managing otaku power scores and quiz results in the K-Drop application.

## ER Diagram

```mermaid
erDiagram
    app_users ||--|| user_profiles : has
    app_users ||--o{ user_quiz_answers : answers
    app_users ||--o{ user_idol_group_scores : has
    app_users ||--o{ ranking_totals : has
    app_users ||--o{ ranking_groups : has
    app_users ||--o{ monthly_score_histories : has

    user_profiles ||--|| total_otaku_layers : belongs_to

    user_idol_group_scores ||--|| idol_groups : for
    user_idol_group_scores ||--|| group_otaku_layers : belongs_to

    ranking_groups ||--|| idol_groups : for

    quizzes ||--|| idol_groups : belongs_to
    quizzes ||--|| quiz_difficulties : has
    quizzes ||--o{ quiz_choices : has
    quizzes ||--o{ user_quiz_answers : answered_by

    idol_groups ||--|| group_categories : belongs_to

    app_users {
        int app_user_id PK
        string supabase_uuid
        string line_account_id
    }

    user_profiles {
        int user_profile_id PK
        int app_user_id FK
        string user_name
        int total_otaku_score
        int total_otaku_layer_id FK
        int remaining_drop
    }

    user_idol_group_scores {
        int user_idol_group_score_id PK
        int app_user_id FK
        int idol_group_id FK
        int otaku_score
        int group_otaku_layer_id FK
    }

    total_otaku_layers {
        int total_otaku_layer_id PK
        string layer_name
        int min_score
        int max_score
    }

    group_otaku_layers {
        int group_otaku_layer_id PK
        string layer_name
        int min_score
        int max_score
    }

    ranking_totals {
        int ranking_total_id PK
        int app_user_id FK
        int display_score
        int display_rank
        timestamp updated_at
    }

    ranking_groups {
        int ranking_group_id PK
        int app_user_id FK
        int idol_group_id FK
        int display_score
        int display_rank
        timestamp updated_at
    }

    monthly_score_histories {
        int monthly_score_history_id PK
        int app_user_id FK
        string month
        int score_snapshot
        timestamp updated_at
    }

    quizzes {
        int quiz_id PK
        int idol_group_id FK
        int quiz_difficulty_id FK
        string prompt
        string explanation
    }

    quiz_choices {
        int quiz_choice_id PK
        int quiz_id FK
        string choice_text
        boolean is_correct
    }

    user_quiz_answers {
        int user_quiz_answer_id PK
        int app_user_id FK
        int quiz_id FK
        int selected_choice
        boolean is_correct
        timestamp answered_at
    }

    idol_groups {
        int idol_group_id PK
        string idol_group_name
        int group_category_id FK
        string thumbnail_image
    }

    group_categories {
        int group_category_id PK
        string category_name
    }

    quiz_difficulties {
        int quiz_difficulty_id PK
        string difficulty_name
    }
```

## Data Flow When User Completes a Quiz

### 1. Quiz Answer Storage

When a user answers a quiz question:

1. A new record is created in `user_quiz_answers` with:
   - `app_user_id`: The user who answered
   - `quiz_id`: The quiz that was answered
   - `selected_choice`: The choice ID selected by the user
   - `is_correct`: Whether the answer was correct
   - `answered_at`: Timestamp of when the answer was submitted

### 2. Score Calculation and Updates

After completing a quiz session (multiple questions):

#### 2.1 Group-Specific Scores

- Update `user_idol_group_scores` for the relevant idol group
- Calculate new `otaku_score` based on correct/incorrect answers
- Update `group_otaku_layer_id` if score crosses layer thresholds

#### 2.2 Total Otaku Score

- Update `user_profiles.total_otaku_score` with the aggregate score
- Update `total_otaku_layer_id` if total score crosses layer boundaries

#### 2.3 Rankings Update

- Recalculate and update `ranking_totals` for overall ranking
- Recalculate and update `ranking_groups` for group-specific ranking
- Both include `display_score` and `display_rank` with timestamps

#### 2.4 Monthly History

- At the end of each month, create/update `monthly_score_histories`
- Store snapshot of current score for historical tracking

## Score Calculation Logic

### Points System

- Correct answer: +X points (varies by difficulty)
- Incorrect answer: 0 or -Y points (configurable)
- Difficulty multiplier from `quiz_difficulties` table

### Layer System

- Both total and group-specific layers define score ranges
- Users progress through layers as their scores increase
- Example layers: "初心者" (0-100), "中級者" (101-500), "上級者" (501+)

## Key Relationships

1. **User → Scores**: One user has one total score and multiple group scores
2. **Quiz → Answer**: Each quiz answer links a user, quiz, and their response
3. **Score → Layer**: Scores determine which layer/level a user belongs to
4. **Score → Ranking**: Scores determine user rankings both overall and per group
5. **Quiz → Group**: Each quiz belongs to a specific idol group for targeted scoring
