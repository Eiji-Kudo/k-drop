import { createFileRoute } from "@tanstack/react-router";

type QuizSessionSearch = {
	groupId: string;
};

function QuizSessionPage() {
	const { sessionId } = Route.useParams();
	const { groupId } = Route.useSearch();

	return (
		<main className="grid flex-1 content-start gap-4">
			<section className="card border border-base-300 bg-base-100 shadow-lg">
				<div className="card-body gap-4 text-center">
					<h1 className="text-2xl font-bold tracking-tight">クイズ</h1>
					<p className="text-base text-base-content/80">セッション: {sessionId}</p>
					<p className="text-base text-base-content/80">グループ: {groupId}</p>
					<p className="text-sm text-base-content/60">問題画面は今後実装予定です</p>
				</div>
			</section>
		</main>
	);
}

export const Route = createFileRoute("/quiz/$sessionId")({
	component: QuizSessionPage,
	validateSearch: (search: Record<string, unknown>): QuizSessionSearch => ({
		groupId: typeof search.groupId === "string" ? search.groupId : "",
	}),
});
