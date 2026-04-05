import { defineFactory } from "@praha/drizzle-factory";
import * as schema from "../../schema/index.ts";
import { NOW } from "./constants";
import { idolGroupsFactory } from "./group-factories";

export const quizzesFactory = defineFactory({
	schema,
	table: "quizzes",
	resolver: ({ sequence, use: related }) => ({
		quizId: `quiz-${sequence}`,
		idolGroupId: () =>
			related(idolGroupsFactory)
				.create()
				.then((group) => group.idolGroupId),
		difficulty: "easy",
		status: "published",
		prompt: `Prompt ${sequence}`,
		explanation: null,
		publishedAt: null,
		createdAt: NOW,
		updatedAt: NOW,
	}),
});

export const quizChoicesFactory = defineFactory({
	schema,
	table: "quizChoices",
	resolver: ({ sequence, use: related }) => ({
		quizChoiceId: `choice-${sequence}`,
		quizId: () =>
			related(quizzesFactory)
				.create()
				.then((quiz) => quiz.quizId),
		choiceOrder: sequence,
		choiceText: `Choice ${sequence}`,
		isCorrect: 0,
	}),
});
