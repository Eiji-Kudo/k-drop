// @vitest-environment node
import type Database from "better-sqlite3";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createTestDb, insertGroupCategory, insertIdolGroup, insertQuiz, insertQuizChoice, insertScoreTier, insertUser, NOW } from "./test-helper";

let db: Database.Database;
beforeEach(async () => {
	db = createTestDb();
	await insertUser(db);
	await insertGroupCategory(db);
	await insertIdolGroup(db, { idolGroupId: "twice", slug: "twice" });
	await insertGroupCategory(db, { groupCategoryId: "cat-2", slug: "jpop" });
	await insertIdolGroup(db, { idolGroupId: "ive", groupCategoryId: "cat-2", slug: "ive" });
	await insertScoreTier(db);
	await insertScoreTier(db, { scoreTierId: "tier-g", tierScope: "group", tierName: "Bronze" });
});
afterEach(() => {
	db.close();
});

const startSession = (id: string, groupId: string) =>
	db
		.prepare(
			"INSERT INTO quiz_sessions (quiz_session_id, user_id, idol_group_id, status, total_question_count, answered_question_count, correct_answer_count, incorrect_answer_count, current_question_order, started_at, last_answered_at, completed_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
		)
		.run(id, "user-1", groupId, "in_progress", 1, 0, 0, 0, 1, NOW, null, null);
const completeSession = (id: string, correct: number, incorrect: number) =>
	db
		.prepare(
			"UPDATE quiz_sessions SET status='completed', answered_question_count=?, correct_answer_count=?, incorrect_answer_count=?, current_question_order=NULL, completed_at=?, last_answered_at=? WHERE quiz_session_id=?",
		)
		.run(correct + incorrect, correct, incorrect, NOW, NOW, id);

describe("同一ユーザーが複数グループでクイズを回し、スコアが正しく積み上がる", () => {
	beforeEach(async () => {
		await insertQuiz(db, { quizId: "q-tw", idolGroupId: "twice" });
		await insertQuizChoice(db, { quizChoiceId: "c-tw", quizId: "q-tw", choiceOrder: 1, isCorrect: 1 });
		await insertQuiz(db, { quizId: "q-iv", idolGroupId: "ive" });
		await insertQuizChoice(db, { quizChoiceId: "c-iv", quizId: "q-iv", choiceOrder: 1, isCorrect: 1 });
	});

	it("TWICE と IVE の両方を回して overall + 各 group スコアが独立に蓄積", () => {
		startSession("s-tw", "twice");
		db.prepare(
			"INSERT INTO quiz_session_questions (quiz_session_question_id, quiz_session_id, quiz_id, question_order, created_at) VALUES (?,?,?,?,?)",
		).run("sq-tw", "s-tw", "q-tw", 1, NOW);
		db.prepare(
			"INSERT INTO quiz_answers (quiz_answer_id, quiz_session_question_id, quiz_choice_id, awarded_score, answered_at) VALUES (?,?,?,?,?)",
		).run("a-tw", "sq-tw", "c-tw", 10, NOW);
		completeSession("s-tw", 1, 0);

		startSession("s-iv", "ive");
		db.prepare(
			"INSERT INTO quiz_session_questions (quiz_session_question_id, quiz_session_id, quiz_id, question_order, created_at) VALUES (?,?,?,?,?)",
		).run("sq-iv", "s-iv", "q-iv", 1, NOW);
		db.prepare(
			"INSERT INTO quiz_answers (quiz_answer_id, quiz_session_question_id, quiz_choice_id, awarded_score, answered_at) VALUES (?,?,?,?,?)",
		).run("a-iv", "sq-iv", "c-iv", 15, NOW);
		completeSession("s-iv", 1, 0);

		db.transaction(() => {
			db.prepare(
				"INSERT INTO user_score_states (user_score_state_id, user_id, score_scope, idol_group_id, score_tier_id, score_total, answered_count, correct_count, last_answered_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)",
			).run("ov", "user-1", "overall", null, "tier-1", 25, 2, 2, NOW, NOW);
			db.prepare(
				"INSERT INTO user_score_states (user_score_state_id, user_id, score_scope, idol_group_id, score_tier_id, score_total, answered_count, correct_count, last_answered_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)",
			).run("gr-tw", "user-1", "group", "twice", "tier-g", 10, 1, 1, NOW, NOW);
			db.prepare(
				"INSERT INTO user_score_states (user_score_state_id, user_id, score_scope, idol_group_id, score_tier_id, score_total, answered_count, correct_count, last_answered_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)",
			).run("gr-iv", "user-1", "group", "ive", "tier-g", 15, 1, 1, NOW, NOW);
		})();

		const ov = db.prepare("SELECT score_total FROM user_score_states WHERE user_score_state_id=?").get("ov") as { score_total: number };
		const tw = db.prepare("SELECT score_total FROM user_score_states WHERE user_score_state_id=?").get("gr-tw") as { score_total: number };
		const iv = db.prepare("SELECT score_total FROM user_score_states WHERE user_score_state_id=?").get("gr-iv") as { score_total: number };
		expect(ov.score_total).toBe(25);
		expect(tw.score_total).toBe(10);
		expect(iv.score_total).toBe(15);
		expect(tw.score_total + iv.score_total).toBe(ov.score_total);
	});

	it("2 グループで同時に in_progress セッションを持てる", () => {
		startSession("s-tw", "twice");
		expect(() => startSession("s-iv", "ive")).not.toThrow();
		expect((db.prepare("SELECT count(*) as c FROM quiz_sessions WHERE status='in_progress'").get() as { c: number }).c).toBe(2);
	});
});
