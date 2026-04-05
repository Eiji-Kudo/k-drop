import { index, integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { idolGroups } from "./groups.ts";

export const quizzes = sqliteTable(
	"quizzes",
	{
		quizId: text("quiz_id").primaryKey(),
		idolGroupId: text("idol_group_id")
			.notNull()
			.references(() => idolGroups.idolGroupId, { onDelete: "cascade" }),
		difficulty: text("difficulty", { enum: ["easy", "normal", "hard"] }).notNull(),
		status: text("status", { enum: ["draft", "published", "archived"] }).notNull(),
		prompt: text("prompt").notNull(),
		explanation: text("explanation"),
		publishedAt: text("published_at"),
		createdAt: text("created_at").notNull(),
		updatedAt: text("updated_at").notNull(),
	},
	(table) => [index("quizzes_idol_group_id_status_idx").on(table.idolGroupId, table.status)],
);

export const quizChoices = sqliteTable(
	"quiz_choices",
	{
		quizChoiceId: text("quiz_choice_id").primaryKey(),
		quizId: text("quiz_id")
			.notNull()
			.references(() => quizzes.quizId, { onDelete: "cascade" }),
		choiceOrder: integer("choice_order").notNull(),
		choiceText: text("choice_text").notNull(),
		isCorrect: integer("is_correct").notNull(),
	},
	(table) => [unique().on(table.quizId, table.choiceOrder), index("quiz_choices_quiz_id_idx").on(table.quizId)],
);
