-- total_otaku_layers
INSERT INTO total_otaku_layers (layer_name, min_score, max_score) VALUES
  ('ミーハーオタク', 0, 100),
  ('見習いオタク', 101, 200),
  ('初心者オタク', 201, 300),
  ('沼落ちオタク', 301, 400),
  ('ガチオタク', 401, 500),
  ('現場主オタク', 501, 600),
  ('箱推しオタク', 601, 700),
  ('遠征オタク', 701, 800),
  ('超熱狂オタク', 801, 900),
  ('神推しオタク', 901, 1000);

-- group_categories
INSERT INTO group_categories (category_name) VALUES
  ('K-Pop');

-- idol_groups
INSERT INTO idol_groups (group_category_id, idol_group_name, thumbnail_image) VALUES
  (1, '所属なし',   NULL),
  (1, 'BTS',       'https://example.com/bts.jpg'),
  (1, 'TWICE',     'https://example.com/twice.jpg');

-- group_otaku_layers
INSERT INTO group_otaku_layers (layer_name, min_score, max_score) VALUES
  ('ミーハーオタク', 0,   20),
  ('見習いオタク',   21,  40),
  ('初心者オタク',   41,  60),
  ('沼落ちオタク',   61,  80),
  ('ガチオタク',     81,  100),
  ('現場主オタク',   101, 120),
  ('箱推しオタク',   121, 140),
  ('遠征オタク',     141, 160),
  ('超熱狂オタク',   161, 180),
  ('神推しオタク',   181, 200);

-- quiz_difficulties
INSERT INTO quiz_difficulties (difficulty_name) VALUES
  ('初級'),
  ('中級'),
  ('上級'),
  ('超上級');

-- quizzes
INSERT INTO quizzes
  (idol_group_id, quiz_difficulty_id, prompt, choice1, choice2, choice3, choice4, correct_choice, explanation)
VALUES
  (3, 1, 'TWICEのデビュー曲は次のうちどれ？',        'Like OOH-AHH', 'CHEER UP',  'TT',      'SIGNAL',   1, '2015年12月20日にデビューした。'),
  (3, 1, 'TWICEは何人グループ？',                    '9',            '7',         '8',       '10',       1, '9人組グループでデビューした。'),
  (3, 2, 'TWICEのマンネは次のうちだれ？',            'ツウィ',       'チェヨン',   'ダヒョン', 'ミナ',     1, 'ツウィは1999年6月14日生まれのグループで最年少メンバー。'),
  (3, 2, 'TWICEを生んだサバイバル番組の名称は？',      'SIXTEEN',      'SEVENTEEN', 'EIGHTEEN', 'NINETEEN', 1, 'SIXTEENは2015年に放送された女性練習生16人によるサバイバル番組。'),
  (2, 1, 'BTSのデビュー曲は次のうちどれ？',          'NO MORE DREAM','Butter',    'Dynamite','MIC Drop', 1, '2013年6月13日にデビュー。'),
  (2, 1, 'BTSは何人グループ？',                      '7',            '5',         '6',       '8',        1, '7人組グループでデビュー。'),
  (2, 1, 'BTSのマンネは次のうちだれ？',              'グク',         'テテ',       'ジミン',   'ジン',     1, 'グクは1997年9月1日生まれのグループで最年少メンバー。');

-- app_users
INSERT INTO app_users (supabase_uuid, line_account_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'line_id_1');

-- user_profiles
INSERT INTO user_profiles (app_user_id, user_name, total_otaku_score, remaining_drop, total_otaku_layer_id) VALUES
  (1, 'テストユーザー', 250, 10, 3);

-- user_idol_group_scores
INSERT INTO user_idol_group_scores (app_user_id, idol_group_id, otaku_score, group_otaku_layer_id) VALUES
  (1, 2, 150, 2),
  (1, 3, 100, 1);

-- user_quiz_answers
INSERT INTO user_quiz_answers (app_user_id, quiz_id, selected_choice, is_correct, answered_at) VALUES
  (1, 1, 1, true,  NOW()),
  (1, 2, 1, true,  NOW());

-- ranking_totals
INSERT INTO ranking_totals (app_user_id, display_rank, display_score, updated_at) VALUES
  (1, 1, 250, NOW());

-- ranking_groups
INSERT INTO ranking_groups (app_user_id, idol_group_id, display_rank, display_score, updated_at) VALUES
  (1, 2, 1, 150, NOW()),
  (1, 3, 2, 100, NOW());

-- events
INSERT INTO events (created_by, event_name, event_description, location, event_date, created_at, updated_at) VALUES
  (1, 'TWICEファンイベント', 'TWICEファンの交流会', '東京', '2025-05-01 12:00:00+09', NOW(), NOW());

-- event_participations
INSERT INTO event_participations (event_id, app_user_id, joined_at) VALUES
  (1, 1, NOW());

-- event_group_participations
INSERT INTO event_group_participations (event_id, idol_group_id, registered_at) VALUES
  (1, 3, NOW());

-- monthly_score_histories
INSERT INTO monthly_score_histories (app_user_id, month, score_snapshot, updated_at) VALUES
  (1, '2025-04-01', 250, NOW());