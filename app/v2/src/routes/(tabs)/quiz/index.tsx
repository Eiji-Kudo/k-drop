import { createFileRoute } from "@tanstack/react-router";
import { GroupSelectionPage } from "@/features/quiz/pages/quiz-group-selection-page";

export const Route = createFileRoute("/(tabs)/quiz/")({
	component: GroupSelectionPage,
});
