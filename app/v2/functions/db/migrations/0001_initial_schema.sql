CREATE TABLE users (
  user_id TEXT PRIMARY KEY,
  status TEXT NOT NULL CHECK (status IN ('active', 'suspended', 'deleted')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE auth_identities (
  auth_identity_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  provider_subject_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (provider, provider_subject_id)
);

CREATE TABLE user_profiles (
  user_id TEXT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
  handle TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  fan_since TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE group_categories (
  group_category_id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  category_name TEXT NOT NULL,
  sort_order INTEGER NOT NULL
);

CREATE TABLE idol_groups (
  idol_group_id TEXT PRIMARY KEY,
  group_category_id TEXT NOT NULL REFERENCES group_categories(group_category_id),
  slug TEXT NOT NULL UNIQUE,
  group_name TEXT NOT NULL,
  thumbnail_url TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'archived')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE user_favorite_groups (
  user_favorite_group_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  idol_group_id TEXT NOT NULL REFERENCES idol_groups(idol_group_id) ON DELETE CASCADE,
  started_supporting_on TEXT,
  created_at TEXT NOT NULL,
  UNIQUE (user_id, idol_group_id)
);

CREATE TABLE quizzes (
  quiz_id TEXT PRIMARY KEY,
  idol_group_id TEXT NOT NULL REFERENCES idol_groups(idol_group_id) ON DELETE CASCADE,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'normal', 'hard')),
  status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'archived')),
  prompt TEXT NOT NULL,
  explanation TEXT,
  published_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE quiz_choices (
  quiz_choice_id TEXT PRIMARY KEY,
  quiz_id TEXT NOT NULL REFERENCES quizzes(quiz_id) ON DELETE CASCADE,
  choice_order INTEGER NOT NULL CHECK (choice_order >= 1),
  choice_text TEXT NOT NULL,
  is_correct INTEGER NOT NULL CHECK (is_correct IN (0, 1)),
  UNIQUE (quiz_id, choice_order)
);

CREATE TABLE score_tiers (
  score_tier_id TEXT PRIMARY KEY,
  tier_scope TEXT NOT NULL CHECK (tier_scope IN ('overall', 'group')),
  tier_name TEXT NOT NULL,
  min_score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  sort_order INTEGER NOT NULL,
  CHECK (min_score <= max_score),
  UNIQUE (tier_scope, tier_name)
);

