import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import Database from "better-sqlite3";

const MIGRATIONS_DIR = resolve(import.meta.dirname, "../migrations");
export const NOW = "2025-01-01T00:00:00Z";

export function createTestDb(): Database.Database {
	const db = new Database(":memory:");
	db.pragma("journal_mode = WAL");
	db.pragma("foreign_keys = ON");
	for (const file of readdirSync(MIGRATIONS_DIR)
		.filter((f) => f.endsWith(".sql"))
		.sort()) {
		const sql = readFileSync(resolve(MIGRATIONS_DIR, file), "utf-8");
		for (const stmt of sql
			.split("--> statement-breakpoint")
			.map((s) => s.trim())
			.filter(Boolean)) {
			db.exec(stmt);
		}
	}
	return db;
}

export function setupBaseData(db: Database.Database) {
	insertUser(db);
	insertGroupCategory(db);
	insertIdolGroup(db);
}

export function insertUser(db: Database.Database, o: Partial<{ userId: string; status: string }> = {}) {
	const id = o.userId ?? "user-1";
	db.prepare("INSERT INTO users (user_id, status, created_at, updated_at) VALUES (?, ?, ?, ?)").run(id, o.status ?? "active", NOW, NOW);
	return id;
}

export function insertGroupCategory(db: Database.Database, o: Partial<{ groupCategoryId: string; slug: string }> = {}) {
	const id = o.groupCategoryId ?? "cat-1";
	db.prepare("INSERT INTO group_categories (group_category_id, slug, category_name, sort_order) VALUES (?, ?, ?, ?)").run(
		id,
		o.slug ?? "kpop",
		"K-POP",
		1,
	);
	return id;
}

export function insertIdolGroup(db: Database.Database, o: Partial<{ idolGroupId: string; groupCategoryId: string; slug: string }> = {}) {
	const id = o.idolGroupId ?? "group-1";
	db.prepare(
		"INSERT INTO idol_groups (idol_group_id, group_category_id, slug, group_name, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
	).run(id, o.groupCategoryId ?? "cat-1", o.slug ?? "twice", "TWICE", "active", NOW, NOW);
	return id;
}

export function insertQuiz(db: Database.Database, o: Partial<{ quizId: string; idolGroupId: string; difficulty: string; status: string }> = {}) {
	const id = o.quizId ?? "quiz-1";
	db.prepare("INSERT INTO quizzes (quiz_id, idol_group_id, difficulty, status, prompt, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)").run(
		id,
		o.idolGroupId ?? "group-1",
		o.difficulty ?? "easy",
		o.status ?? "published",
		"What is ...?",
		NOW,
		NOW,
	);
	return id;
}

export function insertQuizChoice(
	db: Database.Database,
	o: Partial<{ quizChoiceId: string; quizId: string; choiceOrder: number; isCorrect: number }> = {},
) {
	const id = o.quizChoiceId ?? "choice-1";
	db.prepare("INSERT INTO quiz_choices (quiz_choice_id, quiz_id, choice_order, choice_text, is_correct) VALUES (?, ?, ?, ?, ?)").run(
		id,
		o.quizId ?? "quiz-1",
		o.choiceOrder ?? 1,
		"Choice text",
		o.isCorrect ?? 0,
	);
	return id;
}

export function insertScoreTier(
	db: Database.Database,
	o: Partial<{ scoreTierId: string; tierScope: string; tierName: string; minScore: number; maxScore: number }> = {},
) {
	const id = o.scoreTierId ?? "tier-1";
	db.prepare("INSERT INTO score_tiers (score_tier_id, tier_scope, tier_name, min_score, max_score, sort_order) VALUES (?, ?, ?, ?, ?, ?)").run(
		id,
		o.tierScope ?? "overall",
		o.tierName ?? "Bronze",
		o.minScore ?? 0,
		o.maxScore ?? 100,
		1,
	);
	return id;
}

export type QuizSessionOverrides = Partial<{
	quizSessionId: string;
	userId: string;
	idolGroupId: string;
	status: string;
	totalQuestionCount: number;
	answeredQuestionCount: number;
	correctAnswerCount: number;
	incorrectAnswerCount: number;
	currentQuestionOrder: number | null;
	completedAt: string | null;
	lastAnsweredAt: string | null;
}>;

export function insertQuizSession(db: Database.Database, o: QuizSessionOverrides = {}) {
	const id = o.quizSessionId ?? "session-1";
	const status = o.status ?? "in_progress";
	db.prepare(
		`INSERT INTO quiz_sessions (quiz_session_id, user_id, idol_group_id, status, total_question_count, answered_question_count,
		correct_answer_count, incorrect_answer_count, current_question_order, started_at, last_answered_at, completed_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
	).run(
		id,
		o.userId ?? "user-1",
		o.idolGroupId ?? "group-1",
		status,
		o.totalQuestionCount ?? 5,
		o.answeredQuestionCount ?? 0,
		o.correctAnswerCount ?? 0,
		o.incorrectAnswerCount ?? 0,
		"currentQuestionOrder" in o ? o.currentQuestionOrder : status === "in_progress" ? 1 : null,
		NOW,
		"lastAnsweredAt" in o ? o.lastAnsweredAt : null,
		"completedAt" in o ? o.completedAt : null,
	);
	return id;
}

export function insertSessionQuestion(db: Database.Database, o: Partial<{ id: string; sessionId: string; quizId: string; order: number }> = {}) {
	const id = o.id ?? "sq-1";
	db.prepare(
		"INSERT INTO quiz_session_questions (quiz_session_question_id, quiz_session_id, quiz_id, question_order, created_at) VALUES (?, ?, ?, ?, ?)",
	).run(id, o.sessionId ?? "session-1", o.quizId ?? "quiz-1", o.order ?? 1, NOW);
	return id;
}
