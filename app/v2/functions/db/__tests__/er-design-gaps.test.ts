// @vitest-environment node
import type Database from "better-sqlite3";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
	createTestDb,
	insertQuiz,
	insertQuizChoice,
	insertQuizSession,
	insertScoreTier,
	insertSessionQuestion,
	NOW,
	setupBaseData,
} from "./test-helper";

let db: Database.Database;
beforeEach(() => {
	db = createTestDb();
	setupBaseData(db);
});
afterEach(() => {
	db.close();
});

describe("DB 制約では守れない設計上のギャップ（アプリ側で検証必須）", () => {
	describe("quiz_answers が別クイズの選択肢を参照できてしまう", () => {
		beforeEach(() => {
			insertQuiz(db, { quizId: "q1" });
			insertQuiz(db, { quizId: "q2" });
			insertQuizChoice(db, { quizChoiceId: "q1-c1", quizId: "q1", choiceOrder: 1, isCorrect: 1 });
			insertQuizChoice(db, { quizChoiceId: "q2-c1", quizId: "q2", choiceOrder: 1, isCorrect: 1 });
			insertQuizSession(db, { answeredQuestionCount: 1, correctAnswerCount: 1, incorrectAnswerCount: 0, lastAnsweredAt: NOW });
			insertSessionQuestion(db, { id: "sq1", quizId: "q1", order: 1 });
		});

		it("q1 の出題枠に q2 の選択肢で回答しても FK 制約だけでは止まらない", () => {
			expect(() =>
				db
					.prepare(
						"INSERT INTO quiz_answers (quiz_answer_id, quiz_session_question_id, quiz_choice_id, awarded_score, answered_at) VALUES (?,?,?,?,?)",
					)
					.run("a1", "sq1", "q2-c1", 10, NOW),
			).not.toThrow();
		});
	});

	describe("total_question_count と実際の quiz_session_questions 件数の不一致", () => {
		it("total=5 だが questions を 2 件しか作らなくても DB は許容する", () => {
			insertQuiz(db, { quizId: "q1" });
			insertQuiz(db, { quizId: "q2" });
			insertQuizSession(db, { totalQuestionCount: 5 });
			insertSessionQuestion(db, { id: "sq1", quizId: "q1", order: 1 });
			insertSessionQuestion(db, { id: "sq2", quizId: "q2", order: 2 });
			const sessionQuestionCount = (
				db.prepare("SELECT count(*) as c FROM quiz_session_questions WHERE quiz_session_id = ?").get("session-1") as { c: number }
			).c;
			const session = db.prepare("SELECT total_question_count FROM quiz_sessions WHERE quiz_session_id = ?").get("session-1") as {
				total_question_count: number;
			};
			expect(sessionQuestionCount).toBe(2);
			expect(session.total_question_count).toBe(5);
		});
	});

	describe("score_tier の scope と user_score_states の scope の不一致", () => {
		it("overall の score_state に group scope の tier を参照させても DB は許容する", () => {
			insertScoreTier(db, { scoreTierId: "tier-group", tierScope: "group", tierName: "Bronze" });
			expect(() =>
				db
					.prepare(
						"INSERT INTO user_score_states (user_score_state_id, user_id, score_scope, idol_group_id, score_tier_id, score_total, answered_count, correct_count, updated_at) VALUES (?,?,?,?,?,?,?,?,?)",
					)
					.run("uss", "user-1", "overall", null, "tier-group", 0, 0, 0, NOW),
			).not.toThrow();
		});
	});

	describe("クイズに正解選択肢が 0 個でも DB は許容する", () => {
		it("全選択肢が is_correct = 0 でも挿入可能", () => {
			insertQuiz(db);
			for (let i = 1; i <= 4; i++) insertQuizChoice(db, { quizChoiceId: `c${i}`, choiceOrder: i, isCorrect: 0 });
			const correctCount = (db.prepare("SELECT count(*) as c FROM quiz_choices WHERE quiz_id = ? AND is_correct = 1").get("quiz-1") as { c: number })
				.c;
			expect(correctCount).toBe(0);
		});
	});

	describe("クイズに選択肢が 0 個でも DB は許容する", () => {
		it("選択肢なしのクイズを作成可能", () => {
			insertQuiz(db);
			const choiceCount = (db.prepare("SELECT count(*) as c FROM quiz_choices WHERE quiz_id = ?").get("quiz-1") as { c: number }).c;
			expect(choiceCount).toBe(0);
		});
	});

	describe("quiz_session_questions の question_order に歯抜けがあっても DB は許容する", () => {
		it("order 1, 3, 5 のように非連続でも挿入可能", () => {
			insertQuiz(db, { quizId: "q1" });
			insertQuiz(db, { quizId: "q2" });
			insertQuiz(db, { quizId: "q3" });
			insertQuizSession(db, { totalQuestionCount: 3 });
			insertSessionQuestion(db, { id: "sq1", quizId: "q1", order: 1 });
			insertSessionQuestion(db, { id: "sq2", quizId: "q2", order: 3 });
			insertSessionQuestion(db, { id: "sq3", quizId: "q3", order: 5 });
			expect((db.prepare("SELECT count(*) as c FROM quiz_session_questions WHERE quiz_session_id = ?").get("session-1") as { c: number }).c).toBe(3);
		});
	});

	describe("completed 後の不正な UPDATE を DB 制約だけでは防げないケース", () => {
		it("completed セッションの correct_answer_count を UPDATE で増やせてしまう（整合性は維持される場合）", () => {
			insertQuizSession(db, {
				status: "completed",
				totalQuestionCount: 5,
				answeredQuestionCount: 5,
				correctAnswerCount: 3,
				incorrectAnswerCount: 2,
				currentQuestionOrder: null,
				completedAt: NOW,
				lastAnsweredAt: NOW,
			});
			expect(() =>
				db.prepare("UPDATE quiz_sessions SET correct_answer_count = 4, incorrect_answer_count = 1 WHERE quiz_session_id = ?").run("session-1"),
			).not.toThrow();
		});
	});
});
