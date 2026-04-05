// @vitest-environment node
import type Database from "better-sqlite3";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createTestDb, insertGroupCategory, insertIdolGroup, insertQuiz, insertQuizChoice, insertScoreTier, insertUser, NOW } from "./test-helper";

let db: Database.Database;
beforeEach(() => {
	db = createTestDb();
	insertUser(db, { userId: "alice" });
	insertUser(db, { userId: "bob" });
	insertGroupCategory(db);
	insertIdolGroup(db);
	insertQuiz(db, { quizId: "q1" });
	insertQuizChoice(db, { quizChoiceId: "c1-ok", quizId: "q1", choiceOrder: 1, isCorrect: 1 });
	insertQuizChoice(db, { quizChoiceId: "c1-ng", quizId: "q1", choiceOrder: 2, isCorrect: 0 });
	insertScoreTier(db);
	insertScoreTier(db, { scoreTierId: "tier-g", tierScope: "group", tierName: "Bronze" });
});
afterEach(() => {
	db.close();
});

const insSession = (id: string, userId: string) =>
	db
		.prepare(
			"INSERT INTO quiz_sessions (quiz_session_id, user_id, idol_group_id, status, total_question_count, answered_question_count, correct_answer_count, incorrect_answer_count, current_question_order, started_at, last_answered_at, completed_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
		)
		.run(id, userId, "group-1", "in_progress", 1, 0, 0, 0, 1, NOW, null, null);

describe("複数ユーザーが同じグループで同時にクイズに挑戦", () => {
	it("alice と bob が同時に in_progress セッションを持てる", () => {
		insSession("s-alice", "alice");
		expect(() => insSession("s-bob", "bob")).not.toThrow();
	});

	it("それぞれが独立にクイズを完了し、スコアが独立に蓄積", () => {
		insSession("s-alice", "alice");
		insSession("s-bob", "bob");

		db.prepare(
			"INSERT INTO quiz_session_questions (quiz_session_question_id, quiz_session_id, quiz_id, question_order, created_at) VALUES (?,?,?,?,?)",
		).run("sq-a", "s-alice", "q1", 1, NOW);
		db.prepare(
			"INSERT INTO quiz_session_questions (quiz_session_question_id, quiz_session_id, quiz_id, question_order, created_at) VALUES (?,?,?,?,?)",
		).run("sq-b", "s-bob", "q1", 1, NOW);

		db.prepare(
			"INSERT INTO quiz_answers (quiz_answer_id, quiz_session_question_id, quiz_choice_id, awarded_score, answered_at) VALUES (?,?,?,?,?)",
		).run("a-a", "sq-a", "c1-ok", 10, NOW);
		db.prepare(
			"UPDATE quiz_sessions SET answered_question_count=1, correct_answer_count=1, current_question_order=NULL, status='completed', completed_at=?, last_answered_at=? WHERE quiz_session_id=?",
		).run(NOW, NOW, "s-alice");

		db.prepare(
			"INSERT INTO quiz_answers (quiz_answer_id, quiz_session_question_id, quiz_choice_id, awarded_score, answered_at) VALUES (?,?,?,?,?)",
		).run("a-b", "sq-b", "c1-ng", 0, NOW);
		db.prepare(
			"UPDATE quiz_sessions SET answered_question_count=1, correct_answer_count=0, incorrect_answer_count=1, current_question_order=NULL, status='completed', completed_at=?, last_answered_at=? WHERE quiz_session_id=?",
		).run(NOW, NOW, "s-bob");

		db.transaction(() => {
			db.prepare(
				"INSERT INTO user_score_states (user_score_state_id, user_id, score_scope, idol_group_id, score_tier_id, score_total, answered_count, correct_count, last_answered_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)",
			).run("ov-a", "alice", "overall", null, "tier-1", 10, 1, 1, NOW, NOW);
			db.prepare(
				"INSERT INTO user_score_states (user_score_state_id, user_id, score_scope, idol_group_id, score_tier_id, score_total, answered_count, correct_count, last_answered_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)",
			).run("ov-b", "bob", "overall", null, "tier-1", 0, 1, 0, NOW, NOW);
		})();

		const alice = db.prepare("SELECT score_total FROM user_score_states WHERE user_score_state_id=?").get("ov-a") as { score_total: number };
		const bob = db.prepare("SELECT score_total FROM user_score_states WHERE user_score_state_id=?").get("ov-b") as { score_total: number };
		expect(alice.score_total).toBe(10);
		expect(bob.score_total).toBe(0);
	});
});

