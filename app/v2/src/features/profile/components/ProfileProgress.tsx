import { SectionCard } from "@/components/ui/SectionCard";

type ProfileProgressProps = {
	currentScore: number;
	percentageIncrease?: number;
};

export function ProfileProgress({ currentScore, percentageIncrease }: ProfileProgressProps) {
	const changeLabel = percentageIncrease !== undefined ? `直近7日: ${percentageIncrease >= 0 ? "+" : ""}${percentageIncrease}%` : undefined;
	const changeColorClass = percentageIncrease !== undefined && percentageIncrease < 0 ? "text-error" : "text-success";

	return (
		<SectionCard className="px-4 py-4">
			<div className="mb-3 flex items-baseline justify-between">
				<h2 className="text-base font-black tracking-[-0.02em] text-base-content">推移</h2>
				<div className="text-right">
					<span className="text-xl font-black tracking-[-0.03em]">{currentScore}</span>
					{changeLabel && <p className={`text-xs ${changeColorClass}`}>{changeLabel}</p>}
				</div>
			</div>

			<div className="flex h-40 items-center justify-center rounded-panel bg-surface-soft">
				<span className="text-sm text-base-content/50">Coming Soon</span>
			</div>
		</SectionCard>
	);
}
