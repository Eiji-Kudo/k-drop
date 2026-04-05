import { createRootRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { BottomTabBar } from "@/components/bottom-tab-bar";
import { primaryCTAClassName } from "@/components/ui/cta-class-names";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageShell } from "@/components/ui/PageShell";

const HIDDEN_BOTTOM_TAB_ROUTE_IDS = new Set(["/(tabs)/quiz/$sessionId", "/(tabs)/quiz/question"]);

function NotFoundPage() {
	return (
		<PageShell className="justify-center">
			<EmptyState
				title="ページが見つかりません"
				description="リンク先が変わったか、まだ準備中のページです。ホームからもう一度探してください。"
				action={
					<Link to="/" className={primaryCTAClassName}>
						トップページに戻る
					</Link>
				}
			/>
		</PageShell>
	);
}

function RootComponent() {
	const matches = useMatches();
	const hideBottomTabBar = matches.some((match) => HIDDEN_BOTTOM_TAB_ROUTE_IDS.has(match.routeId));

	return (
		<div className="relative min-h-[100dvh] overflow-x-hidden bg-app-shell">
			<div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_top,rgba(255,217,232,0.92),transparent_58%)]" />
			<div className="pointer-events-none absolute -left-12 top-20 size-44 rounded-full bg-[radial-gradient(circle,rgba(255,214,241,0.8),transparent_72%)] blur-2xl" />
			<div className="pointer-events-none absolute -right-12 top-32 size-56 rounded-full bg-[radial-gradient(circle,rgba(255,196,223,0.78),transparent_72%)] blur-3xl" />
			<div className="relative mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-28 pt-5 sm:px-6 sm:pt-6">
				<Outlet />
			</div>
			{hideBottomTabBar ? null : <BottomTabBar />}
		</div>
	);
}

export const Route = createRootRoute({
	component: RootComponent,
	notFoundComponent: NotFoundPage,
});
