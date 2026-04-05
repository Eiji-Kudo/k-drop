// @vitest-environment node
import type Database from "better-sqlite3";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createTestDb, insertGroupCategory, insertIdolGroup, insertUser, NOW, setupBaseData } from "./test-helper";

let db: Database.Database;
beforeEach(() => {
	db = createTestDb();
});
afterEach(() => {
	db.close();
});

const insProfile = (userId: string, handle: string, displayName: string, bio: string | null = null) =>
	db
		.prepare("INSERT INTO user_profiles (user_id, handle, display_name, avatar_url, bio, fan_since, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)")
		.run(userId, handle, displayName, null, bio, null, NOW, NOW);

describe("プロフィール管理", () => {
	beforeEach(() => insertUser(db));

	it("プロフィールをフル情報で作成", () => {
		db.prepare(
			"INSERT INTO user_profiles (user_id, handle, display_name, avatar_url, bio, fan_since, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)",
		).run("user-1", "momo_lover", "モモ推し", "https://example.com/avatar.jpg", "TWICEのモモが大好き！", "2020-03-15", NOW, NOW);
		const p = db.prepare("SELECT * FROM user_profiles WHERE user_id=?").get("user-1") as Record<string, unknown>;
		expect(p.handle).toBe("momo_lover");
		expect(p.avatar_url).toBe("https://example.com/avatar.jpg");
		expect(p.fan_since).toBe("2020-03-15");
	});

	it("handle の変更", () => {
		insProfile("user-1", "old_handle", "User");
		db.prepare("UPDATE user_profiles SET handle='new_handle', updated_at=? WHERE user_id=?").run(NOW, "user-1");
		expect((db.prepare("SELECT handle FROM user_profiles WHERE user_id=?").get("user-1") as { handle: string }).handle).toBe("new_handle");
	});

	it("handle 変更後に旧 handle を別ユーザーが取得可能", () => {
		insertUser(db, { userId: "user-2" });
		insProfile("user-1", "cool_name", "User 1");
		db.prepare("UPDATE user_profiles SET handle='new_name', updated_at=? WHERE user_id=?").run(NOW, "user-1");
		expect(() => insProfile("user-2", "cool_name", "User 2")).not.toThrow();
	});

	it("bio と avatar_url は NULL 許容", () => {
		insProfile("user-1", "minimal", "Minimal User");
		const p = db.prepare("SELECT bio, avatar_url FROM user_profiles WHERE user_id=?").get("user-1") as Record<string, unknown>;
		expect(p.bio).toBeNull();
		expect(p.avatar_url).toBeNull();
	});
});

describe("推しグループの管理", () => {
	beforeEach(() => {
		setupBaseData(db);
		insertGroupCategory(db, { groupCategoryId: "cat-2", slug: "jpop" });
		insertIdolGroup(db, { idolGroupId: "ive", groupCategoryId: "cat-2", slug: "ive" });
	});

	it("複数グループを推し登録", () => {
		db.prepare(
			"INSERT INTO user_favorite_groups (user_favorite_group_id, user_id, idol_group_id, started_supporting_on, created_at) VALUES (?,?,?,?,?)",
		).run("f1", "user-1", "group-1", "2019-06-01", NOW);
		db.prepare(
			"INSERT INTO user_favorite_groups (user_favorite_group_id, user_id, idol_group_id, started_supporting_on, created_at) VALUES (?,?,?,?,?)",
		).run("f2", "user-1", "ive", "2021-12-01", NOW);
		const favs = db.prepare("SELECT idol_group_id FROM user_favorite_groups WHERE user_id=? ORDER BY created_at").all("user-1") as {
			idol_group_id: string;
		}[];
		expect(favs.map((f) => f.idol_group_id)).toEqual(["group-1", "ive"]);
	});

	it("推し登録を解除して再登録", () => {
		db.prepare("INSERT INTO user_favorite_groups (user_favorite_group_id, user_id, idol_group_id, created_at) VALUES (?,?,?,?)").run(
			"f1",
			"user-1",
			"group-1",
			NOW,
		);
		db.prepare("DELETE FROM user_favorite_groups WHERE user_favorite_group_id=?").run("f1");
		expect(() =>
			db
				.prepare("INSERT INTO user_favorite_groups (user_favorite_group_id, user_id, idol_group_id, created_at) VALUES (?,?,?,?)")
				.run("f2", "user-1", "group-1", NOW),
		).not.toThrow();
	});

	it("グループ削除で推し関係も消える", () => {
		db.prepare("INSERT INTO user_favorite_groups (user_favorite_group_id, user_id, idol_group_id, created_at) VALUES (?,?,?,?)").run(
			"f1",
			"user-1",
			"ive",
			NOW,
		);
		db.prepare("DELETE FROM idol_groups WHERE idol_group_id=?").run("ive");
		expect((db.prepare("SELECT count(*) as c FROM user_favorite_groups WHERE idol_group_id=?").get("ive") as { c: number }).c).toBe(0);
	});
});
