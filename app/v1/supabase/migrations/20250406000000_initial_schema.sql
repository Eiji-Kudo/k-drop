CREATE TABLE total_otaku_layer (
  total_otaku_layer_id SERIAL PRIMARY KEY,
  layer_name TEXT NOT NULL,
  min_score INT NOT NULL,
  max_score INT NOT NULL
);

CREATE TABLE group_category (
  group_category_id SERIAL PRIMARY KEY,
  category_name TEXT NOT NULL
);

CREATE TABLE idol_group (
  idol_group_id SERIAL PRIMARY KEY,
  group_category_id INT NOT NULL,
  idol_group_name TEXT NOT NULL,
  thumbnail_image TEXT,
  CONSTRAINT fk_group_category FOREIGN KEY (group_category_id) REFERENCES group_category(group_category_id)
);

CREATE TABLE app_user (
  app_user_id SERIAL PRIMARY KEY,
  supabase_uuid UUID NOT NULL,
  line_account_id TEXT NOT NULL
);

CREATE TABLE user_profile (
  user_profile_id SERIAL PRIMARY KEY,
  app_user_id INT NOT NULL,
  user_name TEXT NOT NULL,
  total_otaku_score INT NOT NULL,
  remaining_drop INT NOT NULL,
  total_otaku_layer_id INT NOT NULL,
  CONSTRAINT fk_app_user FOREIGN KEY (app_user_id) REFERENCES app_user(app_user_id),
  CONSTRAINT fk_total_otaku_layer FOREIGN KEY (total_otaku_layer_id) REFERENCES total_otaku_layer(total_otaku_layer_id)
);

CREATE TABLE group_otaku_layer (
  group_otaku_layer_id SERIAL PRIMARY KEY,
  layer_name TEXT NOT NULL,
  min_score INT NOT NULL,
  max_score INT NOT NULL
);

CREATE TABLE user_idol_group_score (
  user_idol_group_score_id SERIAL PRIMARY KEY,
  app_user_id INT NOT NULL,
  idol_group_id INT NOT NULL,
  otaku_score INT NOT NULL,
  group_otaku_layer_id INT NOT NULL,
  CONSTRAINT fk_user_idol_app_user FOREIGN KEY (app_user_id) REFERENCES app_user(app_user_id),
  CONSTRAINT fk_user_idol_idol_group FOREIGN KEY (idol_group_id) REFERENCES idol_group(idol_group_id),
  CONSTRAINT fk_user_idol_group_otaku_layer FOREIGN KEY (group_otaku_layer_id) REFERENCES group_otaku_layer(group_otaku_layer_id)
);

CREATE TABLE quiz_difficulty (
  quiz_difficulty_id SERIAL PRIMARY KEY,
  difficulty_name TEXT NOT NULL
);

CREATE TABLE quiz_question (
  quiz_question_id SERIAL PRIMARY KEY,
  idol_group_id INT NOT NULL,
  quiz_difficulty_id INT NOT NULL,
  question_text TEXT NOT NULL,
  choice1 TEXT NOT NULL,
  choice2 TEXT NOT NULL,
  choice3 TEXT NOT NULL,
  choice4 TEXT NOT NULL,
  correct_choice INT NOT NULL,
  explanation TEXT NOT NULL,
  CONSTRAINT fk_quiz_question_idol_group FOREIGN KEY (idol_group_id) REFERENCES idol_group(idol_group_id),
  CONSTRAINT fk_quiz_question_quiz_difficulty FOREIGN KEY (quiz_difficulty_id) REFERENCES quiz_difficulty(quiz_difficulty_id)
);

CREATE TABLE user_quiz_answer (
  user_quiz_answer_id SERIAL PRIMARY KEY,
  app_user_id INT NOT NULL,
  quiz_question_id INT NOT NULL,
  selected_choice INT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMPTZ NOT NULL,
  CONSTRAINT fk_user_quiz_app_user FOREIGN KEY (app_user_id) REFERENCES app_user(app_user_id),
  CONSTRAINT fk_user_quiz_question FOREIGN KEY (quiz_question_id) REFERENCES quiz_question(quiz_question_id)
);

CREATE TABLE ranking_total (
  ranking_total_id SERIAL PRIMARY KEY,
  app_user_id INT NOT NULL,
  display_rank INT NOT NULL,
  display_score INT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  CONSTRAINT fk_ranking_total_app_user FOREIGN KEY (app_user_id) REFERENCES app_user(app_user_id)
);

CREATE TABLE ranking_group (
  ranking_group_id SERIAL PRIMARY KEY,
  app_user_id INT NOT NULL,
  idol_group_id INT NOT NULL,
  display_rank INT NOT NULL,
  display_score INT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  CONSTRAINT fk_ranking_group_app_user FOREIGN KEY (app_user_id) REFERENCES app_user(app_user_id),
  CONSTRAINT fk_ranking_group_idol_group FOREIGN KEY (idol_group_id) REFERENCES idol_group(idol_group_id)
);

CREATE TABLE event (
  event_id SERIAL PRIMARY KEY,
  created_by INT NOT NULL,
  event_name TEXT NOT NULL,
  event_description TEXT NOT NULL,
  location TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  CONSTRAINT fk_event_created_by FOREIGN KEY (created_by) REFERENCES app_user(app_user_id)
);

CREATE TABLE event_participation (
  event_participation_id SERIAL PRIMARY KEY,
  event_id INT NOT NULL,
  app_user_id INT NOT NULL,
  joined_at TIMESTAMPTZ NOT NULL,
  CONSTRAINT fk_event_participation_event FOREIGN KEY (event_id) REFERENCES event(event_id),
  CONSTRAINT fk_event_participation_app_user FOREIGN KEY (app_user_id) REFERENCES app_user(app_user_id)
);

CREATE TABLE event_group_participation (
  event_group_participation_id SERIAL PRIMARY KEY,
  event_id INT NOT NULL,
  idol_group_id INT NOT NULL,
  registered_at TIMESTAMPTZ NOT NULL,
  CONSTRAINT fk_event_group_event FOREIGN KEY (event_id) REFERENCES event(event_id),
  CONSTRAINT fk_event_group_idol_group FOREIGN KEY (idol_group_id) REFERENCES idol_group(idol_group_id)
);

CREATE TABLE monthly_score_history (
  monthly_score_history_id SERIAL PRIMARY KEY,
  app_user_id INT NOT NULL,
  month TIMESTAMPTZ NOT NULL,
  score_snapshot INT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  CONSTRAINT fk_monthly_score_app_user FOREIGN KEY (app_user_id) REFERENCES app_user(app_user_id)
); 