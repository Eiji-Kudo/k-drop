// @vitest-environment node
import type Database from "better-sqlite3";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createTestDb, insertQuiz, insertQuizChoice, NOW, setupBaseData } from "./test-helper";

let db: Database.Database;
beforeEach(() => {
	db = createTestDb();
	setupBaseData(db);
});
afterEach(() => {
	db.close();
});

const insSession = (
	id: string,
	status: string,
	answered: number,
	correct: number,
	incorrect: number,
	cqo: number | null,
	completedAt: string | null,
	lastAnswered: string | null,
) =>
	db
		.prepare(
			"INSERT INTO quiz_sessions (quiz_session_id, user_id, idol_group_id, status, total_question_count, answered_question_count, correct_answer_count, incorrect_answer_count, current_question_order, started_at, last_answered_at, completed_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
		)
		.run(id, "user-1", "group-1", status, 2, answered, correct, incorrect, cqo, NOW, lastAnswered, completedAt);
const insQuestion = (id: string, sessionId: string, quizId: string, order: number) =>
	db
		.prepare("INSERT INTO quiz_session_questions (quiz_session_question_id, quiz_session_id, quiz_id, question_order, created_at) VALUES (?,?,?,?,?)")
		.run(id, sessionId, quizId, order, NOW);
const insAnswer = (id: string, sqId: string, choiceId: string, score: number) =>
	db
		.prepare("INSERT INTO quiz_answers (quiz_answer_id, quiz_session_question_id, quiz_choice_id, awarded_score, answered_at) VALUES (?,?,?,?,?)")
		.run(id, sqId, choiceId, score, NOW);

describe("不正解含みのクイズ完了 → スコア計算 → ドロップ報酬", () => {
	beforeEach(() => {
		insertQuiz(db, { quizId: "q1" });
		insertQuizChoice(db, { quizChoiceId: "q1-ok", quizId: "q1", choiceOrder: 1, isCorrect: 1 });
		insertQuizChoice(db, { quizChoiceId: "q1-ng", quizId: "q1", choiceOrder: 2, isCorrect: 0 });
		insertQuiz(db, { quizId: "q2" });
		insertQuizChoice(db, { quizChoiceId: "q2-ok", quizId: "q2", choiceOrder: 1, isCorrect: 1 });
		insertQuizChoice(db, { quizChoiceId: "q2-ng", quizId: "q2", choiceOrder: 2, isCorrect: 0 });
	});

	it("1問正解・1問不正解 → correct=1, incorrect=1, ドロップ報酬は正解分のみ", () => {
		insSession("s1", "in_progress", 0, 0, 0, 1, null, null);
		insQuestion("sq1", "s1", "q1", 1);
		insQuestion("sq2", "s1", "q2", 2);

		insAnswer("a1", "sq1", "q1-ok", 10);
		db.prepare(
			"UPDATE quiz_sessions SET answered_question_count=1, correct_answer_count=1, current_question_order=2, last_answered_at=? WHERE quiz_session_id=?",
		).run(NOW, "s1");

		insAnswer("a2", "sq2", "q2-ng", 0);
		db.prepare(
			"UPDATE quiz_sessions SET answered_question_count=2, correct_answer_count=1, incorrect_answer_count=1, current_question_order=NULL, status='completed', completed_at=?, last_answered_at=? WHERE quiz_session_id=?",
		).run(NOW, NOW, "s1");

		db.prepare("INSERT INTO drop_wallets (user_id, balance, updated_at) VALUES (?,?,?)").run("user-1", 0, NOW);
		db.transaction(() => {
			db.prepare(
				"INSERT INTO drop_transactions (drop_transaction_id, user_id, delta, reason, source_type, source_id, created_at) VALUES (?,?,?,?,?,?,?)",
			).run("tx1", "user-1", 10, "quiz_reward", "quiz_session", "s1", NOW);
			db.prepare("UPDATE drop_wallets SET balance=balance+10, updated_at=? WHERE user_id=?").run(NOW, "user-1");
		})();

		const s = db.prepare("SELECT * FROM quiz_sessions WHERE quiz_session_id=?").get("s1") as Record<string, unknown>;
		expect(s.correct_answer_count).toBe(1);
		expect(s.incorrect_answer_count).toBe(1);
		const w = db.prepare("SELECT balance FROM drop_wallets WHERE user_id=?").get("user-1") as { balance: number };
		expect(w.balance).toBe(10);
	});
});

describe("セッション途中離脱→再挑戦→完了", () => {
	beforeEach(() => {
		insertQuiz(db, { quizId: "q1" });
		insertQuizChoice(db, { quizChoiceId: "c1", quizId: "q1", choiceOrder: 1, isCorrect: 1 });
		insertQuiz(db, { quizId: "q2" });
		insertQuizChoice(db, { quizChoiceId: "c2", quizId: "q2", choiceOrder: 1, isCorrect: 1 });
	});

	it("abandoned 後に新しい in_progress セッションを作って完了できる", () => {
		insSession("s-abandon", "in_progress", 0, 0, 0, 1, null, null);
		db.prepare("UPDATE quiz_sessions SET status='abandoned', current_question_order=NULL WHERE quiz_session_id=?").run("s-abandon");

		insSession("s-retry", "in_progress", 0, 0, 0, 1, null, null);
		insQuestion("sq1", "s-retry", "q1", 1);
		insQuestion("sq2", "s-retry", "q2", 2);
		insAnswer("a1", "sq1", "c1", 10);
		insAnswer("a2", "sq2", "c2", 10);
		db.prepare(
			"UPDATE quiz_sessions SET answered_question_count=2, correct_answer_count=2, current_question_order=NULL, status='completed', completed_at=?, last_answered_at=? WHERE quiz_session_id=?",
		).run(NOW, NOW, "s-retry");

		const abandoned = db.prepare("SELECT status FROM quiz_sessions WHERE quiz_session_id=?").get("s-abandon") as { status: string };
		const completed = db.prepare("SELECT * FROM quiz_sessions WHERE quiz_session_id=?").get("s-retry") as Record<string, unknown>;
		expect(abandoned.status).toBe("abandoned");
		expect(completed.status).toBe("completed");
		expect(completed.correct_answer_count).toBe(2);
	});
});

describe("全問不正解でもセッションは正常に完了する", () => {
	it("correct=0, incorrect=2 で completed", () => {
		insertQuiz(db, { quizId: "q1" });
		insertQuizChoice(db, { quizChoiceId: "c1-ng", quizId: "q1", choiceOrder: 1, isCorrect: 0 });
		insertQuiz(db, { quizId: "q2" });
		insertQuizChoice(db, { quizChoiceId: "c2-ng", quizId: "q2", choiceOrder: 1, isCorrect: 0 });
		insSession("s1", "in_progress", 0, 0, 0, 1, null, null);
		insQuestion("sq1", "s1", "q1", 1);
		insQuestion("sq2", "s1", "q2", 2);

		insAnswer("a1", "sq1", "c1-ng", 0);
		insAnswer("a2", "sq2", "c2-ng", 0);
		db.prepare(
			"UPDATE quiz_sessions SET answered_question_count=2, correct_answer_count=0, incorrect_answer_count=2, current_question_order=NULL, status='completed', completed_at=?, last_answered_at=? WHERE quiz_session_id=?",
		).run(NOW, NOW, "s1");

		const s = db.prepare("SELECT * FROM quiz_sessions WHERE quiz_session_id=?").get("s1") as Record<string, unknown>;
		expect(s.status).toBe("completed");
		expect(s.correct_answer_count).toBe(0);
		expect(s.incorrect_answer_count).toBe(2);
	});
});
