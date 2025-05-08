-- Migration to replace fixed choice columns with quiz_choices table
BEGIN;

-- Create new table for quiz choices
CREATE TABLE public.quiz_choices (
  quiz_choice_id SERIAL PRIMARY KEY,
  quiz_id INTEGER NOT NULL REFERENCES public.quizzes(quiz_id) ON DELETE CASCADE,
  choice_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create index on quiz_id for faster lookups
CREATE INDEX idx_quiz_choices_quiz_id ON public.quiz_choices(quiz_id);

-- Migrate data from quizzes to quiz_choices table
-- Inserting choice1 with correct_choice check
INSERT INTO public.quiz_choices (quiz_id, choice_text, is_correct)
SELECT
  quiz_id,
  choice1,
  (correct_choice = 1)
FROM public.quizzes
WHERE choice1 IS NOT NULL;

-- Inserting choice2 with correct_choice check
INSERT INTO public.quiz_choices (quiz_id, choice_text, is_correct)
SELECT
  quiz_id,
  choice2,
  (correct_choice = 2)
FROM public.quizzes
WHERE choice2 IS NOT NULL;

-- Inserting choice3 with correct_choice check
INSERT INTO public.quiz_choices (quiz_id, choice_text, is_correct)
SELECT
  quiz_id,
  choice3,
  (correct_choice = 3)
FROM public.quizzes
WHERE choice3 IS NOT NULL;

-- Inserting choice4 with correct_choice check
INSERT INTO public.quiz_choices (quiz_id, choice_text, is_correct)
SELECT
  quiz_id,
  choice4,
  (correct_choice = 4)
FROM public.quizzes
WHERE choice4 IS NOT NULL;

-- Verify migration with a count check (each quiz should have 4 choices)
DO $$
DECLARE
  quiz_count INTEGER;
  choice_group_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO quiz_count FROM public.quizzes;
  SELECT COUNT(*) INTO choice_group_count FROM (
    SELECT quiz_id, COUNT(*) 
    FROM public.quiz_choices 
    GROUP BY quiz_id 
    HAVING COUNT(*) = 4
  ) AS complete_groups;
  
  IF quiz_count != choice_group_count THEN
    RAISE EXCEPTION 'Migration validation failed: Not all quizzes have exactly 4 choices';
  END IF;
END $$;

-- Drop the now-redundant columns from quizzes table
ALTER TABLE public.quizzes 
  DROP COLUMN choice1,
  DROP COLUMN choice2,
  DROP COLUMN choice3,
  DROP COLUMN choice4,
  DROP COLUMN correct_choice;

COMMIT;