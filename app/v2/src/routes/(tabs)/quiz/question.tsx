import { createFileRoute } from "@tanstack/react-router";
import { QuizQuestionPage } from "@/features/quiz/pages/quiz-question-page";

export const Route = createFileRoute("/(tabs)/quiz/question")({
	component: QuizQuestionPage,
});
