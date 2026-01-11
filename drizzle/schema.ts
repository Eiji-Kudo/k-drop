import { pgTable, serial, text, foreignKey, integer, uuid, timestamp, boolean, index } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const groupCategories = pgTable("group_categories", {
	groupCategoryId: serial("group_category_id").primaryKey().notNull(),
	categoryName: text("category_name").notNull(),
});

export const idolGroups = pgTable("idol_groups", {
	idolGroupId: serial("idol_group_id").primaryKey().notNull(),
	groupCategoryId: integer("group_category_id").notNull(),
	idolGroupName: text("idol_group_name").notNull(),
	thumbnailImage: text("thumbnail_image"),
}, (table) => [
	foreignKey({
			columns: [table.groupCategoryId],
			foreignColumns: [groupCategories.groupCategoryId],
			name: "fk_group_category"
		}),
]);

export const appUsers = pgTable("app_users", {
	appUserId: serial("app_user_id").primaryKey().notNull(),
	supabaseUuid: uuid("supabase_uuid").notNull(),
	lineAccountId: text("line_account_id").notNull(),
});

export const groupOtakuLayers = pgTable("group_otaku_layers", {
	groupOtakuLayerId: serial("group_otaku_layer_id").primaryKey().notNull(),
	layerName: text("layer_name").notNull(),
	minScore: integer("min_score").notNull(),
	maxScore: integer("max_score").notNull(),
});

export const quizzes = pgTable("quizzes", {
	quizId: serial("quiz_id").primaryKey().notNull(),
	idolGroupId: integer("idol_group_id").notNull(),
	quizDifficultyId: integer("quiz_difficulty_id").notNull(),
	prompt: text().notNull(),
	explanation: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.idolGroupId],
			foreignColumns: [idolGroups.idolGroupId],
			name: "fk_quiz_question_idol_group"
		}),
	foreignKey({
			columns: [table.quizDifficultyId],
			foreignColumns: [quizDifficulties.quizDifficultyId],
			name: "fk_quiz_question_quiz_difficulty"
		}),
]);

export const quizDifficulties = pgTable("quiz_difficulties", {
	quizDifficultyId: serial("quiz_difficulty_id").primaryKey().notNull(),
	difficultyName: text("difficulty_name").notNull(),
});

export const totalOtakuLayers = pgTable("total_otaku_layers", {
	totalOtakuLayerId: serial("total_otaku_layer_id").primaryKey().notNull(),
	layerName: text("layer_name").notNull(),
	minScore: integer("min_score").notNull(),
	maxScore: integer("max_score").notNull(),
});

export const monthlyScoreHistories = pgTable("monthly_score_histories", {
	monthlyScoreHistoryId: serial("monthly_score_history_id").primaryKey().notNull(),
	appUserId: integer("app_user_id").notNull(),
	month: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	scoreSnapshot: integer("score_snapshot").notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.appUserId],
			foreignColumns: [appUsers.appUserId],
			name: "fk_monthly_score_app_user"
		}),
]);

export const events = pgTable("events", {
	eventId: serial("event_id").primaryKey().notNull(),
	createdBy: integer("created_by").notNull(),
	eventName: text("event_name").notNull(),
	eventDescription: text("event_description").notNull(),
	location: text().notNull(),
	eventDate: timestamp("event_date", { withTimezone: true, mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [appUsers.appUserId],
			name: "fk_event_created_by"
		}),
]);

export const eventGroupParticipations = pgTable("event_group_participations", {
	eventGroupParticipationId: serial("event_group_participation_id").primaryKey().notNull(),
	eventId: integer("event_id").notNull(),
	idolGroupId: integer("idol_group_id").notNull(),
	registeredAt: timestamp("registered_at", { withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [events.eventId],
			name: "fk_event_group_event"
		}),
	foreignKey({
			columns: [table.idolGroupId],
			foreignColumns: [idolGroups.idolGroupId],
			name: "fk_event_group_idol_group"
		}),
]);

