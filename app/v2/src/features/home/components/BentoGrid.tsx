import { BarChart3, PencilLine, UserRound } from "lucide-react";
import type { HomeMotivationViewModel } from "@/lib/ux/types";
import { BentoCard } from "./BentoCard";
import { HomeMomentumChips } from "./HomeMomentumChips";
import { HomeNextGoalCard } from "./HomeNextGoalCard";
import { HomePrimaryActionCard } from "./HomePrimaryActionCard";

type BentoGridProps = {
	viewModel: HomeMotivationViewModel;
};

export function BentoGrid({ viewModel }: BentoGridProps) {
	return (
		<div className="flex flex-col gap-4">
			<HomePrimaryActionCard viewModel={viewModel} />

			<div className="grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
				<div className="min-w-0">
					<HomeNextGoalCard viewModel={viewModel} />
				</div>
				<div className="min-w-0">
					<HomeMomentumChips viewModel={viewModel} />
				</div>
			</div>

			<div className="grid gap-3 sm:grid-cols-2">
				<BentoCard to="/quiz/create" title="問題を作成" subtitle="好きな問題を追加する" icon={PencilLine} />
				<BentoCard to="/ranking" title="ランキング" subtitle="近いライバルをチェック" icon={BarChart3} />
				<BentoCard to="/profile" title="プロフィール" subtitle="伸びた推し力を見返す" icon={UserRound} className="sm:col-span-2" />
			</div>
		</div>
	);
}
