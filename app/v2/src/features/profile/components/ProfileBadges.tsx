import { SectionCard } from "@/components/ui/SectionCard";
import { getBadgeColorClass } from "../badge-colors";
import type { Badge } from "../types";
import { BadgeIcon } from "./BadgeIcon";

type ProfileBadgesProps = {
	badges: Badge[];
};

export function ProfileBadges({ badges }: ProfileBadgesProps) {
	return (
		<SectionCard className="px-4 py-4">
			<h2 className="mb-3 text-base font-black tracking-[-0.02em] text-base-content">バッジ</h2>

			{badges.length > 0 ? (
				<div className="flex gap-4 overflow-x-auto pb-2">
					{badges.map((badge) => (
						<div key={badge.type} className="flex shrink-0 flex-col items-center gap-1.5">
							<div className={`flex size-[60px] items-center justify-center rounded-full ${getBadgeColorClass(badge.level)}`}>
								<BadgeIcon type={badge.type} />
							</div>
							<span className="max-w-[70px] text-center text-xs">{badge.name}</span>
						</div>
					))}
				</div>
			) : (
				<p className="py-4 text-center text-sm text-base-content/60">クイズに挑戦してバッジを獲得しよう！</p>
			)}
		</SectionCard>
	);
}
