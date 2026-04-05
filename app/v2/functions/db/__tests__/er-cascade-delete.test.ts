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
const count = (table: string, where: string, params: unknown[]) =>
	(db.prepare(`SELECT count(*) as c FROM ${table} WHERE ${where}`).get(...params) as { c: number }).c;

describe("users 削除時のカスケード", () => {
	beforeEach(() => {
		db.prepare("INSERT INTO user_profiles (user_id, handle, display_name, created_at, updated_at) VALUES (?,?,?,?,?)").run(
			"user-1",
			"h1",
			"U1",
			NOW,
			NOW,
		);
		db.prepare("INSERT INTO drop_wallets (user_id, balance, updated_at) VALUES (?,?,?)").run("user-1", 100, NOW);
		db.prepare("INSERT INTO user_favorite_groups (user_favorite_group_id, user_id, idol_group_id, created_at) VALUES (?,?,?,?)").run(
			"fav-1",
			"user-1",
			"group-1",
			NOW,
		);
		db.prepare("INSERT INTO drop_transactions (drop_transaction_id, user_id, delta, reason, source_type, created_at) VALUES (?,?,?,?,?,?)").run(
			"tx-1",
			"user-1",
			10,
			"reward",
			"quiz",
			NOW,
		);
	});

	it("user_profiles がカスケード削除", () => {
		db.prepare("DELETE FROM users WHERE user_id = ?").run("user-1");
		expect(count("user_profiles", "user_id = ?", ["user-1"])).toBe(0);
	});
	it("drop_wallets がカスケード削除", () => {
		db.prepare("DELETE FROM users WHERE user_id = ?").run("user-1");
		expect(count("drop_wallets", "user_id = ?", ["user-1"])).toBe(0);
	});
	it("user_favorite_groups がカスケード削除", () => {
		db.prepare("DELETE FROM users WHERE user_id = ?").run("user-1");
		expect(count("user_favorite_groups", "user_id = ?", ["user-1"])).toBe(0);
	});
	it("drop_transactions がカスケード削除", () => {
		db.prepare("DELETE FROM users WHERE user_id = ?").run("user-1");
		expect(count("drop_transactions", "user_id = ?", ["user-1"])).toBe(0);
	});
});

describe("quiz_sessions 削除時のカスケード連鎖", () => {
	beforeEach(async () => {
		await insertQuiz(db);
		await insertQuizChoice(db, { quizChoiceId: "c1", choiceOrder: 1, isCorrect: 1 });
		await insertQuizSession(db, { answeredQuestionCount: 1, correctAnswerCount: 1, incorrectAnswerCount: 0, lastAnsweredAt: NOW });
		await insertSessionQuestion(db);
		db.prepare(
			"INSERT INTO quiz_answers (quiz_answer_id, quiz_session_question_id, quiz_choice_id, awarded_score, answered_at) VALUES (?,?,?,?,?)",
		).run("a1", "sq-1", "c1", 10, NOW);
	});

	it("session 削除 → questions も削除", () => {
		db.prepare("DELETE FROM quiz_sessions WHERE quiz_session_id = ?").run("session-1");
		expect(count("quiz_session_questions", "quiz_session_id = ?", ["session-1"])).toBe(0);
	});
	it("session 削除 → answers も連鎖削除", () => {
		db.prepare("DELETE FROM quiz_sessions WHERE quiz_session_id = ?").run("session-1");
		expect(count("quiz_answers", "quiz_answer_id = ?", ["a1"])).toBe(0);
	});
});

describe("idol_groups 削除時のカスケード", () => {
	beforeEach(async () => {
		await insertQuiz(db);
		db.prepare("INSERT INTO user_favorite_groups (user_favorite_group_id, user_id, idol_group_id, created_at) VALUES (?,?,?,?)").run(
			"fav-1",
			"user-1",
			"group-1",
			NOW,
		);
	});
	it("quizzes がカスケード削除", () => {
		db.prepare("DELETE FROM idol_groups WHERE idol_group_id = ?").run("group-1");
		expect(count("quizzes", "idol_group_id = ?", ["group-1"])).toBe(0);
	});
	it("user_favorite_groups がカスケード削除", () => {
		db.prepare("DELETE FROM idol_groups WHERE idol_group_id = ?").run("group-1");
		expect(count("user_favorite_groups", "idol_group_id = ?", ["group-1"])).toBe(0);
	});
});

describe("events 削除時のカスケード", () => {
	beforeEach(() => {
		db.prepare(
			"INSERT INTO events (event_id, created_by_user_id, title, visibility, starts_at, ends_at, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)",
		).run("ev-1", "user-1", "E", "public", "2025-03-01T00:00:00Z", "2025-04-01T00:00:00Z", NOW, NOW);
		db.prepare("INSERT INTO event_groups (event_group_id, event_id, idol_group_id, created_at) VALUES (?,?,?,?)").run("eg-1", "ev-1", "group-1", NOW);
		db.prepare(
			"INSERT INTO event_participants (event_participant_id, event_id, user_id, participation_status, joined_at, updated_at) VALUES (?,?,?,?,?,?)",
		).run("ep-1", "ev-1", "user-1", "joined", NOW, NOW);
	});
	it("event_groups がカスケード削除", () => {
		db.prepare("DELETE FROM events WHERE event_id = ?").run("ev-1");
		expect(count("event_groups", "event_id = ?", ["ev-1"])).toBe(0);
	});
	it("event_participants がカスケード削除", () => {
		db.prepare("DELETE FROM events WHERE event_id = ?").run("ev-1");
		expect(count("event_participants", "event_id = ?", ["ev-1"])).toBe(0);
	});
});

describe("leaderboard_snapshots 削除時のカスケード", () => {
	it("leaderboard_entries がカスケード削除", () => {
		db.prepare(
			"INSERT INTO leaderboard_snapshots (leaderboard_snapshot_id, leaderboard_scope, idol_group_id, snapshot_at, created_at) VALUES (?,?,?,?,?)",
		).run("ls-1", "overall", null, NOW, NOW);
		db.prepare(
			"INSERT INTO leaderboard_entries (leaderboard_entry_id, leaderboard_snapshot_id, user_id, display_rank, display_score) VALUES (?,?,?,?,?)",
		).run("le-1", "ls-1", "user-1", 1, 100);
		db.prepare("DELETE FROM leaderboard_snapshots WHERE leaderboard_snapshot_id = ?").run("ls-1");
		expect(count("leaderboard_entries", "leaderboard_snapshot_id = ?", ["ls-1"])).toBe(0);
	});
});
