// @vitest-environment node
import type Database from "better-sqlite3";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { NOW, createTestDb, insertQuiz, insertQuizChoice, insertQuizSession, insertScoreTier, insertSessionQuestion, insertUser, setupBaseData } from "./test-helper";

let db: Database.Database;
beforeEach(() => { db = createTestDb(); });
afterEach(() => { db.close(); });

describe("quiz_choices の境界値", () => {
	beforeEach(() => { setupBaseData(db); insertQuiz(db); });
	it("choice_order = 1 は有効（最小値）", () => { expect(() => insertQuizChoice(db, { choiceOrder: 1 })).not.toThrow(); });
	it("choice_order = -1 は拒否", () => { expect(() => insertQuizChoice(db, { choiceOrder: -1 })).toThrow(); });
	it("choice_order = 999 は有効", () => { expect(() => insertQuizChoice(db, { choiceOrder: 999 })).not.toThrow(); });
});

describe("quiz_sessions カウンタの境界値", () => {
	beforeEach(() => setupBaseData(db));
	it("total_question_count = 1 は有効（最小値）", () => {
		expect(() => insertQuizSession(db, { totalQuestionCount: 1 })).not.toThrow();
	});
	it("total_question_count = -1 は拒否", () => {
		expect(() => insertQuizSession(db, { totalQuestionCount: -1 })).toThrow();
	});
	it("answered = total のぎりぎり", () => {
		expect(() => insertQuizSession(db, {
			totalQuestionCount: 3, answeredQuestionCount: 3, correctAnswerCount: 2, incorrectAnswerCount: 1,
			currentQuestionOrder: 4, lastAnsweredAt: NOW,
		})).not.toThrow();
	});
	it("correct = 0, incorrect = 0, answered = 0 は有効", () => {
		expect(() => insertQuizSession(db, {
			answeredQuestionCount: 0, correctAnswerCount: 0, incorrectAnswerCount: 0,
		})).not.toThrow();
	});
	it("current_question_order = 1 は有効（最小値）", () => {
		expect(() => insertQuizSession(db, { currentQuestionOrder: 1 })).not.toThrow();
	});
	it("current_question_order = 0 は拒否", () => {
		expect(() => insertQuizSession(db, { currentQuestionOrder: 0 })).toThrow();
	});
	it("負の answered_question_count は拒否", () => {
		expect(() => insertQuizSession(db, { answeredQuestionCount: -1, correctAnswerCount: 0, incorrectAnswerCount: -1 })).toThrow();
	});
	it("負の correct_answer_count は拒否", () => {
		expect(() => insertQuizSession(db, { answeredQuestionCount: 1, correctAnswerCount: -1, incorrectAnswerCount: 2, lastAnsweredAt: NOW })).toThrow();
	});
});

describe("drop_wallets の境界値", () => {
	beforeEach(() => insertUser(db));
	it("balance = 0 は有効（最小値）", () => {
		expect(() => db.prepare("INSERT INTO drop_wallets (user_id, balance, updated_at) VALUES (?,?,?)").run("user-1", 0, NOW)).not.toThrow();
	});
	it("balance = 999999 は有効", () => {
		expect(() => db.prepare("INSERT INTO drop_wallets (user_id, balance, updated_at) VALUES (?,?,?)").run("user-1", 999999, NOW)).not.toThrow();
	});
});

describe("drop_transactions の境界値", () => {
	beforeEach(() => insertUser(db));
	const ins = (id: string, delta: number) => db.prepare("INSERT INTO drop_transactions (drop_transaction_id, user_id, delta, reason, source_type, created_at) VALUES (?,?,?,?,?,?)").run(id, "user-1", delta, "r", "s", NOW);
	it("delta = 1 は有効（最小正値）", () => { expect(() => ins("t1", 1)).not.toThrow(); });
	it("delta = -1 は有効（最小負値）", () => { expect(() => ins("t1", -1)).not.toThrow(); });
});

describe("events の境界値", () => {
	beforeEach(() => insertUser(db));
	const ins = (id: string, cap: number | null) => db.prepare("INSERT INTO events (event_id, created_by_user_id, title, visibility, capacity, starts_at, ends_at, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?)").run(id, "user-1", "E", "public", cap, "2025-03-01T00:00:00Z", "2025-04-01T00:00:00Z", NOW, NOW);
	it("capacity = 1 は有効（最小値）", () => { expect(() => ins("e1", 1)).not.toThrow(); });
	it("capacity = -1 は拒否", () => { expect(() => ins("e1", -1)).toThrow(); });
});

