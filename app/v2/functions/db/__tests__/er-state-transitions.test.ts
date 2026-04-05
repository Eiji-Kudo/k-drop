// @vitest-environment node
import type Database from "better-sqlite3";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createTestDb, insertQuizSession, insertScoreTier, NOW, setupBaseData } from "./test-helper";

let db: Database.Database;
beforeEach(() => {
	db = createTestDb();
	setupBaseData(db);
});
afterEach(() => {
	db.close();
});

describe("UPDATE で quiz_sessions の CHECK 制約を破れないことの検証", () => {
	beforeEach(() => insertQuizSession(db));

	it("UPDATE で answered > total にすることを拒否", () => {
		expect(() => db.prepare("UPDATE quiz_sessions SET answered_question_count = 6 WHERE quiz_session_id = ?").run("session-1")).toThrow();
	});

	it("UPDATE で correct + incorrect != answered にすることを拒否", () => {
		expect(() => db.prepare("UPDATE quiz_sessions SET correct_answer_count = 3 WHERE quiz_session_id = ?").run("session-1")).toThrow();
	});

	it("UPDATE で in_progress のまま current_question_order を NULL にすることを拒否", () => {
		expect(() => db.prepare("UPDATE quiz_sessions SET current_question_order = NULL WHERE quiz_session_id = ?").run("session-1")).toThrow();
	});

	it("UPDATE で completed にしつつ completed_at を NULL のままにすることを拒否", () => {
		expect(() =>
			db
				.prepare(
					"UPDATE quiz_sessions SET status = 'completed', current_question_order = NULL, answered_question_count = 5, correct_answer_count = 3, incorrect_answer_count = 2, last_answered_at = ? WHERE quiz_session_id = ?",
				)
				.run(NOW, "session-1"),
		).toThrow();
	});

	it("UPDATE で in_progress に completed_at を付けることを拒否", () => {
		expect(() => db.prepare("UPDATE quiz_sessions SET completed_at = ? WHERE quiz_session_id = ?").run(NOW, "session-1")).toThrow();
	});

	it("UPDATE で answered > 0 にしつつ last_answered_at を NULL のままにすることを拒否", () => {
		expect(() =>
			db
				.prepare(
					"UPDATE quiz_sessions SET answered_question_count = 1, correct_answer_count = 1, incorrect_answer_count = 0 WHERE quiz_session_id = ?",
				)
				.run("session-1"),
		).toThrow();
	});

	it("UPDATE で正しい状態遷移 (in_progress → completed) は成功", () => {
		expect(() =>
			db
				.prepare(
					"UPDATE quiz_sessions SET status = 'completed', answered_question_count = 5, correct_answer_count = 3, incorrect_answer_count = 2, current_question_order = NULL, completed_at = ?, last_answered_at = ? WHERE quiz_session_id = ?",
				)
				.run(NOW, NOW, "session-1"),
		).not.toThrow();
	});

	it("UPDATE で正しい状態遷移 (in_progress → abandoned) は成功", () => {
		expect(() =>
			db.prepare("UPDATE quiz_sessions SET status = 'abandoned', current_question_order = NULL WHERE quiz_session_id = ?").run("session-1"),
		).not.toThrow();
	});
});

describe("UPDATE で drop_wallets の balance 制約を破れないことの検証", () => {
	beforeEach(() => {
		db.prepare("INSERT INTO drop_wallets (user_id, balance, updated_at) VALUES (?,?,?)").run("user-1", 10, NOW);
	});
	it("UPDATE で balance を負にすることを拒否", () => {
		expect(() => db.prepare("UPDATE drop_wallets SET balance = -1 WHERE user_id = ?").run("user-1")).toThrow();
	});
	it("UPDATE で balance = 0 は許容", () => {
		expect(() => db.prepare("UPDATE drop_wallets SET balance = 0 WHERE user_id = ?").run("user-1")).not.toThrow();
	});
});

describe("UPDATE で user_score_states の制約を破れないことの検証", () => {
	beforeEach(() => {
		insertScoreTier(db);
		db.prepare(
			"INSERT INTO user_score_states (user_score_state_id, user_id, score_scope, idol_group_id, score_tier_id, score_total, answered_count, correct_count, updated_at) VALUES (?,?,?,?,?,?,?,?,?)",
		).run("uss", "user-1", "overall", null, "tier-1", 10, 5, 3, NOW);
	});
	it("UPDATE で correct_count > answered_count にすることを拒否", () => {
		expect(() => db.prepare("UPDATE user_score_states SET correct_count = 6 WHERE user_score_state_id = ?").run("uss")).toThrow();
	});
	it("UPDATE で score_total を負にすることを拒否", () => {
		expect(() => db.prepare("UPDATE user_score_states SET score_total = -1 WHERE user_score_state_id = ?").run("uss")).toThrow();
	});
	it("UPDATE で scope_group_match を壊すことを拒否 (overall に group_id を付与)", () => {
		expect(() => db.prepare("UPDATE user_score_states SET idol_group_id = 'group-1' WHERE user_score_state_id = ?").run("uss")).toThrow();
	});
});
