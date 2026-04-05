import { createFileRoute } from "@tanstack/react-router";

function RankingPage() {
	return (
		<main className="flex flex-1 flex-col gap-4">
			<h1 className="text-2xl font-bold">ランキング</h1>
		</main>
	);
}

export const Route = createFileRoute("/ranking/")({
	component: RankingPage,
});