export const eventParticipations = pgTable("event_participations", {
	eventParticipationId: serial("event_participation_id").primaryKey().notNull(),
	eventId: integer("event_id").notNull(),
	appUserId: integer("app_user_id").notNull(),
	joinedAt: timestamp("joined_at", { withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [events.eventId],
			name: "fk_event_participation_event"
		}),
	foreignKey({
			columns: [table.appUserId],
			foreignColumns: [appUsers.appUserId],
			name: "fk_event_participation_app_user"
		}),
]);

export const rankingGroups = pgTable("ranking_groups", {
	rankingGroupId: serial("ranking_group_id").primaryKey().notNull(),
	appUserId: integer("app_user_id").notNull(),
	idolGroupId: integer("idol_group_id").notNull(),
	displayRank: integer("display_rank").notNull(),
	displayScore: integer("display_score").notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.appUserId],
			foreignColumns: [appUsers.appUserId],
			name: "fk_ranking_group_app_user"
		}),
	foreignKey({
			columns: [table.idolGroupId],
			foreignColumns: [idolGroups.idolGroupId],
			name: "fk_ranking_group_idol_group"
		}),
]);

export const rankingTotals = pgTable("ranking_totals", {
	rankingTotalId: serial("ranking_total_id").primaryKey().notNull(),
	appUserId: integer("app_user_id").notNull(),
	displayRank: integer("display_rank").notNull(),
	displayScore: integer("display_score").notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.appUserId],
			foreignColumns: [appUsers.appUserId],
			name: "fk_ranking_total_app_user"
		}),
]);

export const userIdolGroupScores = pgTable("user_idol_group_scores", {
	userIdolGroupScoreId: serial("user_idol_group_score_id").primaryKey().notNull(),
	appUserId: integer("app_user_id").notNull(),
	idolGroupId: integer("idol_group_id").notNull(),
	otakuScore: integer("otaku_score").notNull(),
	groupOtakuLayerId: integer("group_otaku_layer_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.appUserId],
			foreignColumns: [appUsers.appUserId],
			name: "fk_user_idol_app_user"
		}),
	foreignKey({
			columns: [table.idolGroupId],
			foreignColumns: [idolGroups.idolGroupId],
			name: "fk_user_idol_idol_group"
		}),
	foreignKey({
			columns: [table.groupOtakuLayerId],
			foreignColumns: [groupOtakuLayers.groupOtakuLayerId],
			name: "fk_user_idol_group_otaku_layer"
		}),
]);

export const userProfiles = pgTable("user_profiles", {
	userProfileId: serial("user_profile_id").primaryKey().notNull(),
	appUserId: integer("app_user_id").notNull(),
	userName: text("user_name").notNull(),
	totalOtakuScore: integer("total_otaku_score").notNull(),
	remainingDrop: integer("remaining_drop").notNull(),
	totalOtakuLayerId: integer("total_otaku_layer_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.appUserId],
			foreignColumns: [appUsers.appUserId],
			name: "fk_app_user"
		}),
	foreignKey({
			columns: [table.totalOtakuLayerId],
			foreignColumns: [totalOtakuLayers.totalOtakuLayerId],
			name: "fk_total_otaku_layer"
		}),
]);

export const userQuizAnswers = pgTable("user_quiz_answers", {
	userQuizAnswerId: serial("user_quiz_answer_id").primaryKey().notNull(),
	appUserId: integer("app_user_id").notNull(),
	quizId: integer("quiz_id").notNull(),
	selectedChoice: integer("selected_choice").notNull(),
	isCorrect: boolean("is_correct").notNull(),
	answeredAt: timestamp("answered_at", { withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.appUserId],
			foreignColumns: [appUsers.appUserId],
			name: "fk_user_quiz_app_user"
		}),
	foreignKey({
			columns: [table.quizId],
			foreignColumns: [quizzes.quizId],
			name: "fk_user_quiz"
		}),
]);

export const quizChoices = pgTable("quiz_choices", {
	quizChoiceId: serial("quiz_choice_id").primaryKey().notNull(),
	quizId: integer("quiz_id").notNull(),
	choiceText: text("choice_text").notNull(),
	isCorrect: boolean("is_correct").default(false).notNull(),
}, (table) => [
	index("idx_quiz_choices_quiz_id").using("btree", table.quizId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.quizId],
			foreignColumns: [quizzes.quizId],
			name: "quiz_choices_quiz_id_fkey"
		}).onDelete("cascade"),
]);
