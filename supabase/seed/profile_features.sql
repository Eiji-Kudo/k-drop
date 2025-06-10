-- Seed data for profile features

-- Update existing user profiles with new profile fields
UPDATE user_profiles
SET 
  avatar_url = CASE app_user_id
    WHEN 1 THEN 'https://api.dicebear.com/7.x/avataaars/png?seed=user1'
    WHEN 2 THEN 'https://api.dicebear.com/7.x/avataaars/png?seed=user2'
    WHEN 3 THEN 'https://api.dicebear.com/7.x/avataaars/png?seed=user3'
    WHEN 4 THEN 'https://api.dicebear.com/7.x/avataaars/png?seed=user4'
    WHEN 5 THEN 'https://api.dicebear.com/7.x/avataaars/png?seed=user5'
    ELSE NULL
  END,
  nickname = CASE app_user_id
    WHEN 1 THEN 'K-Pop Master 🏆'
    WHEN 2 THEN 'BTS ARMY Forever 💜'
    WHEN 3 THEN 'BLINK & ONCE'
    WHEN 4 THEN 'Multi-stan Queen'
    WHEN 5 THEN 'NewJeans Bunny 🐰'
    ELSE NULL
  END,
  description = CASE app_user_id
    WHEN 1 THEN 'K-Pop enthusiast since 2015! I love all groups but BTS holds a special place in my heart. Always ready for comebacks and concerts! 🎵'
    WHEN 2 THEN 'Dedicated ARMY since 2017. Attended 5 BTS concerts and counting! Collector of albums and photocards. Let''s be friends! 💜'
    WHEN 3 THEN 'BLACKPINK and TWICE are my ult groups! Love dancing to K-Pop choreos. Concert-goer and photocard collector 📸'
    WHEN 4 THEN 'Stan talent, stan K-Pop! From 2nd gen to 4th gen, I love them all. Seventeen, Stray Kids, ENHYPEN, ATEEZ... the list goes on!'
    WHEN 5 THEN 'NewJeans changed my life! Also love IVE, LE SSERAFIM, and aespa. 4th gen stan ready to support all rookies! 🌟'
    ELSE NULL
  END,
  fan_since = CASE app_user_id
    WHEN 1 THEN '2015-03-15'
    WHEN 2 THEN '2017-06-13'
    WHEN 3 THEN '2018-11-05'
    WHEN 4 THEN '2016-08-20'
    WHEN 5 THEN '2022-07-22'
    ELSE NULL
  END,
  updated_at = NOW()
WHERE app_user_id <= 5;

-- Insert user favorite groups
INSERT INTO user_favorite_groups (app_user_id, idol_group_id, fan_since, created_at)
VALUES
  -- User 1 favorites
  (1, 1, '2015-03-15', NOW()), -- BTS
  (1, 2, '2016-08-08', NOW()), -- BLACKPINK
  (1, 3, '2015-10-20', NOW()), -- TWICE
  (1, 17, '2023-01-02', NOW()), -- SEVENTEEN
  
  -- User 2 favorites
  (2, 1, '2017-06-13', NOW()), -- BTS (main)
  (2, 8, '2021-11-12', NOW()), -- ENHYPEN
  
  -- User 3 favorites
  (3, 2, '2018-11-05', NOW()), -- BLACKPINK
  (3, 3, '2018-11-05', NOW()), -- TWICE
  (3, 4, '2023-03-27', NOW()), -- NewJeans
  (3, 11, '2022-05-02', NOW()), -- IVE
  
  -- User 4 favorites
  (4, 17, '2016-08-20', NOW()), -- SEVENTEEN
  (4, 5, '2018-03-25', NOW()), -- Stray Kids
  (4, 8, '2020-11-30', NOW()), -- ENHYPEN
  (4, 15, '2019-10-24', NOW()), -- ATEEZ
  (4, 6, '2019-03-04', NOW()), -- TXT
  
  -- User 5 favorites
  (5, 4, '2022-07-22', NOW()), -- NewJeans
  (5, 11, '2021-12-01', NOW()), -- IVE
  (5, 12, '2022-05-02', NOW()), -- LE SSERAFIM
  (5, 13, '2020-11-17', NOW()) -- aespa
