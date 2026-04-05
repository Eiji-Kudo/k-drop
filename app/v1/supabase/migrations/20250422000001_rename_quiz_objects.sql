BEGIN;
ALTER TABLE quiz_question RENAME TO quiz;
ALTER INDEX quiz_question_pkey RENAME TO quiz_pkey;
ALTER SEQUENCE quiz_question_quiz_question_id_seq RENAME TO quiz_quiz_id_seq;
ALTER TABLE quiz RENAME COLUMN quiz_question_id TO quiz_id;
COMMIT; 