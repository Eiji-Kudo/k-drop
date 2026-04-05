// @vitest-environment node
import type Database from "better-sqlite3";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
	createTestDb,
	insertQuiz,
	insertQuizChoice,
	insertQuizSession,
	insertScoreTier,
	insertSessionQuestion,
	NOW,
	setupBaseData,
} from "./test-helper";

let db: Database.Database;
beforeEach(async () => {
	db = createTestDb();
	await setupBaseData(db);
});
afterEach(() => {
	db.close();
});

describe("クイズ回答→進捗更新→完了フロー", () => {
	beforeEach(async () => {
		await insertQuiz(db, { quizId: "q1" });
		await insertQuiz(db, { quizId: "q2" });
		await insertQuizChoice(db, { quizChoiceId: "c1", quizId: "q1", choiceOrder: 1, isCorrect: 1 });
		await insertQuizChoice(db, { quizChoiceId: "c2", quizId: "q2", choiceOrder: 1, isCorrect: 1 });
		await insertQuizSession(db, { totalQuestionCount: 2 });
		await insertSessionQuestion(db, { id: "sq1", quizId: "q1", order: 1 });
		await insertSessionQuestion(db, { id: "sq2", quizId: "q2", order: 2 });
	});

	it("1問目回答 → 進捗更新 → 2問目回答 → completed", () => {
		db.prepare(
			"INSERT INTO quiz_answers (quiz_answer_id, quiz_session_question_id, quiz_choice_id, awarded_score, answered_at) VALUES (?,?,?,?,?)",
		).run("a1", "sq1", "c1", 10, NOW);
		db.prepare(
			"UPDATE quiz_sessions SET answered_question_count=1, correct_answer_count=1, current_question_order=2, last_answered_at=? WHERE quiz_session_id=?",
		).run(NOW, "session-1");

		const mid = db.prepare("SELECT * FROM quiz_sessions WHERE quiz_session_id=?").get("session-1") as Record<string, unknown>;
		expect(mid.answered_question_count).toBe(1);
		expect(mid.status).toBe("in_progress");

		db.prepare(
			"INSERT INTO quiz_answers (quiz_answer_id, quiz_session_question_id, quiz_choice_id, awarded_score, answered_at) VALUES (?,?,?,?,?)",
		).run("a2", "sq2", "c2", 10, NOW);
		db.prepare(
			"UPDATE quiz_sessions SET answered_question_count=2, correct_answer_count=2, current_question_order=NULL, status='completed', completed_at=?, last_answered_at=? WHERE quiz_session_id=?",
		).run(NOW, NOW, "session-1");

		const fin = db.prepare("SELECT * FROM quiz_sessions WHERE quiz_session_id=?").get("session-1") as Record<string, unknown>;
		expect(fin.status).toBe("completed");
		expect(fin.completed_at).toBe(NOW);
		expect(fin.current_question_order).toBeNull();
	});
});

describe("user_score_states の総合行・グループ行の同時更新", () => {
	beforeEach(async () => {
		await insertScoreTier(db);
		await insertScoreTier(db, { scoreTierId: "tier-g", tierScope: "group", tierName: "Bronze" });
		db.prepare(
			"INSERT INTO user_score_states (user_score_state_id, user_id, score_scope, idol_group_id, score_tier_id, score_total, answered_count, correct_count, updated_at) VALUES (?,?,?,?,?,?,?,?,?)",
		).run("ov", "user-1", "overall", null, "tier-1", 0, 0, 0, NOW);
		db.prepare(
			"INSERT INTO user_score_states (user_score_state_id, user_id, score_scope, idol_group_id, score_tier_id, score_total, answered_count, correct_count, updated_at) VALUES (?,?,?,?,?,?,?,?,?)",
		).run("gr", "user-1", "group", "group-1", "tier-g", 0, 0, 0, NOW);
	});

	it("トランザクション内で両方の行を更新", () => {
		db.transaction(() => {
			db.prepare(
				"UPDATE user_score_states SET score_total=score_total+10, answered_count=answered_count+1, correct_count=correct_count+1, updated_at=? WHERE user_score_state_id=?",
			).run(NOW, "ov");
			db.prepare(
				"UPDATE user_score_states SET score_total=score_total+10, answered_count=answered_count+1, correct_count=correct_count+1, updated_at=? WHERE user_score_state_id=?",
			).run(NOW, "gr");
		})();
		const ov = db.prepare("SELECT * FROM user_score_states WHERE user_score_state_id=?").get("ov") as Record<string, unknown>;
		const gr = db.prepare("SELECT * FROM user_score_states WHERE user_score_state_id=?").get("gr") as Record<string, unknown>;
		expect(ov.score_total).toBe(10);
		expect(gr.score_total).toBe(10);
	});
});

describe("ドロップ報酬と残高更新", () => {
	beforeEach(() => {
		db.prepare("INSERT INTO drop_wallets (user_id, balance, updated_at) VALUES (?,?,?)").run("user-1", 50, NOW);
	});

	it("報酬付与 → wallet balance 増加", () => {
		db.transaction(() => {
			db.prepare(
				"INSERT INTO drop_transactions (drop_transaction_id, user_id, delta, reason, source_type, source_id, created_at) VALUES (?,?,?,?,?,?,?)",
			).run("tx1", "user-1", 20, "quiz_reward", "quiz_session", "s1", NOW);
			db.prepare("UPDATE drop_wallets SET balance=balance+20, updated_at=? WHERE user_id=?").run(NOW, "user-1");
		})();
		expect((db.prepare("SELECT balance FROM drop_wallets WHERE user_id=?").get("user-1") as { balance: number }).balance).toBe(70);
	});

	it("残高不足の消費は balance >= 0 制約で拒否", () => {
		expect(() =>
			db.transaction(() => {
				db.prepare("INSERT INTO drop_transactions (drop_transaction_id, user_id, delta, reason, source_type, created_at) VALUES (?,?,?,?,?,?)").run(
					"tx1",
					"user-1",
					-60,
					"consume",
					"shop",
					NOW,
				);
				db.prepare("UPDATE drop_wallets SET balance=balance-60, updated_at=? WHERE user_id=?").run(NOW, "user-1");
			})(),
		).toThrow();
	});
});