ON CONFLICT (app_user_id, idol_group_id) DO NOTHING;

-- Insert daily score histories (last 7 days for each user)
INSERT INTO daily_score_histories (app_user_id, date, total_score, created_at)
VALUES
  -- User 1 (high scorer)
  (1, CURRENT_DATE - INTERVAL '6 days', 145, NOW()),
  (1, CURRENT_DATE - INTERVAL '5 days', 148, NOW()),
  (1, CURRENT_DATE - INTERVAL '4 days', 150, NOW()),
  (1, CURRENT_DATE - INTERVAL '3 days', 153, NOW()),
  (1, CURRENT_DATE - INTERVAL '2 days', 155, NOW()),
  (1, CURRENT_DATE - INTERVAL '1 day', 158, NOW()),
  (1, CURRENT_DATE, 160, NOW()),
  
  -- User 2 (steady progress)
  (2, CURRENT_DATE - INTERVAL '6 days', 82, NOW()),
  (2, CURRENT_DATE - INTERVAL '5 days', 84, NOW()),
  (2, CURRENT_DATE - INTERVAL '4 days', 85, NOW()),
  (2, CURRENT_DATE - INTERVAL '3 days', 87, NOW()),
  (2, CURRENT_DATE - INTERVAL '2 days', 88, NOW()),
  (2, CURRENT_DATE - INTERVAL '1 day', 89, NOW()),
  (2, CURRENT_DATE, 90, NOW()),
  
  -- User 3 (fluctuating)
  (3, CURRENT_DATE - INTERVAL '6 days', 72, NOW()),
  (3, CURRENT_DATE - INTERVAL '5 days', 70, NOW()),
  (3, CURRENT_DATE - INTERVAL '4 days', 73, NOW()),
  (3, CURRENT_DATE - INTERVAL '3 days', 71, NOW()),
  (3, CURRENT_DATE - INTERVAL '2 days', 74, NOW()),
  (3, CURRENT_DATE - INTERVAL '1 day', 73, NOW()),
  (3, CURRENT_DATE, 75, NOW()),
  
  -- User 4 (rapid growth)
  (4, CURRENT_DATE - INTERVAL '6 days', 100, NOW()),
  (4, CURRENT_DATE - INTERVAL '5 days', 105, NOW()),
  (4, CURRENT_DATE - INTERVAL '4 days', 108, NOW()),
  (4, CURRENT_DATE - INTERVAL '3 days', 112, NOW()),
  (4, CURRENT_DATE - INTERVAL '2 days', 115, NOW()),
  (4, CURRENT_DATE - INTERVAL '1 day', 118, NOW()),
  (4, CURRENT_DATE, 120, NOW()),
  
  -- User 5 (new user rapid progress)
  (5, CURRENT_DATE - INTERVAL '6 days', 15, NOW()),
  (5, CURRENT_DATE - INTERVAL '5 days', 22, NOW()),
  (5, CURRENT_DATE - INTERVAL '4 days', 28, NOW()),
  (5, CURRENT_DATE - INTERVAL '3 days', 35, NOW()),
  (5, CURRENT_DATE - INTERVAL '2 days', 42, NOW()),
  (5, CURRENT_DATE - INTERVAL '1 day', 48, NOW()),
  (5, CURRENT_DATE, 55, NOW())
ON CONFLICT (app_user_id, date) DO NOTHING;

-- Update user scores to match the latest daily score
UPDATE user_profiles p
SET total_otaku_score = d.total_score
FROM (
  SELECT app_user_id, total_score
  FROM daily_score_histories
  WHERE date = CURRENT_DATE
) d
WHERE p.app_user_id = d.app_user_id;

-- Display sample data
SELECT 
  p.app_user_id,
  p.user_name,
  p.nickname,
  p.description,
  p.fan_since,
  p.total_otaku_score,
  tl.layer_name as otaku_layer
FROM user_profiles p
LEFT JOIN total_otaku_layers tl ON p.total_otaku_layer_id = tl.total_otaku_layer_id
WHERE p.app_user_id <= 5
ORDER BY p.app_user_id;