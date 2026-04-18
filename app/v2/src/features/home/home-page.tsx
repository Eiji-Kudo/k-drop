import { PageShell } from "@/components/ui/PageShell";
import { createHomeMotivationViewModel } from "@/lib/ux";
import { BentoGrid } from "./components/BentoGrid";
import { WelcomeHeader } from "./components/WelcomeHeader";

export function HomePage() {
	const viewModel = createHomeMotivationViewModel();

	return (
		<PageShell className="gap-4">
			<WelcomeHeader viewModel={viewModel} />
			<BentoGrid viewModel={viewModel} />
		</PageShell>
	);
}
