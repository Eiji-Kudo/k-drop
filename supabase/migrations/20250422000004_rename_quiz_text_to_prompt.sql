BEGIN;

-- quiz.question_text → quiz.prompt
ALTER TABLE quiz
  RENAME COLUMN question_text TO prompt;

COMMIT; 