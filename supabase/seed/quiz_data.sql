-- quizzes（idol_group_id, quiz_difficulty_id に依存）
INSERT INTO quizzes
  (idol_group_id, quiz_difficulty_id, prompt, explanation)
VALUES
  (3, 1, 'TWICEのデビュー曲は次のうちどれ？', '2015年12月20日にデビューした。'),
  (3, 1, 'TWICEは何人グループ？', '9人組グループでデビューした。'),
  (3, 2, 'TWICEのマンネは次のうちだれ？', 'ツウィは1999年6月14日生まれのグループで最年少メンバー。'),
  (3, 2, 'TWICEを生んだサバイバル番組の名称は？', 'SIXTEENは2015年に放送された女性練習生16人によるサバイバル番組。'),
  (2, 1, 'BTSのデビュー曲は次のうちどれ？', '2013年6月13日にデビュー。'),
  (2, 1, 'BTSは何人グループ？', '7人組グループでデビュー。'),
  (2, 1, 'BTSのマンネは次のうちだれ？', 'グクは1997年9月1日生まれのグループで最年少メンバー。');

-- quiz_choices（quiz_id に依存）
INSERT INTO quiz_choices (quiz_id, choice_text, is_correct) VALUES
  -- Quiz 1: TWICEのデビュー曲
  (1, 'Like OOH-AHH', true),
  (1, 'CHEER UP', false),
  (1, 'TT', false),
  (1, 'SIGNAL', false),
  
  -- Quiz 2: TWICEは何人
  (2, '9', true),
  (2, '7', false),
  (2, '8', false),
  (2, '10', false),
  
  -- Quiz 3: TWICEのマンネ
  (3, 'ツウィ', true),
  (3, 'チェヨン', false),
  (3, 'ダヒョン', false),
  (3, 'ミナ', false),
  
  -- Quiz 4: サバイバル番組
  (4, 'SIXTEEN', true),
  (4, 'SEVENTEEN', false),
  (4, 'EIGHTEEN', false),
  (4, 'NINETEEN', false),
  
  -- Quiz 5: BTSのデビュー曲
  (5, 'NO MORE DREAM', true),
  (5, 'Butter', false),
  (5, 'Dynamite', false),
  (5, 'MIC Drop', false),
  
  -- Quiz 6: BTSは何人
  (6, '7', true),
  (6, '5', false),
  (6, '6', false),
  (6, '8', false),
  
  -- Quiz 7: BTSのマンネ
  (7, 'グク', true),
  (7, 'テテ', false),
  (7, 'ジミン', false),
  (7, 'ジン', false); 