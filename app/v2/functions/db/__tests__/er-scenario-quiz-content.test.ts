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

describe("クイズコンテンツのライフサイクル", () => {
	it("draft → published → archived のステータス遷移", () => {
		insertQuiz(db, { status: "draft" });
		db.prepare("UPDATE quizzes SET status='published', published_at=?, updated_at=? WHERE quiz_id=?").run(NOW, NOW, "quiz-1");
		expect((db.prepare("SELECT status, published_at FROM quizzes WHERE quiz_id=?").get("quiz-1") as Record<string, unknown>).status).toBe(
			"published",
		);
		db.prepare("UPDATE quizzes SET status='archived', updated_at=? WHERE quiz_id=?").run(NOW, "quiz-1");
		expect((db.prepare("SELECT status FROM quizzes WHERE quiz_id=?").get("quiz-1") as { status: string }).status).toBe("archived");
	});

	it("published クイズに explanation を後から追加", () => {
		insertQuiz(db);
		db.prepare("UPDATE quizzes SET explanation='TWICEは2015年にデビューしました', updated_at=? WHERE quiz_id=?").run(NOW, "quiz-1");
		const q = db.prepare("SELECT explanation FROM quizzes WHERE quiz_id=?").get("quiz-1") as { explanation: string };
		expect(q.explanation).toContain("TWICE");
	});
});

describe("選択肢の構成パターン", () => {
	beforeEach(() => insertQuiz(db));

	it("4 択クイズを正しく構成（正解 1 つ + 不正解 3 つ）", () => {
		insertQuizChoice(db, { quizChoiceId: "c1", choiceOrder: 1, isCorrect: 1 });
		insertQuizChoice(db, { quizChoiceId: "c2", choiceOrder: 2, isCorrect: 0 });
		insertQuizChoice(db, { quizChoiceId: "c3", choiceOrder: 3, isCorrect: 0 });
		insertQuizChoice(db, { quizChoiceId: "c4", choiceOrder: 4, isCorrect: 0 });
		const choices = db.prepare("SELECT choice_order, is_correct FROM quiz_choices WHERE quiz_id=? ORDER BY choice_order").all("quiz-1") as {
			choice_order: number;
			is_correct: number;
		}[];
		expect(choices).toHaveLength(4);
		expect(choices.filter((c) => c.is_correct === 1)).toHaveLength(1);
		expect(choices.filter((c) => c.is_correct === 0)).toHaveLength(3);
	});

	it("2 択クイズも構成可能", () => {
		insertQuizChoice(db, { quizChoiceId: "c1", choiceOrder: 1, isCorrect: 1 });
		insertQuizChoice(db, { quizChoiceId: "c2", choiceOrder: 2, isCorrect: 0 });
		expect((db.prepare("SELECT count(*) as c FROM quiz_choices WHERE quiz_id=?").get("quiz-1") as { c: number }).c).toBe(2);
	});
});

describe("難易度別のクイズ管理", () => {
	it("同一グループに easy/normal/hard のクイズを作成して難易度別に取得", () => {
		insertQuiz(db, { quizId: "q-e", difficulty: "easy" });
		insertQuiz(db, { quizId: "q-n", difficulty: "normal" });
		insertQuiz(db, { quizId: "q-h", difficulty: "hard" });
		const easy = db.prepare("SELECT count(*) as c FROM quizzes WHERE idol_group_id=? AND difficulty='easy'").get("group-1") as { c: number };
		const hard = db.prepare("SELECT count(*) as c FROM quizzes WHERE idol_group_id=? AND difficulty='hard'").get("group-1") as { c: number };
		expect(easy.c).toBe(1);
		expect(hard.c).toBe(1);
	});

	it("published のクイズだけをフィルタ取得", () => {
		insertQuiz(db, { quizId: "q-pub", status: "published" });
		insertQuiz(db, { quizId: "q-draft", status: "draft" });
		insertQuiz(db, { quizId: "q-arch", status: "archived" });
		const published = db.prepare("SELECT count(*) as c FROM quizzes WHERE idol_group_id=? AND status='published'").get("group-1") as { c: number };
		expect(published.c).toBe(1);
	});
});

describe("クイズ削除時の連鎖", () => {
	it("クイズ削除で選択肢もカスケード削除", () => {
		insertQuiz(db);
		for (let i = 1; i <= 4; i++) insertQuizChoice(db, { quizChoiceId: `c${i}`, choiceOrder: i, isCorrect: i === 1 ? 1 : 0 });
		db.prepare("DELETE FROM quizzes WHERE quiz_id=?").run("quiz-1");
		expect((db.prepare("SELECT count(*) as c FROM quiz_choices WHERE quiz_id=?").get("quiz-1") as { c: number }).c).toBe(0);
	});
});
