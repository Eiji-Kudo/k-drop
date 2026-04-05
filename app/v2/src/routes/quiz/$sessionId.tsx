import { createFileRoute } from "@tanstack/react-router";

function QuizSessionPage() {
	const { sessionId } = Route.useParams();

	return (
		<main className="flex flex-1 flex-col gap-4">
			<h1 className="text-2xl font-bold">クイズ</h1>
			<p className="text-base-content/80">セッション: {sessionId}</p>
		</main>
	);
}

export const Route = createFileRoute("/quiz/$sessionId")({
	component: QuizSessionPage,
});
