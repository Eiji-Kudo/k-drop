import type { IdolGroup } from "./types";

type RankingTabsProps = {
	activeIndex: number;
	groups: ReadonlyArray<IdolGroup>;
	onTabPress: (index: number) => void;
};

export function RankingTabs({ activeIndex, groups, onTabPress }: RankingTabsProps) {
	return (
		<div className="border-b border-base-300 bg-base-100">
			<div className="flex items-center overflow-x-auto px-2">
				<button
					type="button"
					className={`shrink-0 px-5 py-4 text-base ${activeIndex === 0 ? "border-b-2 border-primary font-bold text-primary" : "text-base-content/60"}`}
					onClick={() => onTabPress(0)}
				>
					Total
				</button>

				<div className="h-6 w-px shrink-0 bg-base-300" />

				{groups.map((group, index) => (
					<button
						key={group.id}
						type="button"
						className={`shrink-0 px-5 py-4 text-base ${activeIndex === index + 1 ? "border-b-2 border-primary font-bold text-primary" : "text-base-content/60"}`}
						onClick={() => onTabPress(index + 1)}
					>
						{group.name}
					</button>
				))}
			</div>
		</div>
	);
}
