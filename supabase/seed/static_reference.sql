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