CREATE TABLE quiz_sessions (
  quiz_session_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  idol_group_id TEXT NOT NULL REFERENCES idol_groups(idol_group_id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  total_question_count INTEGER NOT NULL CHECK (total_question_count >= 0),
  answered_question_count INTEGER NOT NULL CHECK (answered_question_count >= 0),
  correct_answer_count INTEGER NOT NULL CHECK (correct_answer_count >= 0),
  incorrect_answer_count INTEGER NOT NULL CHECK (incorrect_answer_count >= 0),
  current_question_order INTEGER,
  started_at TEXT NOT NULL,
  last_answered_at TEXT,
  completed_at TEXT,
  CHECK (answered_question_count <= total_question_count),
  CHECK (correct_answer_count + incorrect_answer_count = answered_question_count),
  CHECK (current_question_order IS NULL OR current_question_order >= 1)
);

CREATE UNIQUE INDEX quiz_sessions_in_progress_per_user_group
  ON quiz_sessions (user_id, idol_group_id)
  WHERE status = 'in_progress';

CREATE TABLE quiz_session_questions (
  quiz_session_question_id TEXT PRIMARY KEY,
  quiz_session_id TEXT NOT NULL REFERENCES quiz_sessions(quiz_session_id) ON DELETE CASCADE,
  quiz_id TEXT NOT NULL REFERENCES quizzes(quiz_id) ON DELETE CASCADE,
  question_order INTEGER NOT NULL CHECK (question_order >= 1),
  created_at TEXT NOT NULL,
  UNIQUE (quiz_session_id, question_order),
  UNIQUE (quiz_session_id, quiz_id)
);

CREATE TABLE quiz_answers (
  quiz_answer_id TEXT PRIMARY KEY,
  quiz_session_question_id TEXT NOT NULL REFERENCES quiz_session_questions(quiz_session_question_id) ON DELETE CASCADE,
  quiz_choice_id TEXT NOT NULL REFERENCES quiz_choices(quiz_choice_id),
  awarded_score INTEGER NOT NULL CHECK (awarded_score >= 0),
  answered_at TEXT NOT NULL,
  UNIQUE (quiz_session_question_id)
);

CREATE TABLE user_score_states (
  user_score_state_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  score_scope TEXT NOT NULL CHECK (score_scope IN ('overall', 'group')),
  idol_group_id TEXT REFERENCES idol_groups(idol_group_id) ON DELETE CASCADE,
  score_tier_id TEXT NOT NULL REFERENCES score_tiers(score_tier_id),
  score_total INTEGER NOT NULL CHECK (score_total >= 0),
  answered_count INTEGER NOT NULL CHECK (answered_count >= 0),
  correct_count INTEGER NOT NULL CHECK (correct_count >= 0),
  last_answered_at TEXT,
  updated_at TEXT NOT NULL,
  CHECK (correct_count <= answered_count),
  CHECK ((score_scope = 'overall' AND idol_group_id IS NULL) OR (score_scope = 'group' AND idol_group_id IS NOT NULL))
);

CREATE UNIQUE INDEX user_score_states_overall_scope
  ON user_score_states (user_id, score_scope)
  WHERE idol_group_id IS NULL;

CREATE UNIQUE INDEX user_score_states_group_scope
  ON user_score_states (user_id, score_scope, idol_group_id)
  WHERE idol_group_id IS NOT NULL;

CREATE TABLE drop_wallets (
  user_id TEXT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
  balance INTEGER NOT NULL CHECK (balance >= 0),
  updated_at TEXT NOT NULL
);

CREATE TABLE drop_transactions (
  drop_transaction_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  delta INTEGER NOT NULL CHECK (delta <> 0),
  reason TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source_id TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE events (
  event_id TEXT PRIMARY KEY,
  created_by_user_id TEXT NOT NULL REFERENCES users(user_id),
  title TEXT NOT NULL,
  description TEXT,
  venue_name TEXT,
  visibility TEXT NOT NULL CHECK (visibility IN ('public', 'private', 'unlisted')),
  capacity INTEGER CHECK (capacity IS NULL OR capacity > 0),
  starts_at TEXT NOT NULL,
  ends_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  CHECK (ends_at >= starts_at)
);

CREATE TABLE event_groups (
  event_group_id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  idol_group_id TEXT NOT NULL REFERENCES idol_groups(idol_group_id) ON DELETE CASCADE,
  created_at TEXT NOT NULL,
  UNIQUE (event_id, idol_group_id)
);

CREATE TABLE event_participants (
  event_participant_id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  participation_status TEXT NOT NULL CHECK (participation_status IN ('joined', 'waitlisted', 'cancelled')),
  joined_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (event_id, user_id)
);

CREATE TABLE leaderboard_snapshots (
  leaderboard_snapshot_id TEXT PRIMARY KEY,
  leaderboard_scope TEXT NOT NULL CHECK (leaderboard_scope IN ('overall', 'group')),
  idol_group_id TEXT REFERENCES idol_groups(idol_group_id) ON DELETE CASCADE,
  snapshot_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  CHECK ((leaderboard_scope = 'overall' AND idol_group_id IS NULL) OR (leaderboard_scope = 'group' AND idol_group_id IS NOT NULL))
);

CREATE TABLE leaderboard_entries (
  leaderboard_entry_id TEXT PRIMARY KEY,
  leaderboard_snapshot_id TEXT NOT NULL REFERENCES leaderboard_snapshots(leaderboard_snapshot_id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  display_rank INTEGER NOT NULL CHECK (display_rank >= 1),
  display_score INTEGER NOT NULL CHECK (display_score >= 0),
  UNIQUE (leaderboard_snapshot_id, user_id),
  UNIQUE (leaderboard_snapshot_id, display_rank)
);

CREATE TABLE user_score_snapshots (
  user_score_snapshot_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  score_scope TEXT NOT NULL CHECK (score_scope IN ('overall', 'group')),
  idol_group_id TEXT REFERENCES idol_groups(idol_group_id) ON DELETE CASCADE,
  snapshot_date TEXT NOT NULL,
  score_total INTEGER NOT NULL CHECK (score_total >= 0),
  created_at TEXT NOT NULL,
  CHECK ((score_scope = 'overall' AND idol_group_id IS NULL) OR (score_scope = 'group' AND idol_group_id IS NOT NULL))
);

CREATE UNIQUE INDEX user_score_snapshots_overall_scope
  ON user_score_snapshots (user_id, score_scope, snapshot_date)
  WHERE idol_group_id IS NULL;

CREATE UNIQUE INDEX user_score_snapshots_group_scope
  ON user_score_snapshots (user_id, score_scope, idol_group_id, snapshot_date)
  WHERE idol_group_id IS NOT NULL;

CREATE INDEX auth_identities_user_id_idx ON auth_identities (user_id);
CREATE INDEX idol_groups_group_category_id_idx ON idol_groups (group_category_id);
CREATE INDEX user_favorite_groups_idol_group_id_idx ON user_favorite_groups (idol_group_id);
CREATE INDEX quizzes_idol_group_id_idx ON quizzes (idol_group_id);
CREATE INDEX quiz_choices_quiz_id_idx ON quiz_choices (quiz_id);
CREATE INDEX quiz_sessions_user_id_idx ON quiz_sessions (user_id);
CREATE INDEX quiz_sessions_idol_group_id_idx ON quiz_sessions (idol_group_id);
CREATE INDEX quiz_session_questions_quiz_id_idx ON quiz_session_questions (quiz_id);
CREATE INDEX quiz_answers_quiz_choice_id_idx ON quiz_answers (quiz_choice_id);
CREATE INDEX user_score_states_score_tier_id_idx ON user_score_states (score_tier_id);
CREATE INDEX drop_transactions_user_id_idx ON drop_transactions (user_id, created_at);
CREATE INDEX events_created_by_user_id_idx ON events (created_by_user_id);
CREATE INDEX event_groups_idol_group_id_idx ON event_groups (idol_group_id);
CREATE INDEX event_participants_user_id_idx ON event_participants (user_id);
CREATE INDEX leaderboard_snapshots_idol_group_id_idx ON leaderboard_snapshots (idol_group_id);
CREATE INDEX leaderboard_entries_user_id_idx ON leaderboard_entries (user_id);
CREATE INDEX user_score_snapshots_user_id_idx ON user_score_snapshots (user_id, snapshot_date);
