import { createFileRoute } from "@tanstack/react-router";

function QuizPage() {
	return (
		<main className="flex flex-1 flex-col gap-4">
			<h1 className="text-2xl font-bold">グループ選択</h1>
		</main>
	);
}

export const Route = createFileRoute("/quiz/")({
	component: QuizPage,
});
