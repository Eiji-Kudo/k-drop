-- events（created_by に依存）
INSERT INTO events (created_by, event_name, event_description, location, event_date, created_at, updated_at) VALUES
  (1, 'TWICEファンイベント', 'TWICEファンの交流会', '東京', '2025-05-01 12:00:00+09', NOW(), NOW());

-- event_participations（event_id, app_user_id に依存）
INSERT INTO event_participations (event_id, app_user_id, joined_at) VALUES
  (1, 1, NOW());

-- event_group_participations（event_id, idol_group_id に依存）
INSERT INTO event_group_participations (event_id, idol_group_id, registered_at) VALUES
  (1, 3, NOW());

-- monthly_score_histories（app_user_id に依存）
INSERT INTO monthly_score_histories (app_user_id, month, score_snapshot, updated_at) VALUES
  (1, '2025-04-01', 250, NOW()); 