import { BentoGrid } from "./components/BentoGrid";
import { WelcomeHeader } from "./components/WelcomeHeader";

const MOCK_USER = {
	levelName: "軽いオタク",
	levelStars: 2,
};

export function HomePage() {
	return (
		<main className="grid flex-1 content-start gap-4">
			<WelcomeHeader levelName={MOCK_USER.levelName} levelStars={MOCK_USER.levelStars} />
			<BentoGrid />
		</main>
	);
}
