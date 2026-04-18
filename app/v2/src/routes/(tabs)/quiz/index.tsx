import { createFileRoute } from "@tanstack/react-router";
import { QuizGroupSelectionPage } from "@/features/quiz/pages/quiz-group-selection-page";

export const Route = createFileRoute("/(tabs)/quiz/")({
	component: QuizGroupSelectionPage,
});
