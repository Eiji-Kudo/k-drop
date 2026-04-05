// @vitest-environment node
import type Database from "better-sqlite3";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { NOW, createTestDb, insertQuizSession, insertScoreTier, insertUser, setupBaseData } from "./test-helper";

let db: Database.Database;
beforeEach(() => { db = createTestDb(); setupBaseData(db); });
afterEach(() => { db.close(); });

describe("quiz_sessions の CHECK 制約", () => {
	it("total_question_count >= 1", () => {
		expect(() => insertQuizSession(db, { totalQuestionCount: 0 })).toThrow();
	});

	it("in_progress 時は current_question_order が必須", () => {
		expect(() => insertQuizSession(db, { status: "in_progress", currentQuestionOrder: null })).toThrow();
	});

	it("completed 時は current_question_order が NULL", () => {
		expect(() => insertQuizSession(db, {
			status: "completed", currentQuestionOrder: 1, answeredQuestionCount: 5,
			correctAnswerCount: 3, incorrectAnswerCount: 2, completedAt: NOW, lastAnsweredAt: NOW,
		})).toThrow();
	});

	it("completed 時は completed_at が必須", () => {
		expect(() => insertQuizSession(db, {
			status: "completed", currentQuestionOrder: null, answeredQuestionCount: 5,
			correctAnswerCount: 3, incorrectAnswerCount: 2, completedAt: null, lastAnsweredAt: NOW,
		})).toThrow();
	});

	it("非 completed 時は completed_at が NULL", () => {
		expect(() => insertQuizSession(db, { status: "in_progress", completedAt: NOW })).toThrow();
	});

	it("answered > 0 なら last_answered_at が必須", () => {
		expect(() => insertQuizSession(db, {
			answeredQuestionCount: 1, correctAnswerCount: 1, incorrectAnswerCount: 0, lastAnsweredAt: null,
		})).toThrow();
	});

	it("answered = 0 なら last_answered_at は NULL", () => {
		expect(() => insertQuizSession(db, { answeredQuestionCount: 0, lastAnsweredAt: NOW })).toThrow();
	});

	it("answered_question_count <= total_question_count", () => {
		expect(() => insertQuizSession(db, {
			totalQuestionCount: 3, answeredQuestionCount: 4, correctAnswerCount: 2, incorrectAnswerCount: 2, lastAnsweredAt: NOW,
		})).toThrow();
	});

	it("correct + incorrect = answered", () => {
		expect(() => insertQuizSession(db, {
			answeredQuestionCount: 3, correctAnswerCount: 1, incorrectAnswerCount: 1, lastAnsweredAt: NOW,
		})).toThrow();
	});
});

describe("user_score_states のスコープ制約", () => {
	beforeEach(() => insertScoreTier(db));
	const ins = (id: string, scope: string, groupId: string | null, answered = 0, correct = 0) =>
		db.prepare("INSERT INTO user_score_states (user_score_state_id, user_id, score_scope, idol_group_id, score_tier_id, score_total, answered_count, correct_count, updated_at) VALUES (?,?,?,?,?,?,?,?,?)").run(
			id, "user-1", scope, groupId, "tier-1", 0, answered, correct, NOW,
		);

	it("overall なら idol_group_id は NULL", () => { expect(() => ins("s1", "overall", "group-1")).toThrow(); });
	it("group なら idol_group_id は必須", () => { expect(() => ins("s1", "group", null)).toThrow(); });
	it("correct_count <= answered_count", () => { expect(() => ins("s1", "overall", null, 5, 6)).toThrow(); });
});

describe("leaderboard_snapshots のスコープ制約", () => {
	it("overall なら idol_group_id は NULL", () => {
		expect(() => db.prepare("INSERT INTO leaderboard_snapshots (leaderboard_snapshot_id, leaderboard_scope, idol_group_id, snapshot_at, created_at) VALUES (?,?,?,?,?)").run("ls1", "overall", "group-1", NOW, NOW)).toThrow();
	});

	it("group なら idol_group_id は必須", () => {
		expect(() => db.prepare("INSERT INTO leaderboard_snapshots (leaderboard_snapshot_id, leaderboard_scope, idol_group_id, snapshot_at, created_at) VALUES (?,?,?,?,?)").run("ls1", "group", null, NOW, NOW)).toThrow();
	});
});

describe("leaderboard_entries の制約", () => {
	beforeEach(() => {
		insertScoreTier(db);
		db.prepare("INSERT INTO leaderboard_snapshots (leaderboard_snapshot_id, leaderboard_scope, idol_group_id, snapshot_at, created_at) VALUES (?,?,?,?,?)").run("ls1", "overall", null, NOW, NOW);
	});
	const ins = (id: string, userId: string, rank: number, score: number) =>
		db.prepare("INSERT INTO leaderboard_entries (leaderboard_entry_id, leaderboard_snapshot_id, user_id, display_rank, display_score) VALUES (?,?,?,?,?)").run(id, "ls1", userId, rank, score);

	it("display_rank >= 1", () => { expect(() => ins("e1", "user-1", 0, 100)).toThrow(); });
	it("display_score >= 0", () => { expect(() => ins("e1", "user-1", 1, -1)).toThrow(); });
	it("unique(snapshot_id, user_id)", () => { insertUser(db, { userId: "user-2" }); ins("e1", "user-1", 1, 100); expect(() => ins("e2", "user-1", 2, 50)).toThrow(); });
	it("unique(snapshot_id, display_rank)", () => { insertUser(db, { userId: "user-2" }); ins("e1", "user-1", 1, 100); expect(() => ins("e2", "user-2", 1, 90)).toThrow(); });
});

describe("user_score_snapshots の制約", () => {
	const insSs = (id: string, scope: string, groupId: string | null, date: string, total = 100) =>
		db.prepare("INSERT INTO user_score_snapshots (user_score_snapshot_id, user_id, score_scope, idol_group_id, snapshot_date, score_total, created_at) VALUES (?,?,?,?,?,?,?)").run(id, "user-1", scope, groupId, date, total, NOW);
	it("overall なら idol_group_id は NULL", () => { expect(() => insSs("sn1", "overall", "group-1", "2025-01-01")).toThrow(); });
	it("group なら idol_group_id は必須", () => { expect(() => insSs("sn1", "group", null, "2025-01-01")).toThrow(); });
	it("score_total = 0 は有効", () => { expect(() => insSs("sn1", "overall", null, "2025-01-01", 0)).not.toThrow(); });
	it("負の score_total は拒否", () => { expect(() => insSs("sn1", "overall", null, "2025-01-01", -1)).toThrow(); });
});