describe("leaderboard_entries の境界値", () => {
	beforeEach(() => {
		insertUser(db);
		db.prepare("INSERT INTO leaderboard_snapshots (leaderboard_snapshot_id, leaderboard_scope, idol_group_id, snapshot_at, created_at) VALUES (?,?,?,?,?)").run("ls1", "overall", null, NOW, NOW);
	});
	const ins = (rank: number, score: number) => db.prepare("INSERT INTO leaderboard_entries (leaderboard_entry_id, leaderboard_snapshot_id, user_id, display_rank, display_score) VALUES (?,?,?,?,?)").run("le1", "ls1", "user-1", rank, score);
	it("rank = 1, score = 0 は有効（最小値）", () => { expect(() => ins(1, 0)).not.toThrow(); });
	it("rank = 0 は拒否", () => { expect(() => ins(0, 100)).toThrow(); });
	it("rank = -1 は拒否", () => { expect(() => ins(-1, 100)).toThrow(); });
	it("score = -1 は拒否", () => { expect(() => ins(1, -1)).toThrow(); });
});

describe("score_tiers の境界値", () => {
	it("min_score = max_score は有効", () => { expect(() => insertScoreTier(db, { minScore: 50, maxScore: 50 })).not.toThrow(); });
	it("min_score = 0, max_score = 0 は有効", () => { expect(() => insertScoreTier(db, { minScore: 0, maxScore: 0 })).not.toThrow(); });
});

describe("user_score_states の境界値", () => {
	beforeEach(() => { setupBaseData(db); insertScoreTier(db); });
	const ins = (answered: number, correct: number) => db.prepare("INSERT INTO user_score_states (user_score_state_id, user_id, score_scope, idol_group_id, score_tier_id, score_total, answered_count, correct_count, updated_at) VALUES (?,?,?,?,?,?,?,?,?)").run("uss1", "user-1", "overall", null, "tier-1", 0, answered, correct, NOW);
	it("answered = correct は有効（全問正解）", () => { expect(() => ins(5, 5)).not.toThrow(); });
	it("correct = 0 は有効（全問不正解）", () => { expect(() => ins(5, 0)).not.toThrow(); });
	it("score_total = 0 は有効", () => { expect(() => ins(0, 0)).not.toThrow(); });
	it("負の score_total は拒否", () => {
		expect(() => db.prepare("INSERT INTO user_score_states (user_score_state_id, user_id, score_scope, idol_group_id, score_tier_id, score_total, answered_count, correct_count, updated_at) VALUES (?,?,?,?,?,?,?,?,?)").run("uss1", "user-1", "overall", null, "tier-1", -1, 0, 0, NOW)).toThrow();
	});
});

describe("quiz_answers の境界値", () => {
	beforeEach(() => { setupBaseData(db); insertQuiz(db); insertQuizChoice(db, { quizChoiceId: "c1", choiceOrder: 1, isCorrect: 1 }); insertQuizSession(db, { answeredQuestionCount: 1, correctAnswerCount: 1, incorrectAnswerCount: 0, lastAnsweredAt: NOW }); insertSessionQuestion(db); });
	const ins = (score: number) => db.prepare("INSERT INTO quiz_answers (quiz_answer_id, quiz_session_question_id, quiz_choice_id, awarded_score, answered_at) VALUES (?,?,?,?,?)").run("a1", "sq-1", "c1", score, NOW);
	it("awarded_score = 0 は有効", () => { expect(() => ins(0)).not.toThrow(); });
	it("awarded_score = -1 は拒否", () => { expect(() => ins(-1)).toThrow(); });
});

describe("quiz_session_questions の境界値", () => {
	beforeEach(() => { setupBaseData(db); insertQuiz(db); insertQuizSession(db); });
	it("question_order = 1 は有効", () => { expect(() => insertSessionQuestion(db, { order: 1 })).not.toThrow(); });
	it("question_order = 0 は拒否", () => { expect(() => insertSessionQuestion(db, { order: 0 })).toThrow(); });
});

describe("user_score_snapshots の境界値", () => {
	beforeEach(() => setupBaseData(db));
	it("score_total = 0 は有効", () => {
		expect(() => db.prepare("INSERT INTO user_score_snapshots (user_score_snapshot_id, user_id, score_scope, idol_group_id, snapshot_date, score_total, created_at) VALUES (?,?,?,?,?,?,?)").run("ss1", "user-1", "overall", null, "2025-01-01", 0, NOW)).not.toThrow();
	});
	it("負の score_total は拒否", () => {
		expect(() => db.prepare("INSERT INTO user_score_snapshots (user_score_snapshot_id, user_id, score_scope, idol_group_id, snapshot_date, score_total, created_at) VALUES (?,?,?,?,?,?,?)").run("ss1", "user-1", "overall", null, "2025-01-01", -1, NOW)).toThrow();
	});
});
