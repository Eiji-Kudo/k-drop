// @vitest-environment node
import type Database from "better-sqlite3";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { NOW, createTestDb, insertGroupCategory, insertIdolGroup, insertUser } from "./test-helper";

let db: Database.Database;
beforeEach(() => {
	db = createTestDb();
	insertUser(db, { userId: "u1" });
	insertUser(db, { userId: "u2" });
	insertUser(db, { userId: "u3" });
	insertGroupCategory(db);
	insertIdolGroup(db);
});
afterEach(() => { db.close(); });

const insSnapshot = (id: string, scope: string, groupId: string | null, at: string) =>
	db.prepare("INSERT INTO leaderboard_snapshots (leaderboard_snapshot_id, leaderboard_scope, idol_group_id, snapshot_at, created_at) VALUES (?,?,?,?,?)").run(id, scope, groupId, at, NOW);
const insEntry = (id: string, snapId: string, userId: string, rank: number, score: number) =>
	db.prepare("INSERT INTO leaderboard_entries (leaderboard_entry_id, leaderboard_snapshot_id, user_id, display_rank, display_score) VALUES (?,?,?,?,?)").run(id, snapId, userId, rank, score);

describe("ランキングスナップショットの生成と管理", () => {
	it("3人のユーザーを順位付けしたランキングを作成", () => {
		insSnapshot("ls-1", "overall", null, "2025-01-01T00:00:00Z");
		insEntry("le-1", "ls-1", "u1", 1, 300);
		insEntry("le-2", "ls-1", "u2", 2, 200);
		insEntry("le-3", "ls-1", "u3", 3, 100);

		const entries = db.prepare("SELECT * FROM leaderboard_entries WHERE leaderboard_snapshot_id=? ORDER BY display_rank").all("ls-1") as Record<string, unknown>[];
		expect(entries).toHaveLength(3);
		expect(entries[0].user_id).toBe("u1");
		expect(entries[0].display_score).toBe(300);
		expect(entries[2].display_rank).toBe(3);
	});

	it("日次で複数スナップショットを蓄積し、順位変動を追跡", () => {
		insSnapshot("ls-d1", "overall", null, "2025-01-01T00:00:00Z");
		insEntry("le-d1-1", "ls-d1", "u1", 1, 100);
		insEntry("le-d1-2", "ls-d1", "u2", 2, 50);

		insSnapshot("ls-d2", "overall", null, "2025-01-02T00:00:00Z");
		insEntry("le-d2-1", "ls-d2", "u2", 1, 200);
		insEntry("le-d2-2", "ls-d2", "u1", 2, 150);

		const day1 = db.prepare("SELECT user_id FROM leaderboard_entries WHERE leaderboard_snapshot_id=? AND display_rank=1").get("ls-d1") as { user_id: string };
		const day2 = db.prepare("SELECT user_id FROM leaderboard_entries WHERE leaderboard_snapshot_id=? AND display_rank=1").get("ls-d2") as { user_id: string };
		expect(day1.user_id).toBe("u1");
		expect(day2.user_id).toBe("u2");
	});
});

describe("グループ別ランキングと総合ランキングの共存", () => {
	it("同一時刻で overall と group のスナップショットを両方作成", () => {
		const at = "2025-01-01T00:00:00Z";
		insSnapshot("ls-ov", "overall", null, at);
		insSnapshot("ls-gr", "group", "group-1", at);
		insEntry("le-ov-1", "ls-ov", "u1", 1, 500);
		insEntry("le-gr-1", "ls-gr", "u1", 1, 300);

		const ovScore = (db.prepare("SELECT display_score FROM leaderboard_entries WHERE leaderboard_entry_id=?").get("le-ov-1") as { display_score: number }).display_score;
		const grScore = (db.prepare("SELECT display_score FROM leaderboard_entries WHERE leaderboard_entry_id=?").get("le-gr-1") as { display_score: number }).display_score;
		expect(ovScore).toBe(500);
		expect(grScore).toBe(300);
	});
});

describe("スコアスナップショットからの履歴追跡", () => {
	it("日次スコアスナップショットでスコア推移を記録", () => {
		db.prepare("INSERT INTO user_score_snapshots (user_score_snapshot_id, user_id, score_scope, idol_group_id, snapshot_date, score_total, created_at) VALUES (?,?,?,?,?,?,?)").run("ss-d1", "u1", "overall", null, "2025-01-01", 100, NOW);
		db.prepare("INSERT INTO user_score_snapshots (user_score_snapshot_id, user_id, score_scope, idol_group_id, snapshot_date, score_total, created_at) VALUES (?,?,?,?,?,?,?)").run("ss-d2", "u1", "overall", null, "2025-01-02", 150, NOW);
		db.prepare("INSERT INTO user_score_snapshots (user_score_snapshot_id, user_id, score_scope, idol_group_id, snapshot_date, score_total, created_at) VALUES (?,?,?,?,?,?,?)").run("ss-d3", "u1", "overall", null, "2025-01-03", 250, NOW);

		const snapshots = db.prepare("SELECT snapshot_date, score_total FROM user_score_snapshots WHERE user_id=? AND score_scope='overall' ORDER BY snapshot_date").all("u1") as { snapshot_date: string; score_total: number }[];
		expect(snapshots).toHaveLength(3);
		expect(snapshots[0].score_total).toBe(100);
		expect(snapshots[2].score_total).toBe(250);
	});

	it("overall と group のスナップショットを同日に記録", () => {
		db.prepare("INSERT INTO user_score_snapshots (user_score_snapshot_id, user_id, score_scope, idol_group_id, snapshot_date, score_total, created_at) VALUES (?,?,?,?,?,?,?)").run("ss-ov", "u1", "overall", null, "2025-01-01", 200, NOW);
		db.prepare("INSERT INTO user_score_snapshots (user_score_snapshot_id, user_id, score_scope, idol_group_id, snapshot_date, score_total, created_at) VALUES (?,?,?,?,?,?,?)").run("ss-gr", "u1", "group", "group-1", "2025-01-01", 120, NOW);

		const ov = db.prepare("SELECT score_total FROM user_score_snapshots WHERE user_score_snapshot_id=?").get("ss-ov") as { score_total: number };
		const gr = db.prepare("SELECT score_total FROM user_score_snapshots WHERE user_score_snapshot_id=?").get("ss-gr") as { score_total: number };
		expect(ov.score_total).toBe(200);
		expect(gr.score_total).toBe(120);
	});
});
