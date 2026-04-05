// @vitest-environment node
import type Database from "better-sqlite3";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { NOW, createTestDb, insertQuiz, insertQuizChoice, insertQuizSession, insertScoreTier, insertUser, setupBaseData } from "./test-helper";

let db: Database.Database;
beforeEach(() => { db = createTestDb(); });
afterEach(() => { db.close(); });

describe("quizzes の正常な状態バリエーション", () => {
	beforeEach(() => setupBaseData(db));
	it.each(["easy", "normal", "hard"])("difficulty = %s を受理", (d) => {
		expect(() => insertQuiz(db, { quizId: `q-${d}`, difficulty: d })).not.toThrow();
	});
	it.each(["draft", "published", "archived"])("status = %s を受理", (s) => {
		expect(() => insertQuiz(db, { quizId: `q-${s}`, status: s })).not.toThrow();
	});
});

describe("quiz_sessions の正常な状態バリエーション", () => {
	beforeEach(() => setupBaseData(db));
	it("in_progress: 0問回答済み", () => {
		expect(() => insertQuizSession(db, { quizSessionId: "s1" })).not.toThrow();
	});
	it("in_progress: 途中まで回答済み", () => {
		expect(() => insertQuizSession(db, {
			quizSessionId: "s1", answeredQuestionCount: 2, correctAnswerCount: 1, incorrectAnswerCount: 1,
			currentQuestionOrder: 3, lastAnsweredAt: NOW,
		})).not.toThrow();
	});
	it("completed: 全問回答", () => {
		expect(() => insertQuizSession(db, {
			quizSessionId: "s1", status: "completed", totalQuestionCount: 5,
			answeredQuestionCount: 5, correctAnswerCount: 3, incorrectAnswerCount: 2,
			currentQuestionOrder: null, completedAt: NOW, lastAnsweredAt: NOW,
		})).not.toThrow();
	});
	it("abandoned: 途中離脱", () => {
		expect(() => insertQuizSession(db, {
			quizSessionId: "s1", status: "abandoned",
			answeredQuestionCount: 2, correctAnswerCount: 1, incorrectAnswerCount: 1,
			currentQuestionOrder: null, lastAnsweredAt: NOW,
		})).not.toThrow();
	});
	it("abandoned: 0問で離脱", () => {
		expect(() => insertQuizSession(db, { quizSessionId: "s1", status: "abandoned", currentQuestionOrder: null })).not.toThrow();
	});
});

describe("events の正常な状態バリエーション", () => {
	beforeEach(() => insertUser(db));
	const ins = (id: string, o: { visibility?: string; capacity?: number | null }) =>
		db.prepare("INSERT INTO events (event_id, created_by_user_id, title, visibility, capacity, starts_at, ends_at, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?)").run(
			id, "user-1", "E", o.visibility ?? "public", o.capacity ?? null, "2025-03-01T00:00:00Z", "2025-04-01T00:00:00Z", NOW, NOW,
		);
	it.each(["public", "private", "unlisted"])("visibility = %s を受理", (v) => { expect(() => ins(`ev-${v}`, { visibility: v })).not.toThrow(); });
	it("capacity = NULL は許容", () => { expect(() => ins("ev-n", { capacity: null })).not.toThrow(); });
	it("capacity = 1 は許容", () => { expect(() => ins("ev-1", { capacity: 1 })).not.toThrow(); });
});

describe("event_participants の正常な status バリエーション", () => {
	beforeEach(() => { setupBaseData(db); db.prepare("INSERT INTO events (event_id, created_by_user_id, title, visibility, starts_at, ends_at, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)").run("ev-1", "user-1", "E", "public", "2025-03-01T00:00:00Z", "2025-04-01T00:00:00Z", NOW, NOW); });
	it.each(["joined", "waitlisted", "cancelled"])("participation_status = %s を受理", (s) => {
		expect(() => db.prepare("INSERT INTO event_participants (event_participant_id, event_id, user_id, participation_status, joined_at, updated_at) VALUES (?,?,?,?,?,?)").run(`ep-${s}`, "ev-1", "user-1", s, NOW, NOW)).not.toThrow();
		db.prepare("DELETE FROM event_participants WHERE event_participant_id = ?").run(`ep-${s}`);
	});
});

describe("user_score_states の正常パターン", () => {
	beforeEach(() => { setupBaseData(db); insertScoreTier(db); insertScoreTier(db, { scoreTierId: "tier-g", tierScope: "group", tierName: "Bronze" }); });
	it("overall 行を正常に挿入", () => {
		expect(() => db.prepare("INSERT INTO user_score_states (user_score_state_id, user_id, score_scope, idol_group_id, score_tier_id, score_total, answered_count, correct_count, updated_at) VALUES (?,?,?,?,?,?,?,?,?)").run("ov", "user-1", "overall", null, "tier-1", 50, 10, 7, NOW)).not.toThrow();
	});
	it("group 行を正常に挿入", () => {
		expect(() => db.prepare("INSERT INTO user_score_states (user_score_state_id, user_id, score_scope, idol_group_id, score_tier_id, score_total, answered_count, correct_count, updated_at) VALUES (?,?,?,?,?,?,?,?,?)").run("gr", "user-1", "group", "group-1", "tier-g", 30, 5, 3, NOW)).not.toThrow();
	});
});

describe("quiz_choices の正常パターン", () => {
	beforeEach(() => { setupBaseData(db); insertQuiz(db); });
	it("4択を正常に挿入", () => {
		for (let i = 1; i <= 4; i++) insertQuizChoice(db, { quizChoiceId: `c${i}`, choiceOrder: i, isCorrect: i === 1 ? 1 : 0 });
		expect((db.prepare("SELECT count(*) as c FROM quiz_choices WHERE quiz_id = ?").get("quiz-1") as { c: number }).c).toBe(4);
	});
});
