-- app_users
INSERT INTO app_users (supabase_uuid, line_account_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'line_id_1');

-- user_profiles（app_user_id に依存）
INSERT INTO user_profiles (app_user_id, user_name, total_otaku_score, remaining_drop, total_otaku_layer_id) VALUES
  (1, 'テストユーザー', 250, 10, 3); 