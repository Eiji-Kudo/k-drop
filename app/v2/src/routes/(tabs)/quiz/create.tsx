import { createFileRoute } from "@tanstack/react-router";
import { QuizCreatePage } from "@/features/quiz/pages/quiz-create-page";

export const Route = createFileRoute("/(tabs)/quiz/create")({
	component: QuizCreatePage,
});
