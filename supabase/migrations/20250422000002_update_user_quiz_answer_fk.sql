BEGIN;
ALTER TABLE user_quiz_answer RENAME COLUMN quiz_question_id TO quiz_id;
ALTER TABLE user_quiz_answer
  DROP CONSTRAINT fk_user_quiz_question,
  ADD  CONSTRAINT fk_user_quiz
       FOREIGN KEY (quiz_id) REFERENCES quiz (quiz_id);
COMMIT; 