// @vitest-environment node
import type Database from "better-sqlite3";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
	createTestDb,
	insertEvent,
	insertEventGroup,
	insertEventParticipant,
	insertGroupCategory,
	insertIdolGroup,
	insertUser,
	NOW,
} from "./test-helper";

let db: Database.Database;
const t = (h: number) => `2025-03-01T${String(h).padStart(2, "0")}:00:00Z`;
beforeEach(async () => {
	db = createTestDb();
	await insertUser(db, { userId: "organizer" });
	await insertUser(db, { userId: "fan-a" });
	await insertUser(db, { userId: "fan-b" });
	await insertGroupCategory(db);
	await insertIdolGroup(db, { idolGroupId: "twice", slug: "twice" });
	await insertIdolGroup(db, { idolGroupId: "ive", slug: "ive" });
});
afterEach(() => {
	db.close();
});

const insEvent = (id: string, vis = "public", cap: number | null = null) =>
	insertEvent(db, {
		eventId: id,
		createdByUserId: "organizer",
		title: "Live",
		visibility: vis,
		capacity: cap,
		startsAt: t(10),
		endsAt: t(18),
		createdAt: NOW,
		updatedAt: NOW,
	});
const insParticipant = (id: string, eventId: string, userId: string, status = "joined") =>
	insertEventParticipant(db, { eventParticipantId: id, eventId, userId, participationStatus: status, joinedAt: NOW, updatedAt: NOW });

describe("イベント作成→グループ紐付け→参加→キャンセル→再参加", () => {
	it("ライフサイクル全体が正常に動作する", async () => {
		await insEvent("ev-1");
		await insertEventGroup(db, { eventGroupId: "eg-1", eventId: "ev-1", idolGroupId: "twice", createdAt: NOW });
		await insertEventGroup(db, { eventGroupId: "eg-2", eventId: "ev-1", idolGroupId: "ive", createdAt: NOW });
		expect((db.prepare("SELECT count(*) as c FROM event_groups WHERE event_id=?").get("ev-1") as { c: number }).c).toBe(2);

		await insParticipant("ep-a", "ev-1", "fan-a");
		await insParticipant("ep-b", "ev-1", "fan-b");

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
	it("private イベントに capacity 付きで参加者を管理", async () => {
		await insEvent("ev-priv", "private", 2);
		await insParticipant("ep-a", "ev-priv", "fan-a");
		await insParticipant("ep-b", "ev-priv", "fan-b");
		const count = (
			db.prepare("SELECT count(*) as c FROM event_participants WHERE event_id=? AND participation_status='joined'").get("ev-priv") as { c: number }
		).c;
		expect(count).toBe(2);
	});

	it("capacity を超えた参加は DB 制約では防げない（アプリ側で検証）", async () => {
		await insEvent("ev-cap", "public", 1);
		await insParticipant("ep-a", "ev-cap", "fan-a");
		await expect(insParticipant("ep-b", "ev-cap", "fan-b")).resolves.toBeDefined();
	});

	it("waitlisted → joined への状態遷移", async () => {
		await insEvent("ev-wl", "public", 1);
		await insParticipant("ep-a", "ev-wl", "fan-a");
		await insParticipant("ep-b", "ev-wl", "fan-b", "waitlisted");
		db.prepare("UPDATE event_participants SET participation_status='cancelled', updated_at=? WHERE event_participant_id=?").run(NOW, "ep-a");
		db.prepare("UPDATE event_participants SET participation_status='joined', updated_at=? WHERE event_participant_id=?").run(NOW, "ep-b");
		const b = db.prepare("SELECT participation_status FROM event_participants WHERE event_participant_id=?").get("ep-b") as {
			participation_status: string;
		};
		expect(b.participation_status).toBe("joined");
	});
});

describe("イベント削除時の連鎖", () => {
	it("イベント削除で参加者とグループ紐付けが全て消える", async () => {
		await insEvent("ev-del");
		await insertEventGroup(db, { eventGroupId: "eg-1", eventId: "ev-del", idolGroupId: "twice", createdAt: NOW });
		await insParticipant("ep-a", "ev-del", "fan-a");
		await insParticipant("ep-b", "ev-del", "fan-b");
		db.prepare("DELETE FROM events WHERE event_id=?").run("ev-del");
		expect((db.prepare("SELECT count(*) as c FROM event_groups WHERE event_id=?").get("ev-del") as { c: number }).c).toBe(0);
		expect((db.prepare("SELECT count(*) as c FROM event_participants WHERE event_id=?").get("ev-del") as { c: number }).c).toBe(0);
	});
});
