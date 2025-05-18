-- quizzes（idol_group_id, quiz_difficulty_id に依存）
INSERT INTO quizzes
  (idol_group_id, quiz_difficulty_id, prompt, explanation)
VALUES
  -- TWICE (idol_group_id: 3) クイズ
  (3, 1, 'TWICEのデビュー曲は次のうちどれ？', '2015年12月20日にデビューした。'),
  (3, 1, 'TWICEは何人グループ？', '9人組グループでデビューした。'),
  (3, 2, 'TWICEのマンネは次のうちだれ？', 'ツウィは1999年6月14日生まれのグループで最年少メンバー。'),
  (3, 2, 'TWICEを生んだサバイバル番組の名称は？', 'SIXTEENは2015年に放送された女性練習生16人によるサバイバル番組。'),
  (3, 2, 'TWICEの国籍が最も多い国はどこ？', '韓国（ナヨン、ジョンヨン、ジヒョ、ダヒョン、チェヨン）、日本（モモ、サナ、ミナ）、台湾（ツウィ）のメンバーで構成されている。'),
  (3, 2, 'TWICEのファンダムの名称は？', 'ONCEはTWICEに対して「TWICEが一度ファンを幸せにしたら、ファンも二度幸せにしてあげる」という意味が込められている。'),
  (3, 3, 'TWICEの日本人メンバーは次のうち誰？', 'モモ、サナ、ミナの3人が日本出身メンバー。'),
  (3, 3, 'TWICEの「Feel Special」のミュージックビデオでセンターを務めたメンバーは？', 'ナヨンがメインセンターを務めた。'),
  (3, 3, 'TWICEの「TT」での振り付けの特徴は？', 'Tの字を指で作る振り付けが特徴的で、大ヒットした。'),
  (3, 3, 'TWICEが所属する韓国の芸能事務所は？', 'JYPエンターテインメントに所属している。'),
  (3, 3, 'TWICEの最初の単独コンサートツアーの名前は？', 'TWICE 1st Tour "TWICELAND -The Opening-"として2017年に開催された。'),
  (3, 4, 'TWICEの公式カラーは次のうちどれ？', 'アプリコット（杏色）とネオンマゼンタ（蛍光ピンク）の2色が公式カラー。'),
  (3, 4, 'TWICEの「What is Love?」MVの元ネタとなった映画に含まれないものは？', '「ラ・ラ・ランド」は含まれていない。含まれるのは「レオン」「プリンセス・ダイアリー」「ゴースト」など。'),
  (3, 4, 'TWICEの初めての日本オリジナル曲は？', 'Breakthrough/Wake Me Upが初の日本オリジナル曲。'),
  (3, 4, 'TWICEが韓国で初めて1位を獲得した曲は？', 'CHEER UPが初めて1位を獲得した。'),
  (3, 4, 'TWICEの「MORE & MORE」を作曲した有名DJは？', 'ZEDDが作曲に参加した。'),
  (3, 4, 'TWICEのリーダーは誰？', 'ジヒョがリーダーを務めている。'),
  (3, 4, 'TWICEの「FANCY」はデビュー何周年を記念した曲？', 'デビュー3周年半を記念した曲。'),
  (3, 4, 'TWICEの楽曲「Heart Shaker」のミュージックビデオに登場する架空のドリンクの名前は？', 'TWICEジュースと呼ばれるドリンクが登場する。'),
  (3, 4, 'TWICEの「The Feels」は何語の曲？', '初の英語シングル曲。'),

  -- BTS (idol_group_id: 2) クイズ
  (2, 1, 'BTSのデビュー曲は次のうちどれ？', '2013年6月13日にデビュー。'),
  (2, 1, 'BTSは何人グループ？', '7人組グループでデビュー。'),
  (2, 1, 'BTSのマンネは次のうちだれ？', 'グクは1997年9月1日生まれのグループで最年少メンバー。'),
  (2, 1, 'BTSの所属事務所は？', 'HYBE（旧Big Hit Entertainment）に所属している。'),
  (2, 2, 'BTSの「Dynamite」の特徴として正しいのは？', '初の英語シングルとしてリリースされ、グラミー賞にもノミネートされた。'),
  (2, 2, 'BTSのファンの名称は？', 'ARMYは「Adorable Representative M.C for Youth」の略称。'),
  (2, 2, 'BTSの楽曲「Spring Day」がテーマにしている社会問題は？', 'セウォル号沈没事故を題材にしていると言われている。'),
  (2, 2, 'BTSのリーダーは誰？', 'RMがグループのリーダーを務めている。'),
  (2, 2, 'BTSの「Love Yourself」シリーズは全部で何作品？', '「Her」「Tear」「Answer」の3部作。'),
  (2, 3, 'BTSが国連総会でスピーチを行ったのは初めて何年？', '2018年に初めて国連総会でスピーチを行った。'),
  (2, 3, 'BTSのジンの本名は？', 'キム・ソクジンが本名。'),
  (2, 3, 'BTSのSUGAのミキシングネームは？', 'AGUST Dとして活動している。'),
  (2, 3, 'BTSが「Billboard Hot 100」で1位を獲得した最初の曲は？', 'Dynamiteが初めてBillboard Hot 100で1位を獲得した。'),
  (2, 3, 'BTSのJ-HOPEが2022年に出演した有名な音楽フェスティバルは？', 'ロラパルーザ（Lollapalooza）のヘッドライナーを務めた。'),
  (2, 3, 'BTSの楽曲「Butter」の特徴として正しいのは？', 'Billboard Hot 100で10週連続1位を獲得した。'),
  (2, 4, 'BTSの「MAP OF THE SOUL」シリーズの元になった心理学者は？', 'カール・ユングの分析心理学がコンセプトになっている。'),
  (2, 4, 'BTSのジミンの代表的なソロ曲は？', 'Lieuはジミンのソロ曲。'),
  (2, 4, 'BTSが初めてグラミー賞にノミネートされた年は？', '2021年の第63回グラミー賞にBest Pop Duo/Group Performanceノミネートされた。'),
  (2, 4, 'BTSの「MIC Drop」のリミックスを手がけたDJは？', 'Steve Aokiがリミックスを担当した。'),
  (2, 4, 'BTSの「Black Swan」のアート・フィルムで使用されたダンスカンパニーは？', 'スロベニアのMN Danceカンパニーが出演した。');

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
  
  -- Quiz 5: TWICEの国籍が最も多い国
  (5, '韓国', true),
  (5, '日本', false),
  (5, '台湾', false),
  (5, 'アメリカ', false),
  
  -- Quiz 6: TWICEのファンダム名
  (6, 'ONCE', true),
  (6, 'TWICE', false),
  (6, 'BLINK', false),
  (6, 'ARMY', false),
  
  -- Quiz 7: TWICEの日本人メンバー
  (7, 'モモ、サナ、ミナ', true),
  (7, 'サナ、ミナ、ツウィ', false),
  (7, 'モモ、ミナ、チェヨン', false),
  (7, 'サナ、モモ、ダヒョン', false),
  
  -- Quiz 8: Feel Specialのセンター
  (8, 'ナヨン', true),
  (8, 'ツウィ', false),
  (8, 'ジヒョ', false),
  (8, 'サナ', false),
  
  -- Quiz 9: TTの振り付け
  (9, 'Tの字を指で作る', true),
  (9, '手でハートを作る', false),
  (9, 'チアリーディングの動き', false),
  (9, '泣く真似をする', false),
  
  -- Quiz 10: TWICEの所属事務所
  (10, 'JYPエンターテインメント', true),
  (10, 'SMエンターテインメント', false),
  (10, 'YGエンターテインメント', false),
  (10, 'HYBEエンターテインメント', false),
  
  -- Quiz 11: TWICEの最初の単独コンサート
  (11, 'TWICELAND -The Opening-', true),
  (11, 'TWICE WORLD TOUR', false),
  (11, 'TWICELIGHTS', false),
  (11, 'TWICE DOME TOUR', false),
  
  -- Quiz 12: TWICEの公式カラー
  (12, 'アプリコットとネオンマゼンタ', true),
  (12, 'ピンクとホワイト', false),
  (12, 'ブラックとゴールド', false),
  (12, 'パステルブルーとパープル', false),
  
  -- Quiz 13: What is Love? MVの元ネタにないもの
  (13, 'ラ・ラ・ランド', true),
  (13, 'レオン', false),
  (13, 'プリンセス・ダイアリー', false),
  (13, 'ゴースト', false),
  
  -- Quiz 14: TWICEの初めての日本オリジナル曲
  (14, 'Breakthrough/Wake Me Up', true),
  (14, 'TT -Japanese ver.-', false),
  (14, 'BDZ', false),
  (14, 'Perfect World', false),
  
  -- Quiz 15: TWICEが韓国で初めて1位を獲得した曲
  (15, 'CHEER UP', true),
  (15, 'Like OOH-AHH', false),
  (15, 'TT', false),
  (15, 'SIGNAL', false),
  
  -- Quiz 16: MORE & MOREを作曲した有名DJ
  (16, 'ZEDD', true),
  (16, 'David Guetta', false),
  (16, 'Marshmello', false),
  (16, 'Calvin Harris', false),
  
  -- Quiz 17: TWICEのリーダー
  (17, 'ジヒョ', true),
  (17, 'ナヨン', false),
  (17, 'ジョンヨン', false),
  (17, 'ツウィ', false),
  
  -- Quiz 18: FANCYはデビュー何周年記念曲
  (18, '3周年半', true),
  (18, '2周年', false),
  (18, '4周年', false),
  (18, '5周年', false),
  
  -- Quiz 19: Heart Shakerのドリンク名
  (19, 'TWICEジュース', true),
  (19, 'ONCEコーラ', false),
  (19, 'JYPソーダ', false),
  (19, 'K-POPエナジー', false),
  
  -- Quiz 20: The Feelsの言語
  (20, '英語', true),
  (20, '韓国語', false),
  (20, '日本語', false),
  (20, '中国語', false),
  
  -- Quiz 21: BTSのデビュー曲
  (21, 'NO MORE DREAM', true),
  (21, 'Butter', false),
  (21, 'Dynamite', false),
  (21, 'MIC Drop', false),
  
  -- Quiz 22: BTSは何人
  (22, '7', true),
  (22, '5', false),
  (22, '6', false),
  (22, '8', false),
  
  -- Quiz 23: BTSのマンネ
  (23, 'グク', true),
  (23, 'テテ', false),
  (23, 'ジミン', false),
  (23, 'ジン', false),
  
  -- Quiz 24: BTSの所属事務所
  (24, 'HYBE', true),
  (24, 'SMエンターテインメント', false),
  (24, 'JYPエンターテインメント', false),
  (24, 'YGエンターテインメント', false),
  
  -- Quiz 25: Dynamiteの特徴
  (25, '初の英語シングル', true),
  (25, '初の日本語シングル', false),
  (25, '初のラップなし楽曲', false),
  (25, '初の8分超え楽曲', false),
  
  -- Quiz 26: BTSのファン名称
  (26, 'ARMY', true),
  (26, 'BLINK', false),
  (26, 'ONCE', false),
  (26, 'CARAT', false),
  
  -- Quiz 27: Spring Dayのテーマ
  (27, 'セウォル号沈没事故', true),
  (27, '日韓関係', false),
  (27, '環境問題', false),
  (27, '貧困問題', false),
  
  -- Quiz 28: BTSのリーダー
  (28, 'RM', true),
  (28, 'ジン', false),
  (28, 'シュガ', false),
  (28, 'J-HOPE', false),
  
  -- Quiz 29: Love Yourself シリーズの作品数
  (29, '3', true),
  (29, '2', false),
  (29, '4', false),
  (29, '5', false),
  
  -- Quiz 30: BTSが国連でスピーチした年
  (30, '2018年', true),
  (30, '2017年', false),
  (30, '2019年', false),
  (30, '2020年', false),
  
  -- Quiz 31: ジンの本名
  (31, 'キム・ソクジン', true),
  (31, 'キム・ナムジュン', false),
  (31, 'パク・ジミン', false),
  (31, 'チョン・ホソク', false),
  
  -- Quiz 32: SUGAのミキシングネーム
  (32, 'AGUST D', true),
  (32, 'RapMonster', false),
  (32, 'J.Pearl', false),
  (32, 'V', false),
  
  -- Quiz 33: Billboard Hot 100で1位を獲得した最初の曲
  (33, 'Dynamite', true),
  (33, 'Butter', false),
  (33, 'DNA', false),
  (33, 'Fake Love', false),
  
  -- Quiz 34: J-HOPEが出演した音楽フェス
  (34, 'ロラパルーザ', true),
  (34, 'コーチェラ', false),
  (34, 'グラストンベリー', false),
  (34, 'トゥモローランド', false),
  
  -- Quiz 35: Butterの特徴
  (35, 'Billboard Hot 100で10週連続1位', true),
  (35, '日本レコード大賞受賞', false),
  (35, 'グラミー賞受賞', false),
  (35, 'メンバー全員が作詞に参加', false),
  
  -- Quiz 36: MAP OF THE SOULの元になった心理学者
  (36, 'カール・ユング', true),
  (36, 'ジークムント・フロイト', false),
  (36, 'アブラハム・マズロー', false),
  (36, 'B・F・スキナー', false),
  
  -- Quiz 37: ジミンの代表的なソロ曲
  (37, 'Lieu', true),
  (37, 'Euphoria', false),
  (37, 'Epiphany', false),
  (37, 'Singularity', false),
  
  -- Quiz 38: グラミー賞初ノミネート年
  (38, '2021年', true),
  (38, '2020年', false),
  (38, '2022年', false),
  (38, '2019年', false),
  
  -- Quiz 39: MIC Dropリミックスを手がけたDJ
  (39, 'Steve Aoki', true),
  (39, 'Calvin Harris', false),
  (39, 'Diplo', false),
  (39, 'Marshmello', false),
  
  -- Quiz 40: Black Swanのアートフィルムのダンスカンパニー
  (40, 'MN Dance', true),
  (40, 'Jabbawockeez', false),
  (40, 'The Lab', false),
  (40, 'Royal Family', false);