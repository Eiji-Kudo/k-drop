-- Seed data for profile features

-- Update existing user profile with new profile fields
UPDATE user_profiles
SET 
  avatar_url = 'https://api.dicebear.com/7.x/avataaars/png?seed=user1',
  nickname = 'K-Pop Master 🏆',
  description = 'K-Pop enthusiast since 2015! I love all groups but BTS holds a special place in my heart. Always ready for comebacks and concerts! 🎵',
  fan_since = '2015-03-15'::date,
  updated_at = NOW()
WHERE app_user_id = 1;

-- Insert user favorite groups (only for user 1)
INSERT INTO user_favorite_groups (app_user_id, idol_group_id, fan_since, created_at)
VALUES
  (1, 2, '2015-03-15', NOW()), -- BTS
  (1, 3, '2015-10-20', NOW()) -- TWICE
ON CONFLICT (app_user_id, idol_group_id) DO NOTHING;

-- Insert daily score histories (last 7 days for user 1)
INSERT INTO daily_score_histories (app_user_id, date, total_score, created_at)
VALUES
  (1, CURRENT_DATE - INTERVAL '6 days', 245, NOW()),
  (1, CURRENT_DATE - INTERVAL '5 days', 248, NOW()),
  (1, CURRENT_DATE - INTERVAL '4 days', 246, NOW()),
  (1, CURRENT_DATE - INTERVAL '3 days', 249, NOW()),
  (1, CURRENT_DATE - INTERVAL '2 days', 247, NOW()),
  (1, CURRENT_DATE - INTERVAL '1 day', 252, NOW()),
  (1, CURRENT_DATE, 250, NOW())
ON CONFLICT (app_user_id, date) DO NOTHING;

-- Note: total_otaku_score for user 1 is already set to 250 in user_base.sql