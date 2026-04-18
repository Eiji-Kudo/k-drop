import { createFileRoute } from "@tanstack/react-router";
import { QuizQuestionPage } from "@/features/quiz/pages/quiz-question-page";

type QuizSessionSearch = {
	groupId: string;
};

export const Route = createFileRoute("/(tabs)/quiz/$sessionId")({
	component: QuizQuestionPage,
	validateSearch: (search: Record<string, unknown>): QuizSessionSearch => ({
		groupId: typeof search.groupId === "string" ? search.groupId : "",
	}),
});
