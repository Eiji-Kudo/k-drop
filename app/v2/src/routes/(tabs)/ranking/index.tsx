import { createFileRoute } from "@tanstack/react-router";
import { RankingPage } from "@/features/ranking/ranking-page";

export const Route = createFileRoute("/(tabs)/ranking/")({
	component: RankingPage,
});
