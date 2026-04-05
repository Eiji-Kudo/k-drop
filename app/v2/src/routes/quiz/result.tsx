import { createFileRoute } from "@tanstack/react-router";

function QuizResultPage() {
	return (
		<main className="flex flex-1 flex-col gap-4">
			<h1 className="text-2xl font-bold">クイズ結果</h1>
		</main>
	);
}

export const Route = createFileRoute("/quiz/result")({
	component: QuizResultPage,
});
