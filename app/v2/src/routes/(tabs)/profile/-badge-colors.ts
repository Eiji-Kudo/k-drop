import type { BadgeLevel } from "./-types";

const BADGE_COLORS: Record<BadgeLevel, string> = {
	gold: "bg-yellow-400",
	silver: "bg-gray-300",
	bronze: "bg-amber-600",
};

export function getBadgeColorClass(level: BadgeLevel): string {
	return BADGE_COLORS[level];
}
