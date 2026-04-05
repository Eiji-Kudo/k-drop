import { type DefineFactoryResolver, defineFactory } from "@praha/drizzle-factory";
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
	traits: {
		base: (() => ({
			quizId: "quiz-1",
			idolGroupId: "group-1",
			difficulty: "easy",
			status: "published",
			prompt: "What is ...?",
			explanation: null,
			publishedAt: null,
			createdAt: NOW,
			updatedAt: NOW,
		})) satisfies DefineFactoryResolver<typeof schema, "quizzes">,
	},
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
	traits: {
		base: (() => ({
			quizChoiceId: "choice-1",
			quizId: "quiz-1",
			choiceOrder: 1,
			choiceText: "Choice text",
			isCorrect: 0,
		})) satisfies DefineFactoryResolver<typeof schema, "quizChoices">,
	},
});
