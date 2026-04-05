import { createFileRoute } from "@tanstack/react-router";
import { BentoGrid } from "@/components/home/BentoGrid";
import { WelcomeHeader } from "@/components/home/WelcomeHeader";

const MOCK_USER = {
	levelName: "軽いオタク",
	levelStars: 2,
};

function HomePage() {
	return (
		<main className="grid flex-1 content-start gap-4">
			<WelcomeHeader levelName={MOCK_USER.levelName} levelStars={MOCK_USER.levelStars} />
			<BentoGrid />
		</main>
	);
}

export const Route = createFileRoute("/")({
	component: HomePage,
});
