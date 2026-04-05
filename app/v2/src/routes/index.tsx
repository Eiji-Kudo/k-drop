import { createFileRoute } from "@tanstack/react-router";
import { BentoGrid } from "@/components/home/BentoGrid";
import { WelcomeHeader } from "@/components/home/WelcomeHeader";
import { PageShell } from "@/components/ui/PageShell";

const MOCK_USER = {
	levelName: "軽いオタク",
	levelStars: 2,
};

function HomePage() {
	return (
		<PageShell className="gap-4">
			<WelcomeHeader levelName={MOCK_USER.levelName} levelStars={MOCK_USER.levelStars} />
			<BentoGrid />
		</PageShell>
	);
}

export const Route = createFileRoute("/")({
	component: HomePage,
});
