// @vitest-environment node
import type Database from "better-sqlite3";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createTestDb, insertGroupCategory, insertIdolGroup, insertQuiz, insertUser, NOW } from "./test-helper";

let db: Database.Database;
beforeEach(() => {
	db = createTestDb();
});
afterEach(() => {
	db.close();
});

describe("グループカテゴリとグループの管理", () => {
	it("カテゴリ配下に複数グループを配置", () => {
		insertGroupCategory(db, { groupCategoryId: "cat-kpop", slug: "kpop" });
		insertIdolGroup(db, { idolGroupId: "twice", groupCategoryId: "cat-kpop", slug: "twice" });
		insertIdolGroup(db, { idolGroupId: "ive", groupCategoryId: "cat-kpop", slug: "ive" });
		insertIdolGroup(db, { idolGroupId: "aespa", groupCategoryId: "cat-kpop", slug: "aespa" });
		const groups = db.prepare("SELECT idol_group_id FROM idol_groups WHERE group_category_id=?").all("cat-kpop") as { idol_group_id: string }[];
		expect(groups).toHaveLength(3);
	});

	it("複数カテゴリを sort_order で整列", () => {
		db.prepare("INSERT INTO group_categories (group_category_id, slug, category_name, sort_order) VALUES (?,?,?,?)").run("c1", "kpop", "K-POP", 1);
		db.prepare("INSERT INTO group_categories (group_category_id, slug, category_name, sort_order) VALUES (?,?,?,?)").run("c2", "jpop", "J-POP", 2);
		db.prepare("INSERT INTO group_categories (group_category_id, slug, category_name, sort_order) VALUES (?,?,?,?)").run("c3", "cpop", "C-POP", 3);
		const cats = db.prepare("SELECT slug FROM group_categories ORDER BY sort_order").all() as { slug: string }[];
		expect(cats.map((c) => c.slug)).toEqual(["kpop", "jpop", "cpop"]);
	});
});

describe("グループのステータス管理", () => {
	beforeEach(() => insertGroupCategory(db));

	it("active → inactive → archived のライフサイクル", () => {
		insertIdolGroup(db);
		db.prepare("UPDATE idol_groups SET status='inactive', updated_at=? WHERE idol_group_id=?").run(NOW, "group-1");
		expect((db.prepare("SELECT status FROM idol_groups WHERE idol_group_id=?").get("group-1") as { status: string }).status).toBe("inactive");
		db.prepare("UPDATE idol_groups SET status='archived', updated_at=? WHERE idol_group_id=?").run(NOW, "group-1");
		expect((db.prepare("SELECT status FROM idol_groups WHERE idol_group_id=?").get("group-1") as { status: string }).status).toBe("archived");
	});

	it("archived グループのクイズも残るが、新しいクイズは追加可能", () => {
		insertIdolGroup(db);
		insertQuiz(db, { quizId: "q-old" });
		db.prepare("UPDATE idol_groups SET status='archived', updated_at=? WHERE idol_group_id=?").run(NOW, "group-1");
		expect(() => insertQuiz(db, { quizId: "q-new" })).not.toThrow();
		expect((db.prepare("SELECT count(*) as c FROM quizzes WHERE idol_group_id=?").get("group-1") as { c: number }).c).toBe(2);
	});
});

describe("グループ削除時の影響範囲", () => {
	it("グループ削除でクイズ・推し関係・セッションが全て消える", () => {
		insertGroupCategory(db);
		insertIdolGroup(db);
		insertUser(db);
		insertQuiz(db);
		db.prepare("INSERT INTO user_favorite_groups (user_favorite_group_id, user_id, idol_group_id, created_at) VALUES (?,?,?,?)").run(
			"f1",
			"user-1",
			"group-1",
			NOW,
		);
		db.prepare(
			"INSERT INTO quiz_sessions (quiz_session_id, user_id, idol_group_id, status, total_question_count, answered_question_count, correct_answer_count, incorrect_answer_count, current_question_order, started_at, last_answered_at, completed_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
		).run("s1", "user-1", "group-1", "in_progress", 1, 0, 0, 0, 1, NOW, null, null);
		db.prepare("DELETE FROM idol_groups WHERE idol_group_id=?").run("group-1");
		expect((db.prepare("SELECT count(*) as c FROM quizzes WHERE idol_group_id=?").get("group-1") as { c: number }).c).toBe(0);
		expect((db.prepare("SELECT count(*) as c FROM user_favorite_groups WHERE idol_group_id=?").get("group-1") as { c: number }).c).toBe(0);
		expect((db.prepare("SELECT count(*) as c FROM quiz_sessions WHERE idol_group_id=?").get("group-1") as { c: number }).c).toBe(0);
	});
});
