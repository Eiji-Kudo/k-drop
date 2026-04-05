import { Link, useMatches } from "@tanstack/react-router";
import { Crown, Home, Pencil, User } from "lucide-react";
import type { ComponentType } from "react";

type TabItem = {
	to: string;
	label: string;
	icon: ComponentType<{ className?: string }>;
};

const tabs: ReadonlyArray<TabItem> = [
	{ to: "/", label: "ホーム", icon: Home },
	{ to: "/quiz", label: "クイズ", icon: Pencil },
	{ to: "/ranking", label: "ランキング", icon: Crown },
	{ to: "/profile", label: "プロフィール", icon: User },
];

function useIsTabBarVisible() {
	const matches = useMatches();
	return !matches.some((match) => match.routeId === "/quiz/$sessionId");
}

export function BottomTabBar() {
	const isVisible = useIsTabBarVisible();

	if (!isVisible) {
		return null;
	}

	return (
		<nav className="btm-nav btm-nav-sm sticky bottom-0 z-50 border-t border-base-300 bg-base-100" aria-label="メインナビゲーション">
			{tabs.map((tab) => (
				<TabButton key={tab.to} tab={tab} />
			))}
		</nav>
	);
}

function TabButton({ tab }: { tab: TabItem }) {
	const matches = useMatches();
	const isActive = tab.to === "/" ? matches[matches.length - 1]?.fullPath === "/" : matches.some((match) => match.fullPath.startsWith(tab.to));
	const Icon = tab.icon;

	return (
		<Link to={tab.to} className={`${isActive ? "active text-primary" : "text-base-content/60"}`} aria-current={isActive ? "page" : undefined}>
			<Icon className="size-5" />
			<span className="btm-nav-label text-xs">{tab.label}</span>
		</Link>
	);
}
