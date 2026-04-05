import { createFileRoute } from "@tanstack/react-router";
import { BentoGrid } from "@/components/home/BentoGrid";
import { WelcomeHeader } from "@/components/home/WelcomeHeader";
import { PageShell } from "@/components/ui/PageShell";
import { createHomeMotivationViewModel } from "@/lib/ux";

function HomePage() {
	const viewModel = createHomeMotivationViewModel();

	return (
		<PageShell className="gap-4">
			<WelcomeHeader viewModel={viewModel} />
			<BentoGrid viewModel={viewModel} />
		</PageShell>
	);
}

export const Route = createFileRoute("/")({
	component: HomePage,
});
