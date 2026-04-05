// @vitest-environment node
import type Database from "better-sqlite3";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createTestDb, insertGroupCategory, insertIdolGroup, insertQuiz, insertQuizChoice, insertScoreTier, insertUser, NOW } from "./test-helper";

let db: Database.Database;
beforeEach(() => {
	db = createTestDb();
});
afterEach(() => {
	db.close();
});

describe("ユーザー登録→プロフィール→推し登録→クイズ→スコア→ランキングの一気通貫", () => {
	it("一連のユーザージャーニーが完走する", () => {
		insertUser(db);
		db.prepare("INSERT INTO user_profiles (user_id, handle, display_name, bio, created_at, updated_at) VALUES (?,?,?,?,?,?)").run(
			"user-1",
			"momo_fan",
			"モモ推し",
			"TWICEが好き",
			NOW,
			NOW,
		);
		insertGroupCategory(db);
		insertIdolGroup(db);
		db.prepare(
			"INSERT INTO user_favorite_groups (user_favorite_group_id, user_id, idol_group_id, started_supporting_on, created_at) VALUES (?,?,?,?,?)",
		).run("fav-1", "user-1", "group-1", "2020-01-01", NOW);
		insertQuiz(db, { quizId: "q1" });
		insertQuizChoice(db, { quizChoiceId: "q1-c1", quizId: "q1", choiceOrder: 1, isCorrect: 1 });
		insertQuizChoice(db, { quizChoiceId: "q1-c2", quizId: "q1", choiceOrder: 2, isCorrect: 0 });
		insertQuiz(db, { quizId: "q2" });
		insertQuizChoice(db, { quizChoiceId: "q2-c1", quizId: "q2", choiceOrder: 1, isCorrect: 0 });
		insertQuizChoice(db, { quizChoiceId: "q2-c2", quizId: "q2", choiceOrder: 2, isCorrect: 1 });

		db.prepare(
			"INSERT INTO quiz_sessions (quiz_session_id, user_id, idol_group_id, status, total_question_count, answered_question_count, correct_answer_count, incorrect_answer_count, current_question_order, started_at, last_answered_at, completed_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
		).run("s1", "user-1", "group-1", "in_progress", 2, 0, 0, 0, 1, NOW, null, null);
		db.prepare(
			"INSERT INTO quiz_session_questions (quiz_session_question_id, quiz_session_id, quiz_id, question_order, created_at) VALUES (?,?,?,?,?)",
		).run("sq1", "s1", "q1", 1, NOW);
		db.prepare(
			"INSERT INTO quiz_session_questions (quiz_session_question_id, quiz_session_id, quiz_id, question_order, created_at) VALUES (?,?,?,?,?)",
		).run("sq2", "s1", "q2", 2, NOW);

		db.prepare(
			"INSERT INTO quiz_answers (quiz_answer_id, quiz_session_question_id, quiz_choice_id, awarded_score, answered_at) VALUES (?,?,?,?,?)",
		).run("a1", "sq1", "q1-c1", 10, NOW);
		db.prepare(
			"UPDATE quiz_sessions SET answered_question_count=1, correct_answer_count=1, current_question_order=2, last_answered_at=? WHERE quiz_session_id=?",
		).run(NOW, "s1");

		db.prepare(
			"INSERT INTO quiz_answers (quiz_answer_id, quiz_session_question_id, quiz_choice_id, awarded_score, answered_at) VALUES (?,?,?,?,?)",
		).run("a2", "sq2", "q2-c2", 10, NOW);
		db.prepare(
			"UPDATE quiz_sessions SET answered_question_count=2, correct_answer_count=2, current_question_order=NULL, status='completed', completed_at=?, last_answered_at=? WHERE quiz_session_id=?",
		).run(NOW, NOW, "s1");

		insertScoreTier(db);
		insertScoreTier(db, { scoreTierId: "tier-g", tierScope: "group", tierName: "Bronze" });
		db.prepare(
			"INSERT INTO user_score_states (user_score_state_id, user_id, score_scope, idol_group_id, score_tier_id, score_total, answered_count, correct_count, last_answered_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)",
		).run("uss-ov", "user-1", "overall", null, "tier-1", 20, 2, 2, NOW, NOW);
		db.prepare(
			"INSERT INTO user_score_states (user_score_state_id, user_id, score_scope, idol_group_id, score_tier_id, score_total, answered_count, correct_count, last_answered_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)",
		).run("uss-gr", "user-1", "group", "group-1", "tier-g", 20, 2, 2, NOW, NOW);

		db.prepare(
			"INSERT INTO user_score_snapshots (user_score_snapshot_id, user_id, score_scope, idol_group_id, snapshot_date, score_total, created_at) VALUES (?,?,?,?,?,?,?)",
		).run("snap-ov", "user-1", "overall", null, "2025-01-01", 20, NOW);
		db.prepare(
			"INSERT INTO user_score_snapshots (user_score_snapshot_id, user_id, score_scope, idol_group_id, snapshot_date, score_total, created_at) VALUES (?,?,?,?,?,?,?)",
		).run("snap-gr", "user-1", "group", "group-1", "2025-01-01", 20, NOW);

		db.prepare(
			"INSERT INTO leaderboard_snapshots (leaderboard_snapshot_id, leaderboard_scope, idol_group_id, snapshot_at, created_at) VALUES (?,?,?,?,?)",
		).run("lb-ov", "overall", null, NOW, NOW);
		db.prepare(
			"INSERT INTO leaderboard_entries (leaderboard_entry_id, leaderboard_snapshot_id, user_id, display_rank, display_score) VALUES (?,?,?,?,?)",
		).run("le-1", "lb-ov", "user-1", 1, 20);

		const session = db.prepare("SELECT * FROM quiz_sessions WHERE quiz_session_id=?").get("s1") as Record<string, unknown>;
		const scoreOv = db.prepare("SELECT * FROM user_score_states WHERE user_score_state_id=?").get("uss-ov") as Record<string, unknown>;
		const entry = db.prepare("SELECT * FROM leaderboard_entries WHERE user_id=?").get("user-1") as Record<string, unknown>;
		expect(session.status).toBe("completed");
		expect(session.correct_answer_count).toBe(2);
		expect(scoreOv.score_total).toBe(20);
		expect(entry.display_rank).toBe(1);
		expect(entry.display_score).toBe(20);
	});
});
