export type BadgeType = "quiz_master" | "concert_goer" | "photocard_collector" | "dance_cover_star";
export type BadgeLevel = "gold" | "silver" | "bronze";

export type Badge = {
	type: BadgeType;
	level: BadgeLevel;
	name: string;
};
