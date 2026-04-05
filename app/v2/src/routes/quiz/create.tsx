import { createFileRoute } from "@tanstack/react-router";

function QuizCreatePage() {
	return (
		<main className="flex flex-1 flex-col gap-4">
			<h1 className="text-2xl font-bold">問題作成</h1>
		</main>
	);
}

export const Route = createFileRoute("/quiz/create")({
	component: QuizCreatePage,
});
