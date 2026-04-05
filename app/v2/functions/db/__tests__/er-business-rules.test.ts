// @vitest-environment node
import type Database from "better-sqlite3";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createTestDb, insertQuiz, insertQuizChoice, insertQuizSession, insertSessionQuestion, NOW, setupBaseData } from "./test-helper";

let db: Database.Database;
beforeEach(async () => {
	db = createTestDb();
	await setupBaseData(db);
});
afterEach(() => {
	db.close();
});

describe("クイズ選択肢のビジネスルール", () => {
	beforeEach(async () => await insertQuiz(db));

	it("正解選択肢を複数作成しても DB 制約では止まらない（アプリ側で検証）", async () => {
		await insertQuizChoice(db, { quizChoiceId: "c1", choiceOrder: 1, isCorrect: 1 });
		await insertQuizChoice(db, { quizChoiceId: "c2", choiceOrder: 2, isCorrect: 1 });
		const count = (db.prepare("SELECT count(*) as c FROM quiz_choices WHERE quiz_id = ? AND is_correct = 1").get("quiz-1") as { c: number }).c;
		expect(count).toBe(2);
	});
});

describe("1 出題枠につき 1 回答", () => {
	beforeEach(async () => {
		await insertQuiz(db);
		await insertQuizChoice(db, { quizChoiceId: "c1", choiceOrder: 1, isCorrect: 1 });
		await insertQuizSession(db, { answeredQuestionCount: 1, correctAnswerCount: 1, incorrectAnswerCount: 0, lastAnsweredAt: NOW });
		await insertSessionQuestion(db);
	});

	it("unique(quiz_session_question_id) で 2 回目の回答を拒否", () => {
		db.prepare(
			"INSERT INTO quiz_answers (quiz_answer_id, quiz_session_question_id, quiz_choice_id, awarded_score, answered_at) VALUES (?,?,?,?,?)",
		).run("a1", "sq-1", "c1", 10, NOW);
		expect(() =>
			db
				.prepare("INSERT INTO quiz_answers (quiz_answer_id, quiz_session_question_id, quiz_choice_id, awarded_score, answered_at) VALUES (?,?,?,?,?)")
				.run("a2", "sq-1", "c1", 10, NOW),
		).toThrow();
	});
});

describe("セッション内の問題重複防止", () => {
	beforeEach(async () => {
		await insertQuiz(db, { quizId: "quiz-1" });
		await insertQuiz(db, { quizId: "quiz-2" });
		await insertQuizSession(db);
	});

	it("unique(quiz_session_id, quiz_id) — 同一問題の重複出題を拒否", async () => {
		await insertSessionQuestion(db, { id: "sq1", quizId: "quiz-1", order: 1 });
		await expect(insertSessionQuestion(db, { id: "sq2", quizId: "quiz-1", order: 2 })).rejects.toThrow();
	});

	it("unique(quiz_session_id, question_order) — 同一順序の重複を拒否", async () => {
		await insertSessionQuestion(db, { id: "sq1", quizId: "quiz-1", order: 1 });
		await expect(insertSessionQuestion(db, { id: "sq2", quizId: "quiz-2", order: 1 })).rejects.toThrow();
	});
});

describe("同一ユーザー・グループで進行中セッションは 1 つ", () => {
	it("in_progress の重複を拒否", async () => {
		await insertQuizSession(db, { quizSessionId: "s1" });
		await expect(insertQuizSession(db, { quizSessionId: "s2" })).rejects.toThrow();
	});

	it("completed と in_progress は共存可能", async () => {
		await insertQuizSession(db, {
			quizSessionId: "s1",
			status: "completed",
			currentQuestionOrder: null,
			answeredQuestionCount: 5,
			correctAnswerCount: 3,
			incorrectAnswerCount: 2,
			completedAt: NOW,
			lastAnsweredAt: NOW,
		});
		await expect(insertQuizSession(db, { quizSessionId: "s2" })).resolves.toBeDefined();
	});
});
