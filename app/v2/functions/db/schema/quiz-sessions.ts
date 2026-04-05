import { sql } from "drizzle-orm";
import { check, index, integer, sqliteTable, text, unique, uniqueIndex } from "drizzle-orm/sqlite-core";
import { idolGroups } from "./groups.ts";
import { quizChoices, quizzes } from "./quizzes.ts";
import { users } from "./users.ts";

export const quizSessions = sqliteTable(
	"quiz_sessions",
	{
		quizSessionId: text("quiz_session_id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => users.userId, { onDelete: "cascade" }),
		idolGroupId: text("idol_group_id")
			.notNull()
			.references(() => idolGroups.idolGroupId, { onDelete: "cascade" }),
		status: text("status", { enum: ["in_progress", "completed", "abandoned"] }).notNull(),
		totalQuestionCount: integer("total_question_count").notNull(),
		answeredQuestionCount: integer("answered_question_count").notNull(),
		correctAnswerCount: integer("correct_answer_count").notNull(),
		incorrectAnswerCount: integer("incorrect_answer_count").notNull(),
		currentQuestionOrder: integer("current_question_order"),
		startedAt: text("started_at").notNull(),
		lastAnsweredAt: text("last_answered_at"),
		completedAt: text("completed_at"),
	},
	(table) => [
		uniqueIndex("quiz_sessions_in_progress_per_user_group").on(table.userId, table.idolGroupId).where(sql`${table.status} = 'in_progress'`),
		index("quiz_sessions_user_id_idx").on(table.userId),
		index("quiz_sessions_idol_group_id_idx").on(table.idolGroupId),
		check("total_question_count_min", sql`${table.totalQuestionCount} >= 1`),
		check(
			"status_current_question_order",
			sql`(${table.status} = 'in_progress' AND ${table.currentQuestionOrder} IS NOT NULL) OR (${table.status} IN ('completed', 'abandoned') AND ${table.currentQuestionOrder} IS NULL)`,
		),
		check("completed_requires_completed_at", sql`${table.status} != 'completed' OR ${table.completedAt} IS NOT NULL`),
		check("non_completed_no_completed_at", sql`${table.status} = 'completed' OR ${table.completedAt} IS NULL`),
		check("answered_requires_last_answered_at", sql`${table.answeredQuestionCount} = 0 OR ${table.lastAnsweredAt} IS NOT NULL`),
		check("no_answer_no_last_answered_at", sql`${table.answeredQuestionCount} > 0 OR ${table.lastAnsweredAt} IS NULL`),
	],
);

export const quizSessionQuestions = sqliteTable(
	"quiz_session_questions",
	{
		quizSessionQuestionId: text("quiz_session_question_id").primaryKey(),
		quizSessionId: text("quiz_session_id")
			.notNull()
			.references(() => quizSessions.quizSessionId, { onDelete: "cascade" }),
		quizId: text("quiz_id")
			.notNull()
			.references(() => quizzes.quizId, { onDelete: "cascade" }),
		questionOrder: integer("question_order").notNull(),
		createdAt: text("created_at").notNull(),
	},
	(table) => [
		unique().on(table.quizSessionId, table.questionOrder),
		unique().on(table.quizSessionId, table.quizId),
		index("quiz_session_questions_quiz_id_idx").on(table.quizId),
	],
);

export const quizAnswers = sqliteTable(
	"quiz_answers",
	{
		quizAnswerId: text("quiz_answer_id").primaryKey(),
		quizSessionQuestionId: text("quiz_session_question_id")
			.notNull()
			.references(() => quizSessionQuestions.quizSessionQuestionId, { onDelete: "cascade" })
			.unique(),
		quizChoiceId: text("quiz_choice_id")
			.notNull()
			.references(() => quizChoices.quizChoiceId),
		awardedScore: integer("awarded_score").notNull(),
		answeredAt: text("answered_at").notNull(),
	},
	(table) => [index("quiz_answers_quiz_choice_id_idx").on(table.quizChoiceId)],
);
