// @vitest-environment node
import type Database from "better-sqlite3";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
	createTestDb,
	insertDropWallet,
	insertGroupCategory,
	insertIdolGroup,
	insertLeaderboardEntry,
	insertLeaderboardSnapshot,
	insertQuiz,
	insertQuizAnswer,
	insertQuizChoice,
	insertQuizSession,
	insertScoreTier,
	insertSessionQuestion,
	insertUser,
	insertUserFavoriteGroup,
	insertUserProfile,
	insertUserScoreState,
	NOW,
} from "./test-helper";

let db: Database.Database;
beforeEach(async () => {
	db = createTestDb();
	await insertUser(db, { userId: "alice" });
	await insertUser(db, { userId: "bob" });
	await insertGroupCategory(db);
	await insertIdolGroup(db);
	await insertQuiz(db, { quizId: "q1" });
	await insertQuizChoice(db, { quizChoiceId: "c1-ok", quizId: "q1", choiceOrder: 1, isCorrect: 1 });
	await insertQuizChoice(db, { quizChoiceId: "c1-ng", quizId: "q1", choiceOrder: 2, isCorrect: 0 });
	await insertScoreTier(db);
	await insertScoreTier(db, { scoreTierId: "tier-g", tierScope: "group", tierName: "Bronze" });
});
afterEach(() => {
	db.close();
});

const insSession = (id: string, userId: string) =>
	insertQuizSession(db, {
		quizSessionId: id,
		userId,
		idolGroupId: "group-1",
		status: "in_progress",
		totalQuestionCount: 1,
		answeredQuestionCount: 0,
		correctAnswerCount: 0,
		incorrectAnswerCount: 0,
		currentQuestionOrder: 1,
		startedAt: NOW,
		lastAnsweredAt: null,
		completedAt: null,
	});

describe("複数ユーザーが同じグループで同時にクイズに挑戦", () => {
	it("alice と bob が同時に in_progress セッションを持てる", async () => {
		await insSession("s-alice", "alice");
		await expect(insSession("s-bob", "bob")).resolves.toBeDefined();
	});

	it("それぞれが独立にクイズを完了し、スコアが独立に蓄積", async () => {
		await insSession("s-alice", "alice");
		await insSession("s-bob", "bob");

		await insertSessionQuestion(db, { id: "sq-a", sessionId: "s-alice", quizId: "q1", order: 1, createdAt: NOW });
		await insertSessionQuestion(db, { id: "sq-b", sessionId: "s-bob", quizId: "q1", order: 1, createdAt: NOW });

		await insertQuizAnswer(db, { quizAnswerId: "a-a", quizSessionQuestionId: "sq-a", quizChoiceId: "c1-ok", awardedScore: 10, answeredAt: NOW });
		db.prepare(
			"UPDATE quiz_sessions SET answered_question_count=1, correct_answer_count=1, current_question_order=NULL, status='completed', completed_at=?, last_answered_at=? WHERE quiz_session_id=?",
		).run(NOW, NOW, "s-alice");

		await insertQuizAnswer(db, { quizAnswerId: "a-b", quizSessionQuestionId: "sq-b", quizChoiceId: "c1-ng", awardedScore: 0, answeredAt: NOW });
		db.prepare(
			"UPDATE quiz_sessions SET answered_question_count=1, correct_answer_count=0, incorrect_answer_count=1, current_question_order=NULL, status='completed', completed_at=?, last_answered_at=? WHERE quiz_session_id=?",
		).run(NOW, NOW, "s-bob");

		await insertUserScoreState(db, {
			userScoreStateId: "ov-a",
			userId: "alice",
			scoreScope: "overall",
			idolGroupId: null,
			scoreTierId: "tier-1",
			scoreTotal: 10,
			answeredCount: 1,
			correctCount: 1,
			lastAnsweredAt: NOW,
			updatedAt: NOW,
		});
		await insertUserScoreState(db, {
			userScoreStateId: "ov-b",
			userId: "bob",
			scoreScope: "overall",
			idolGroupId: null,
			scoreTierId: "tier-1",
			scoreTotal: 0,
			answeredCount: 1,
			correctCount: 0,
			lastAnsweredAt: NOW,
			updatedAt: NOW,
		});

		const alice = db.prepare("SELECT score_total FROM user_score_states WHERE user_score_state_id=?").get("ov-a") as { score_total: number };
		const bob = db.prepare("SELECT score_total FROM user_score_states WHERE user_score_state_id=?").get("ov-b") as { score_total: number };
		expect(alice.score_total).toBe(10);
		expect(bob.score_total).toBe(0);
	});
});

describe("複数ユーザーのランキング生成", () => {
	it("alice と bob のスコアからランキングを生成し、順位が正しい", async () => {
		await insertUserScoreState(db, {
			userScoreStateId: "ov-a",
			userId: "alice",
			scoreScope: "overall",
			idolGroupId: null,
			scoreTierId: "tier-1",
			scoreTotal: 100,
			answeredCount: 10,
			correctCount: 8,
			updatedAt: NOW,
		});
		await insertUserScoreState(db, {
			userScoreStateId: "ov-b",
			userId: "bob",
			scoreScope: "overall",
			idolGroupId: null,
			scoreTierId: "tier-1",
			scoreTotal: 50,
			answeredCount: 10,
			correctCount: 4,
			updatedAt: NOW,
		});

		await insertLeaderboardSnapshot(db, {
			leaderboardSnapshotId: "ls-1",
			leaderboardScope: "overall",
			idolGroupId: null,
			snapshotAt: NOW,
			createdAt: NOW,
		});
		await insertLeaderboardEntry(db, {
			leaderboardEntryId: "le-a",
			leaderboardSnapshotId: "ls-1",
			userId: "alice",
			displayRank: 1,
			displayScore: 100,
		});
		await insertLeaderboardEntry(db, { leaderboardEntryId: "le-b", leaderboardSnapshotId: "ls-1", userId: "bob", displayRank: 2, displayScore: 50 });

		const top = db
			.prepare("SELECT user_id, display_score FROM leaderboard_entries WHERE leaderboard_snapshot_id=? ORDER BY display_rank")
			.all("ls-1") as { user_id: string; display_score: number }[];
		expect(top[0]).toEqual({ user_id: "alice", display_score: 100 });
		expect(top[1]).toEqual({ user_id: "bob", display_score: 50 });
	});
});

describe("ユーザー削除時の全データクリーンアップ", () => {
	it("alice を削除すると全関連データが消える", async () => {
		await insertUserProfile(db, { userId: "alice", handle: "alice_h", displayName: "Alice", createdAt: NOW, updatedAt: NOW });
		await insertDropWallet(db, { userId: "alice", balance: 100, updatedAt: NOW });
		await insertUserFavoriteGroup(db, { userFavoriteGroupId: "fav-a", userId: "alice", idolGroupId: "group-1", createdAt: NOW });
		await insSession("s-a", "alice");

		db.prepare("DELETE FROM users WHERE user_id=?").run("alice");

		const tables = ["user_profiles", "drop_wallets", "user_favorite_groups", "quiz_sessions"];
		for (const t of tables) {
			const c = (db.prepare(`SELECT count(*) as c FROM ${t} WHERE user_id=?`).get("alice") as { c: number }).c;
			expect(c, `${t} should be empty for deleted user`).toBe(0);
		}
	});
});
