import { Link, useLocation } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { Crown, Home, Pencil, User } from "lucide-react";
import { cn } from "@/lib/cn";
import type { FileRoutesByTo } from "@/routeTree.gen";

type TabItem = {
	to: keyof FileRoutesByTo;
	label: string;
	icon: LucideIcon;
};

const tabs: ReadonlyArray<TabItem> = [
	{ to: "/", label: "ホーム", icon: Home },
	{ to: "/quiz", label: "クイズ", icon: Pencil },
	{ to: "/ranking", label: "ランキング", icon: Crown },
	{ to: "/profile", label: "プロフィール", icon: User },
];

export function BottomTabBar() {
	const pathname = useLocation({
		select: (location) => location.pathname,
	});

	return (
		<nav
			className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[max(0.85rem,env(safe-area-inset-bottom))]"
			aria-label="メインナビゲーション"
		>
			<div className="pointer-events-auto w-full max-w-md rounded-[2rem] border border-white/80 bg-surface-glass shadow-pop ring-1 ring-white/60 backdrop-blur-xl">
				<ul className="grid grid-cols-4 gap-2 p-2">
					{tabs.map((tab) => (
						<li key={tab.to}>
							<TabButton tab={tab} pathname={pathname} />
						</li>
					))}
				</ul>
			</div>
		</nav>
	);
}

function TabButton({ tab, pathname }: { tab: TabItem; pathname: string }) {
	const isActive = tab.to === "/" ? pathname === "/" : pathname.startsWith(tab.to);
	const Icon = tab.icon;

	return (
		<Link
			to={tab.to}
			className={cn(
				"flex min-h-14 flex-col items-center justify-center gap-1 rounded-[1.35rem] px-2 py-2 text-[0.68rem] font-semibold tracking-[0.02em] transition duration-200",
				isActive ? "bg-white/95 text-primary shadow-soft" : "text-muted-foreground hover:bg-white/70 hover:text-base-content",
			)}
			aria-current={isActive ? "page" : undefined}
		>
			<Icon className="size-5" strokeWidth={2.1} />
			<span>{tab.label}</span>
		</Link>
	);
}