describe("複数ユーザーのランキング生成", () => {
	it("alice と bob のスコアからランキングを生成し、順位が正しい", () => {
		db.prepare(
			"INSERT INTO user_score_states (user_score_state_id, user_id, score_scope, idol_group_id, score_tier_id, score_total, answered_count, correct_count, updated_at) VALUES (?,?,?,?,?,?,?,?,?)",
		).run("ov-a", "alice", "overall", null, "tier-1", 100, 10, 8, NOW);
		db.prepare(
			"INSERT INTO user_score_states (user_score_state_id, user_id, score_scope, idol_group_id, score_tier_id, score_total, answered_count, correct_count, updated_at) VALUES (?,?,?,?,?,?,?,?,?)",
		).run("ov-b", "bob", "overall", null, "tier-1", 50, 10, 4, NOW);

		db.prepare(
			"INSERT INTO leaderboard_snapshots (leaderboard_snapshot_id, leaderboard_scope, idol_group_id, snapshot_at, created_at) VALUES (?,?,?,?,?)",
		).run("ls-1", "overall", null, NOW, NOW);
		db.prepare(
			"INSERT INTO leaderboard_entries (leaderboard_entry_id, leaderboard_snapshot_id, user_id, display_rank, display_score) VALUES (?,?,?,?,?)",
		).run("le-a", "ls-1", "alice", 1, 100);
		db.prepare(
			"INSERT INTO leaderboard_entries (leaderboard_entry_id, leaderboard_snapshot_id, user_id, display_rank, display_score) VALUES (?,?,?,?,?)",
		).run("le-b", "ls-1", "bob", 2, 50);

		const top = db
			.prepare("SELECT user_id, display_score FROM leaderboard_entries WHERE leaderboard_snapshot_id=? ORDER BY display_rank")
			.all("ls-1") as { user_id: string; display_score: number }[];
		expect(top[0]).toEqual({ user_id: "alice", display_score: 100 });
		expect(top[1]).toEqual({ user_id: "bob", display_score: 50 });
	});
});

describe("ユーザー削除時の全データクリーンアップ", () => {
	it("alice を削除すると全関連データが消える", () => {
		db.prepare("INSERT INTO user_profiles (user_id, handle, display_name, created_at, updated_at) VALUES (?,?,?,?,?)").run(
			"alice",
			"alice_h",
			"Alice",
			NOW,
			NOW,
		);
		db.prepare("INSERT INTO drop_wallets (user_id, balance, updated_at) VALUES (?,?,?)").run("alice", 100, NOW);
		db.prepare("INSERT INTO user_favorite_groups (user_favorite_group_id, user_id, idol_group_id, created_at) VALUES (?,?,?,?)").run(
			"fav-a",
			"alice",
			"group-1",
			NOW,
		);
		insSession("s-a", "alice");

		db.prepare("DELETE FROM users WHERE user_id=?").run("alice");

		const tables = ["user_profiles", "drop_wallets", "user_favorite_groups", "quiz_sessions"];
		for (const t of tables) {
			const c = (db.prepare(`SELECT count(*) as c FROM ${t} WHERE user_id=?`).get("alice") as { c: number }).c;
			expect(c, `${t} should be empty for deleted user`).toBe(0);
		}
	});
});
