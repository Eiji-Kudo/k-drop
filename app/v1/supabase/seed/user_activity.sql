-- user_idol_group_scores（app_user_id, idol_group_id に依存）
INSERT INTO user_idol_group_scores (app_user_id, idol_group_id, otaku_score, group_otaku_layer_id) VALUES
  (1, 2, 150, 2),
  (1, 3, 100, 1);

-- user_quiz_answers（app_user_id, quiz_id に依存）
INSERT INTO user_quiz_answers (app_user_id, quiz_id, selected_choice, is_correct, answered_at) VALUES
  (1, 1, 1, true,  NOW()),
  (1, 2, 1, true,  NOW());

-- ranking_totals（app_user_id に依存）
INSERT INTO ranking_totals (app_user_id, display_rank, display_score, updated_at) VALUES
  (1, 1, 250, NOW());

-- ranking_groups（app_user_id, idol_group_id に依存）
INSERT INTO ranking_groups (app_user_id, idol_group_id, display_rank, display_score, updated_at) VALUES
  (1, 2, 1, 150, NOW()),
  (1, 3, 2, 100, NOW()); 