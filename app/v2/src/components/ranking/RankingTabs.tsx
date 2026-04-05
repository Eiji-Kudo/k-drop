import { PillTab } from "@/components/ui/PillTab";
import type { IdolGroup } from "./types";

type RankingTabsProps = {
	activeIndex: number;
	groups: ReadonlyArray<IdolGroup>;
	onTabPress: (index: number) => void;
};

export function RankingTabs({ activeIndex, groups, onTabPress }: RankingTabsProps) {
	return (
		<div className="overflow-x-auto pb-1">
			<div className="flex min-w-max items-center gap-2">
				<PillTab active={activeIndex === 0} onClick={() => onTabPress(0)}>
					総合
				</PillTab>
				{groups.map((group, index) => (
					<PillTab key={group.id} active={activeIndex === index + 1} onClick={() => onTabPress(index + 1)}>
						{group.name}
					</PillTab>
				))}
			</div>
		</div>
	);
}
