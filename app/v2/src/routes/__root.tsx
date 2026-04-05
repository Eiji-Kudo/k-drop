import { createRootRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { BottomTabBar } from "@/components/bottom-tab-bar";

const HIDDEN_BOTTOM_TAB_ROUTE_IDS = new Set(["/(tabs)/quiz/$sessionId", "/(tabs)/quiz/question"]);

function NotFoundPage() {
	return (
		<main className="flex flex-1 items-center">
			<section className="card w-full border border-base-300 bg-base-100 shadow-lg">
				<div className="card-body gap-4 text-center">
					<p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-on-base">404</p>
					<h1 className="text-4xl font-bold tracking-tight">Page not found</h1>
					<p className="text-base text-base-content/80">お探しのページは見つかりませんでした。</p>
					<div className="card-actions justify-center">
						<Link to="/" className="btn btn-primary">
							トップページに戻る
						</Link>
					</div>
				</div>
			</section>
		</main>
	);
}

function RootComponent() {
	const matches = useMatches();
	const hideBottomTabBar = matches.some((match) => HIDDEN_BOTTOM_TAB_ROUTE_IDS.has(match.routeId));

	return (
		<div className="flex min-h-[100dvh] flex-col bg-base-100">
			<div className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-20 pt-6 sm:px-6">
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
