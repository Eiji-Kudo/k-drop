import { BarChart3, PencilLine, UserRound } from "lucide-react";
import { BentoCard } from "@/components/home/BentoCard";
import { HomeMomentumChips } from "@/components/home/HomeMomentumChips";
import { HomeNextGoalCard } from "@/components/home/HomeNextGoalCard";
import { HomePrimaryActionCard } from "@/components/home/HomePrimaryActionCard";
import type { HomeMotivationViewModel } from "@/lib/ux/types";

type BentoGridProps = {
	viewModel: HomeMotivationViewModel;
};

export function BentoGrid({ viewModel }: BentoGridProps) {
	return (
		<div className="flex flex-col gap-4">
			<div className="grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
				<div className="min-w-0">
					<HomeNextGoalCard viewModel={viewModel} />
				</div>
				<div className="min-w-0">
					<HomeMomentumChips viewModel={viewModel} />
				</div>
			</div>

			<HomePrimaryActionCard viewModel={viewModel} />

			<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
				<BentoCard to="/quiz/create" title="問題を作成" subtitle="好きな問題を追加する" icon={PencilLine} />
				<BentoCard to="/ranking" title="ランキング" subtitle="近いライバルをチェック" icon={BarChart3} />
				<BentoCard to="/profile" title="プロフィール" subtitle="伸びた推し力を見返す" icon={UserRound} />
			</div>
		</div>
	);
}
