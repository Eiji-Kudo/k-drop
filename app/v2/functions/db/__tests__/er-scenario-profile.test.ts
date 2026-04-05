// @vitest-environment node
import type Database from "better-sqlite3";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
	createTestDb,
	insertGroupCategory,
	insertIdolGroup,
	insertUser,
	insertUserFavoriteGroup,
	insertUserProfile,
	NOW,
	setupBaseData,
} from "./test-helper";

let db: Database.Database;
beforeEach(() => {
	db = createTestDb();
});
afterEach(() => {
	db.close();
});

const insProfile = (userId: string, handle: string, displayName: string, bio: string | null = null) =>
	insertUserProfile(db, { userId, handle, displayName, avatarUrl: null, bio, fanSince: null, createdAt: NOW, updatedAt: NOW });

describe("プロフィール管理", () => {
	beforeEach(async () => await insertUser(db));

	it("プロフィールをフル情報で作成", async () => {
		await insertUserProfile(db, {
			userId: "user-1",
			handle: "momo_lover",
			displayName: "モモ推し",
			avatarUrl: "https://example.com/avatar.jpg",
			bio: "TWICEのモモが大好き！",
			fanSince: "2020-03-15",
			createdAt: NOW,
			updatedAt: NOW,
		});
		const p = db.prepare("SELECT * FROM user_profiles WHERE user_id=?").get("user-1") as Record<string, unknown>;
		expect(p.handle).toBe("momo_lover");
		expect(p.avatar_url).toBe("https://example.com/avatar.jpg");
		expect(p.fan_since).toBe("2020-03-15");
	});

	it("handle の変更", async () => {
		await insProfile("user-1", "old_handle", "User");
		db.prepare("UPDATE user_profiles SET handle='new_handle', updated_at=? WHERE user_id=?").run(NOW, "user-1");
		expect((db.prepare("SELECT handle FROM user_profiles WHERE user_id=?").get("user-1") as { handle: string }).handle).toBe("new_handle");
	});

	it("handle 変更後に旧 handle を別ユーザーが取得可能", async () => {
		await insertUser(db, { userId: "user-2" });
		await insProfile("user-1", "cool_name", "User 1");
		db.prepare("UPDATE user_profiles SET handle='new_name', updated_at=? WHERE user_id=?").run(NOW, "user-1");
		await expect(insProfile("user-2", "cool_name", "User 2")).resolves.toBeDefined();
	});

	it("bio と avatar_url は NULL 許容", async () => {
		await insProfile("user-1", "minimal", "Minimal User");
		const p = db.prepare("SELECT bio, avatar_url FROM user_profiles WHERE user_id=?").get("user-1") as Record<string, unknown>;
		expect(p.bio).toBeNull();
		expect(p.avatar_url).toBeNull();
	});
});

describe("推しグループの管理", () => {
	beforeEach(async () => {
		await setupBaseData(db);
		await insertGroupCategory(db, { groupCategoryId: "cat-2", slug: "jpop" });
		await insertIdolGroup(db, { idolGroupId: "ive", groupCategoryId: "cat-2", slug: "ive" });
	});

	it("複数グループを推し登録", async () => {
		await insertUserFavoriteGroup(db, {
			userFavoriteGroupId: "f1",
			userId: "user-1",
			idolGroupId: "group-1",
			startedSupportingOn: "2019-06-01",
			createdAt: NOW,
		});
		await insertUserFavoriteGroup(db, {
			userFavoriteGroupId: "f2",
			userId: "user-1",
			idolGroupId: "ive",
			startedSupportingOn: "2021-12-01",
			createdAt: NOW,
		});
		const favs = db.prepare("SELECT idol_group_id FROM user_favorite_groups WHERE user_id=? ORDER BY created_at").all("user-1") as {
			idol_group_id: string;
		}[];
		expect(favs.map((f) => f.idol_group_id)).toEqual(["group-1", "ive"]);
	});

	it("推し登録を解除して再登録", async () => {
		await insertUserFavoriteGroup(db, { userFavoriteGroupId: "f1", userId: "user-1", idolGroupId: "group-1", createdAt: NOW });
		db.prepare("DELETE FROM user_favorite_groups WHERE user_favorite_group_id=?").run("f1");
		await expect(
			insertUserFavoriteGroup(db, { userFavoriteGroupId: "f2", userId: "user-1", idolGroupId: "group-1", createdAt: NOW }),
		).resolves.toBeDefined();
	});

	it("グループ削除で推し関係も消える", async () => {
		await insertUserFavoriteGroup(db, { userFavoriteGroupId: "f1", userId: "user-1", idolGroupId: "ive", createdAt: NOW });
		db.prepare("DELETE FROM idol_groups WHERE idol_group_id=?").run("ive");
		expect((db.prepare("SELECT count(*) as c FROM user_favorite_groups WHERE idol_group_id=?").get("ive") as { c: number }).c).toBe(0);
	});
});
