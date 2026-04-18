import { createFileRoute } from "@tanstack/react-router";
import { QuizResultPage } from "@/features/quiz/pages/quiz-result-page";

export const Route = createFileRoute("/(tabs)/quiz/result")({
	component: QuizResultPage,
});
