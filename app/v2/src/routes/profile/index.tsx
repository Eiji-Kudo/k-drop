import { createFileRoute } from "@tanstack/react-router";

function ProfilePage() {
	return (
		<main className="flex flex-1 flex-col gap-4">
			<h1 className="text-2xl font-bold">プロフィール</h1>
		</main>
	);
}

export const Route = createFileRoute("/profile/")({
	component: ProfilePage,
});
