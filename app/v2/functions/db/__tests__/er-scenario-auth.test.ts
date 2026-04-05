// @vitest-environment node
import type Database from "better-sqlite3";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createTestDb, insertUser, NOW } from "./test-helper";

let db: Database.Database;
beforeEach(() => {
	db = createTestDb();
	insertUser(db);
});
afterEach(() => {
	db.close();
});

const insAuth = (id: string, userId: string, provider: string, sub: string) =>
	db
		.prepare("INSERT INTO auth_identities (auth_identity_id, user_id, provider, provider_subject_id, created_at, updated_at) VALUES (?,?,?,?,?,?)")
		.run(id, userId, provider, sub, NOW, NOW);

describe("認証プロバイダの管理", () => {
	it("1 ユーザーが Google + LINE の 2 つのログイン手段を持つ", () => {
		insAuth("ai-g", "user-1", "google", "g-sub-1");
		insAuth("ai-l", "user-1", "line", "l-sub-1");
		const count = (db.prepare("SELECT count(*) as c FROM auth_identities WHERE user_id=?").get("user-1") as { c: number }).c;
		expect(count).toBe(2);
	});

	it("認証手段を追加した後に 1 つ削除しても残りが機能する", () => {
		insAuth("ai-g", "user-1", "google", "g-sub-1");
		insAuth("ai-l", "user-1", "line", "l-sub-1");
		db.prepare("DELETE FROM auth_identities WHERE auth_identity_id=?").run("ai-g");
		const remaining = db.prepare("SELECT provider FROM auth_identities WHERE user_id=?").all("user-1") as { provider: string }[];
		expect(remaining).toHaveLength(1);
		expect(remaining[0].provider).toBe("line");
	});

	it("異なるユーザーが同じプロバイダで別アカウントを持てる", () => {
		insertUser(db, { userId: "user-2" });
		insAuth("ai-1", "user-1", "google", "g-sub-1");
		insAuth("ai-2", "user-2", "google", "g-sub-2");
		expect((db.prepare("SELECT count(*) as c FROM auth_identities WHERE provider='google'").get() as { c: number }).c).toBe(2);
	});

	it("ユーザー削除時に全認証手段がカスケード削除される", () => {
		insAuth("ai-g", "user-1", "google", "g-sub-1");
		insAuth("ai-l", "user-1", "line", "l-sub-1");
		insAuth("ai-a", "user-1", "apple", "a-sub-1");
		db.prepare("DELETE FROM users WHERE user_id=?").run("user-1");
		expect((db.prepare("SELECT count(*) as c FROM auth_identities").get() as { c: number }).c).toBe(0);
	});
});

describe("ユーザーステータスのライフサイクル", () => {
	it("active → suspended → active に復帰", () => {
		db.prepare("UPDATE users SET status='suspended', updated_at=? WHERE user_id=?").run(NOW, "user-1");
		expect((db.prepare("SELECT status FROM users WHERE user_id=?").get("user-1") as { status: string }).status).toBe("suspended");
		db.prepare("UPDATE users SET status='active', updated_at=? WHERE user_id=?").run(NOW, "user-1");
		expect((db.prepare("SELECT status FROM users WHERE user_id=?").get("user-1") as { status: string }).status).toBe("active");
	});

	it("active → deleted の論理削除", () => {
		db.prepare("UPDATE users SET status='deleted', updated_at=? WHERE user_id=?").run(NOW, "user-1");
		expect((db.prepare("SELECT status FROM users WHERE user_id=?").get("user-1") as { status: string }).status).toBe("deleted");
	});
});
