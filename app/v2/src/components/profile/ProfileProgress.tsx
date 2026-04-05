type ProfileProgressProps = {
	currentScore: number;
	percentageIncrease?: number;
};

export function ProfileProgress({ currentScore, percentageIncrease }: ProfileProgressProps) {
	const changeLabel = percentageIncrease !== undefined ? `Last 7 Days: ${percentageIncrease >= 0 ? "+" : ""}${percentageIncrease}%` : undefined;

	return (
		<section className="px-4 py-3">
			<div className="mb-3 flex items-baseline justify-between">
				<h2 className="text-base font-semibold">Power Progress</h2>
				<div className="text-right">
					<span className="text-xl font-bold">{currentScore}</span>
					{changeLabel && <p className="text-xs text-success">{changeLabel}</p>}
				</div>
			</div>

			<div className="flex h-40 items-center justify-center rounded-box bg-base-200">
				<span className="text-sm text-base-content/50">Coming Soon</span>
			</div>
		</section>
	);
}
