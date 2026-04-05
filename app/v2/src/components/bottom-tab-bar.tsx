import { Link, useMatches } from "@tanstack/react-router";
import { Crown, Home, Pencil, User } from "lucide-react";
import type { ComponentType } from "react";
import type { FileRoutesByTo } from "@/routeTree.gen";

type TabItem = {
	to: keyof FileRoutesByTo;
	label: string;
	icon: ComponentType<{ className?: string }>;
};

const tabs: ReadonlyArray<TabItem> = [
	{ to: "/", label: "ホーム", icon: Home },
	{ to: "/quiz", label: "クイズ", icon: Pencil },
	{ to: "/ranking", label: "ランキング", icon: Crown },
	{ to: "/profile", label: "プロフィール", icon: User },
];

export function BottomTabBar() {
	const matches = useMatches();
	const isVisible = !matches.some((match) => match.routeId === "/quiz/$sessionId");

	if (!isVisible) {
		return null;
	}

	return (
		<nav className="dock dock-sm" aria-label="メインナビゲーション">
			{tabs.map((tab) => (
				<TabButton key={tab.to} tab={tab} matches={matches} />
			))}
		</nav>
	);
}

function TabButton({ tab, matches }: { tab: TabItem; matches: ReturnType<typeof useMatches> }) {
	const isActive = tab.to === "/" ? matches[matches.length - 1]?.fullPath === "/" : matches.some((match) => match.fullPath.startsWith(tab.to));
	const Icon = tab.icon;

	return (
		<Link to={tab.to} className={isActive ? "dock-active text-primary" : "text-base-content/60"} aria-current={isActive ? "page" : undefined}>
			<Icon className="size-5" />
			<span className="dock-label">{tab.label}</span>
		</Link>
	);
}
