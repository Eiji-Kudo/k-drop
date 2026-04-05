export type BadgeLevel = "gold" | "silver" | "bronze";
export type BadgeType = "quiz_master" | "concert_goer" | "photocard_collector" | "dance_cover_star";

export type Badge = {
	type: BadgeType;
	level: BadgeLevel;
	name: string;
};

export type MockGroup = {
	id: string;
	name: string;
	imageUrl?: string;
};
