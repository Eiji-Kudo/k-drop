import { createFileRoute } from "@tanstack/react-router";

function QuizSessionPage() {
	const { sessionId } = Route.useParams();

	return (
		<main className="grid flex-1 content-start gap-4">
			<section className="card border border-base-300 bg-base-100 shadow-lg">
				<div className="card-body gap-4 text-center">
					<h1 className="text-2xl font-bold tracking-tight">クイズ</h1>
					<p className="text-base text-base-content/80">セッション: {sessionId}</p>
					<p className="text-sm text-base-content/60">問題画面は今後実装予定です</p>
				</div>
			</section>
		</main>
	);
}

export const Route = createFileRoute("/quiz/$sessionId")({
	component: QuizSessionPage,
});
