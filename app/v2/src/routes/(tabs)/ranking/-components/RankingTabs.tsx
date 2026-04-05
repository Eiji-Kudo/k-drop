import type { IdolGroup } from "../-types";

type RankingTabsProps = {
	activeIndex: number;
	groups: ReadonlyArray<IdolGroup>;
	onTabPress: (index: number) => void;
};

function getTabClassName(isActive: boolean) {
	return `shrink-0 px-5 py-4 text-base ${isActive ? "border-b-2 border-primary font-bold text-primary" : "text-secondary"}`;
}

export function RankingTabs({ activeIndex, groups, onTabPress }: RankingTabsProps) {
	return (
		<div className="border-b border-base-300 bg-base-100">
			<div className="flex items-center overflow-x-auto px-2">
				<button type="button" className={getTabClassName(activeIndex === 0)} onClick={() => onTabPress(0)}>
					Total
				</button>

				<div className="h-6 w-px shrink-0 bg-base-300" />

				{groups.map((group, index) => (
					<button key={group.id} type="button" className={getTabClassName(activeIndex === index + 1)} onClick={() => onTabPress(index + 1)}>
						{group.name}
					</button>
				))}
			</div>
		</div>
	);
}
