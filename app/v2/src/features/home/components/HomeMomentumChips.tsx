import { Flame, Star, TrendingUp } from "lucide-react";
import { SectionCard } from "@/components/ui/SectionCard";
import type { HomeMotivationViewModel } from "@/lib/ux/types";

type HomeMomentumChipsProps = {
	viewModel: HomeMotivationViewModel;
};

const chipMeta = [
	{ key: "weekly", labelKey: "weeklyPlayProgressLabel", icon: Flame },
	{ key: "growth", labelKey: "recentGrowthLabel", icon: TrendingUp },
	{ key: "group", labelKey: "fastestGrowingGroupLabel", icon: Star },
] as const;

export function HomeMomentumChips({ viewModel }: HomeMomentumChipsProps) {
	const items = chipMeta
		.map(({ key, labelKey, icon }) => ({
			key,
			label: viewModel[labelKey],
			icon,
		}))
		.filter((item) => item.label !== null);

	return (
		<SectionCard tone="soft" className="flex h-full flex-col gap-4 px-5 py-5">
			<div className="space-y-1">
				<p className="text-[0.72rem] font-semibold tracking-[0.18em] text-muted-foreground">今日の勢い</p>
				<h2 className="text-lg font-black tracking-[-0.03em] text-base-content">今日の積み上がり</h2>
			</div>

			<div className="flex flex-col gap-2.5">
				{items.map(({ key, label, icon: Icon }) => (
					<div
						key={key}
						className="flex items-center gap-3 rounded-pill border border-border-soft bg-white/78 px-4 py-3 text-sm font-semibold text-base-content shadow-soft"
					>
						<div className="flex size-9 items-center justify-center rounded-full bg-surface-strong text-primary">
							<Icon className="size-4" strokeWidth={2.2} />
						</div>
						<span>{label}</span>
					</div>
				))}
			</div>
		</SectionCard>
	);
}
