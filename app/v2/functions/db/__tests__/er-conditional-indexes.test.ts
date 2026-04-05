// @vitest-environment node
import type Database from "better-sqlite3";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { NOW, createTestDb, insertGroupCategory, insertIdolGroup, insertQuizSession, insertScoreTier, setupBaseData } from "./test-helper";

let db: Database.Database;
beforeEach(() => { db = createTestDb(); setupBaseData(db); });
afterEach(() => { db.close(); });

describe("quiz_sessions の条件付きユニーク (in_progress のみ)", () => {
	it("同一 user/group で completed が複数存在可能", () => {
		for (let i = 1; i <= 3; i++) insertQuizSession(db, {
			quizSessionId: `s${i}`, status: "completed", currentQuestionOrder: null,
			answeredQuestionCount: 5, correctAnswerCount: 3, incorrectAnswerCount: 2, completedAt: NOW, lastAnsweredAt: NOW,
		});
		expect((db.prepare("SELECT count(*) as c FROM quiz_sessions").get() as { c: number }).c).toBe(3);
	});

	it("同一 user/group で abandoned が複数存在可能", () => {
		for (let i = 1; i <= 3; i++) insertQuizSession(db, { quizSessionId: `s${i}`, status: "abandoned", currentQuestionOrder: null });
		expect((db.prepare("SELECT count(*) as c FROM quiz_sessions").get() as { c: number }).c).toBe(3);
	});

	it("同一 user で別グループなら in_progress が複数可能", () => {
		insertGroupCategory(db, { groupCategoryId: "cat-2", slug: "jpop" });
		insertIdolGroup(db, { idolGroupId: "group-2", groupCategoryId: "cat-2", slug: "arashi" });
		insertQuizSession(db, { quizSessionId: "s1", idolGroupId: "group-1" });
		expect(() => insertQuizSession(db, { quizSessionId: "s2", idolGroupId: "group-2" })).not.toThrow();
	});

	it("completed → 再挑戦で同一 user/group の in_progress を 1 つ作れる", () => {
		insertQuizSession(db, {
			quizSessionId: "s-done", status: "completed", currentQuestionOrder: null,
			answeredQuestionCount: 5, correctAnswerCount: 5, incorrectAnswerCount: 0, completedAt: NOW, lastAnsweredAt: NOW,
		});
		expect(() => insertQuizSession(db, { quizSessionId: "s-retry" })).not.toThrow();
	});
});

describe("user_score_states の条件付きユニーク (scope 別)", () => {
	beforeEach(() => {
		insertScoreTier(db);
		insertScoreTier(db, { scoreTierId: "tier-g", tierScope: "group", tierName: "Bronze" });
	});
	const ins = (id: string, scope: string, groupId: string | null, tierId: string) =>
		db.prepare("INSERT INTO user_score_states (user_score_state_id, user_id, score_scope, idol_group_id, score_tier_id, score_total, answered_count, correct_count, updated_at) VALUES (?,?,?,?,?,?,?,?,?)").run(id, "user-1", scope, groupId, tierId, 0, 0, 0, NOW);

	it("overall 行は 1 ユーザーにつき 1 つまで", () => {
		ins("ov1", "overall", null, "tier-1");
		expect(() => ins("ov2", "overall", null, "tier-1")).toThrow();
	});

	it("同一 user + 同一 group の group 行は 1 つまで", () => {
		ins("gr1", "group", "group-1", "tier-g");
		expect(() => ins("gr2", "group", "group-1", "tier-g")).toThrow();
	});

	it("同一 user で別グループの group 行は複数可能", () => {
		insertGroupCategory(db, { groupCategoryId: "cat-2", slug: "jpop" });
		insertIdolGroup(db, { idolGroupId: "group-2", groupCategoryId: "cat-2", slug: "arashi" });
		ins("gr1", "group", "group-1", "tier-g");
		expect(() => ins("gr2", "group", "group-2", "tier-g")).not.toThrow();
	});

	it("overall 行と group 行は同一ユーザーで共存可能", () => {
		ins("ov", "overall", null, "tier-1");
		expect(() => ins("gr", "group", "group-1", "tier-g")).not.toThrow();
	});
});

describe("leaderboard_snapshots の条件付きユニーク (scope 別)", () => {
	const ins = (id: string, scope: string, groupId: string | null, at: string) =>
		db.prepare("INSERT INTO leaderboard_snapshots (leaderboard_snapshot_id, leaderboard_scope, idol_group_id, snapshot_at, created_at) VALUES (?,?,?,?,?)").run(id, scope, groupId, at, NOW);

	it("overall の同一時刻スナップショットは 1 つまで", () => {
		ins("ls1", "overall", null, "2025-01-01T00:00:00Z");
		expect(() => ins("ls2", "overall", null, "2025-01-01T00:00:00Z")).toThrow();
	});

	it("overall で異なる時刻のスナップショットは複数可能", () => {
		ins("ls1", "overall", null, "2025-01-01T00:00:00Z");
		expect(() => ins("ls2", "overall", null, "2025-01-02T00:00:00Z")).not.toThrow();
	});

	it("同一グループ・同一時刻の group スナップショットは 1 つまで", () => {
		ins("ls1", "group", "group-1", "2025-01-01T00:00:00Z");
		expect(() => ins("ls2", "group", "group-1", "2025-01-01T00:00:00Z")).toThrow();
	});

	it("異なるグループなら同一時刻でも可能", () => {
		insertGroupCategory(db, { groupCategoryId: "cat-2", slug: "jpop" });
		insertIdolGroup(db, { idolGroupId: "group-2", groupCategoryId: "cat-2", slug: "arashi" });
		ins("ls1", "group", "group-1", "2025-01-01T00:00:00Z");
		expect(() => ins("ls2", "group", "group-2", "2025-01-01T00:00:00Z")).not.toThrow();
	});

	it("overall と group は同一時刻で共存可能", () => {
		ins("ls1", "overall", null, "2025-01-01T00:00:00Z");
		expect(() => ins("ls2", "group", "group-1", "2025-01-01T00:00:00Z")).not.toThrow();
	});
});

describe("user_score_snapshots の条件付きユニーク (scope 別)", () => {
	const ins = (id: string, scope: string, groupId: string | null, date: string) =>
		db.prepare("INSERT INTO user_score_snapshots (user_score_snapshot_id, user_id, score_scope, idol_group_id, snapshot_date, score_total, created_at) VALUES (?,?,?,?,?,?,?)").run(id, "user-1", scope, groupId, date, 100, NOW);

	it("overall の同一日スナップショットは 1 つまで", () => {
		ins("ss1", "overall", null, "2025-01-01");
		expect(() => ins("ss2", "overall", null, "2025-01-01")).toThrow();
	});
	it("overall で異なる日のスナップショットは複数可能", () => {
		ins("ss1", "overall", null, "2025-01-01");
		expect(() => ins("ss2", "overall", null, "2025-01-02")).not.toThrow();
	});
	it("同一 group・同一日の group スナップショットは 1 つまで", () => {
		ins("ss1", "group", "group-1", "2025-01-01");
		expect(() => ins("ss2", "group", "group-1", "2025-01-01")).toThrow();
	});
	it("異なるグループなら同一日でも可能", () => {
		insertGroupCategory(db, { groupCategoryId: "cat-2", slug: "jpop" });
		insertIdolGroup(db, { idolGroupId: "group-2", groupCategoryId: "cat-2", slug: "arashi" });
		ins("ss1", "group", "group-1", "2025-01-01");
		expect(() => ins("ss2", "group", "group-2", "2025-01-01")).not.toThrow();
	});
});
