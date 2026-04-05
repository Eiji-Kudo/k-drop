import { createFileRoute } from "@tanstack/react-router";

function HomePage() {
	return (
		<main className="flex flex-1 flex-col gap-4">
			<h1 className="text-2xl font-bold">ホーム</h1>
		</main>
	);
}

export const Route = createFileRoute("/")({
	component: HomePage,
});
