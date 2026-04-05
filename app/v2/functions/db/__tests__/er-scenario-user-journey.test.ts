// @vitest-environment node
import type Database from "better-sqlite3";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
	createTestDb,
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
	insertUserScoreSnapshot,
	insertUserScoreState,
	NOW,
} from "./test-helper";

let db: Database.Database;
beforeEach(() => {
	db = createTestDb();
});
afterEach(() => {
	db.close();
});

describe("ユーザー登録→プロフィール→推し登録→クイズ→スコア→ランキングの一気通貫", () => {
	it("一連のユーザージャーニーが完走する", async () => {
		await insertUser(db);
		await insertUserProfile(db, {
			userId: "user-1",
			handle: "momo_fan",
			displayName: "モモ推し",
			bio: "TWICEが好き",
			createdAt: NOW,
			updatedAt: NOW,
		});
		await insertGroupCategory(db);
		await insertIdolGroup(db);
		await insertUserFavoriteGroup(db, {
			userFavoriteGroupId: "fav-1",
			userId: "user-1",
			idolGroupId: "group-1",
			startedSupportingOn: "2020-01-01",
			createdAt: NOW,
		});
		await insertQuiz(db, { quizId: "q1" });
		await insertQuizChoice(db, { quizChoiceId: "q1-c1", quizId: "q1", choiceOrder: 1, isCorrect: 1 });
		await insertQuizChoice(db, { quizChoiceId: "q1-c2", quizId: "q1", choiceOrder: 2, isCorrect: 0 });
		await insertQuiz(db, { quizId: "q2" });
		await insertQuizChoice(db, { quizChoiceId: "q2-c1", quizId: "q2", choiceOrder: 1, isCorrect: 0 });
		await insertQuizChoice(db, { quizChoiceId: "q2-c2", quizId: "q2", choiceOrder: 2, isCorrect: 1 });

		await insertQuizSession(db, {
			quizSessionId: "s1",
			userId: "user-1",
			idolGroupId: "group-1",
			status: "in_progress",
			totalQuestionCount: 2,
			answeredQuestionCount: 0,
			correctAnswerCount: 0,
			incorrectAnswerCount: 0,
			currentQuestionOrder: 1,
			startedAt: NOW,
			lastAnsweredAt: null,
			completedAt: null,
		});
		await insertSessionQuestion(db, { id: "sq1", sessionId: "s1", quizId: "q1", order: 1, createdAt: NOW });
		await insertSessionQuestion(db, { id: "sq2", sessionId: "s1", quizId: "q2", order: 2, createdAt: NOW });

		await insertQuizAnswer(db, { quizAnswerId: "a1", quizSessionQuestionId: "sq1", quizChoiceId: "q1-c1", awardedScore: 10, answeredAt: NOW });
		db.prepare(
			"UPDATE quiz_sessions SET answered_question_count=1, correct_answer_count=1, current_question_order=2, last_answered_at=? WHERE quiz_session_id=?",
		).run(NOW, "s1");

		await insertQuizAnswer(db, { quizAnswerId: "a2", quizSessionQuestionId: "sq2", quizChoiceId: "q2-c2", awardedScore: 10, answeredAt: NOW });
		db.prepare(
			"UPDATE quiz_sessions SET answered_question_count=2, correct_answer_count=2, current_question_order=NULL, status='completed', completed_at=?, last_answered_at=? WHERE quiz_session_id=?",
		).run(NOW, NOW, "s1");

		await insertScoreTier(db);
		await insertScoreTier(db, { scoreTierId: "tier-g", tierScope: "group", tierName: "Bronze" });
		await insertUserScoreState(db, {
			userScoreStateId: "uss-ov",
			userId: "user-1",
			scoreScope: "overall",
			idolGroupId: null,
			scoreTierId: "tier-1",
			scoreTotal: 20,
			answeredCount: 2,
			correctCount: 2,
			lastAnsweredAt: NOW,
			updatedAt: NOW,
		});
		await insertUserScoreState(db, {
			userScoreStateId: "uss-gr",
			userId: "user-1",
			scoreScope: "group",
			idolGroupId: "group-1",
			scoreTierId: "tier-g",
			scoreTotal: 20,
			answeredCount: 2,
			correctCount: 2,
			lastAnsweredAt: NOW,
			updatedAt: NOW,
		});

		await insertUserScoreSnapshot(db, {
			userScoreSnapshotId: "snap-ov",
			userId: "user-1",
			scoreScope: "overall",
			idolGroupId: null,
			snapshotDate: "2025-01-01",
			scoreTotal: 20,
			createdAt: NOW,
		});
		await insertUserScoreSnapshot(db, {
			userScoreSnapshotId: "snap-gr",
			userId: "user-1",
			scoreScope: "group",
			idolGroupId: "group-1",
			snapshotDate: "2025-01-01",
			scoreTotal: 20,
			createdAt: NOW,
		});

		await insertLeaderboardSnapshot(db, {
			leaderboardSnapshotId: "lb-ov",
			leaderboardScope: "overall",
			idolGroupId: null,
			snapshotAt: NOW,
			createdAt: NOW,
		});
		await insertLeaderboardEntry(db, {
			leaderboardEntryId: "le-1",
			leaderboardSnapshotId: "lb-ov",
			userId: "user-1",
			displayRank: 1,
			displayScore: 20,
		});

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
