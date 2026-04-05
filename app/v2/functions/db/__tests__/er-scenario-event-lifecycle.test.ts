// @vitest-environment node
import type Database from "better-sqlite3";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createTestDb, insertGroupCategory, insertIdolGroup, insertUser, NOW } from "./test-helper";

let db: Database.Database;
const t = (h: number) => `2025-03-01T${String(h).padStart(2, "0")}:00:00Z`;
beforeEach(() => {
	db = createTestDb();
	insertUser(db, { userId: "organizer" });
	insertUser(db, { userId: "fan-a" });
	insertUser(db, { userId: "fan-b" });
	insertGroupCategory(db);
	insertIdolGroup(db, { idolGroupId: "twice", slug: "twice" });
	insertIdolGroup(db, { idolGroupId: "ive", slug: "ive" });
});
afterEach(() => {
	db.close();
});

const insEvent = (id: string, vis = "public", cap: number | null = null) =>
	db
		.prepare(
			"INSERT INTO events (event_id, created_by_user_id, title, visibility, capacity, starts_at, ends_at, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?)",
		)
		.run(id, "organizer", "Live", vis, cap, t(10), t(18), NOW, NOW);
const insParticipant = (id: string, eventId: string, userId: string, status = "joined") =>
	db
		.prepare(
			"INSERT INTO event_participants (event_participant_id, event_id, user_id, participation_status, joined_at, updated_at) VALUES (?,?,?,?,?,?)",
		)
		.run(id, eventId, userId, status, NOW, NOW);

describe("イベント作成→グループ紐付け→参加→キャンセル→再参加", () => {
	it("ライフサイクル全体が正常に動作する", () => {
		insEvent("ev-1");
		db.prepare("INSERT INTO event_groups (event_group_id, event_id, idol_group_id, created_at) VALUES (?,?,?,?)").run("eg-1", "ev-1", "twice", NOW);
		db.prepare("INSERT INTO event_groups (event_group_id, event_id, idol_group_id, created_at) VALUES (?,?,?,?)").run("eg-2", "ev-1", "ive", NOW);
		expect((db.prepare("SELECT count(*) as c FROM event_groups WHERE event_id=?").get("ev-1") as { c: number }).c).toBe(2);

		insParticipant("ep-a", "ev-1", "fan-a");
		insParticipant("ep-b", "ev-1", "fan-b");

		db.prepare("UPDATE event_participants SET participation_status='cancelled', updated_at=? WHERE event_participant_id=?").run(NOW, "ep-a");
		const cancelled = db.prepare("SELECT participation_status FROM event_participants WHERE event_participant_id=?").get("ep-a") as {
			participation_status: string;
		};
		expect(cancelled.participation_status).toBe("cancelled");

		db.prepare("UPDATE event_participants SET participation_status='joined', updated_at=? WHERE event_participant_id=?").run(NOW, "ep-a");
		const rejoined = db.prepare("SELECT participation_status FROM event_participants WHERE event_participant_id=?").get("ep-a") as {
			participation_status: string;
		};
		expect(rejoined.participation_status).toBe("joined");
	});
});

describe("非公開イベントとキャパシティ管理", () => {
	it("private イベントに capacity 付きで参加者を管理", () => {
		insEvent("ev-priv", "private", 2);
		insParticipant("ep-a", "ev-priv", "fan-a");
		insParticipant("ep-b", "ev-priv", "fan-b");
		const count = (
			db.prepare("SELECT count(*) as c FROM event_participants WHERE event_id=? AND participation_status='joined'").get("ev-priv") as { c: number }
		).c;
		expect(count).toBe(2);
	});

	it("capacity を超えた参加は DB 制約では防げない（アプリ側で検証）", () => {
		insEvent("ev-cap", "public", 1);
		insParticipant("ep-a", "ev-cap", "fan-a");
		expect(() => insParticipant("ep-b", "ev-cap", "fan-b")).not.toThrow();
	});

	it("waitlisted → joined への状態遷移", () => {
		insEvent("ev-wl", "public", 1);
		insParticipant("ep-a", "ev-wl", "fan-a");
		insParticipant("ep-b", "ev-wl", "fan-b", "waitlisted");
		db.prepare("UPDATE event_participants SET participation_status='cancelled', updated_at=? WHERE event_participant_id=?").run(NOW, "ep-a");
		db.prepare("UPDATE event_participants SET participation_status='joined', updated_at=? WHERE event_participant_id=?").run(NOW, "ep-b");
		const b = db.prepare("SELECT participation_status FROM event_participants WHERE event_participant_id=?").get("ep-b") as {
			participation_status: string;
		};
		expect(b.participation_status).toBe("joined");
	});
});

describe("イベント削除時の連鎖", () => {
	it("イベント削除で参加者とグループ紐付けが全て消える", () => {
		insEvent("ev-del");
		db.prepare("INSERT INTO event_groups (event_group_id, event_id, idol_group_id, created_at) VALUES (?,?,?,?)").run("eg-1", "ev-del", "twice", NOW);
		insParticipant("ep-a", "ev-del", "fan-a");
		insParticipant("ep-b", "ev-del", "fan-b");
		db.prepare("DELETE FROM events WHERE event_id=?").run("ev-del");
		expect((db.prepare("SELECT count(*) as c FROM event_groups WHERE event_id=?").get("ev-del") as { c: number }).c).toBe(0);
		expect((db.prepare("SELECT count(*) as c FROM event_participants WHERE event_id=?").get("ev-del") as { c: number }).c).toBe(0);
	});
});
