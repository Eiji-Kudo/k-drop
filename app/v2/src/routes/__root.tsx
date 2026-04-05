import { createRootRoute, Outlet } from "@tanstack/react-router";

function NotFoundPage() {
	return (
		<main className="app">
			<section className="hero">
				<p className="eyebrow">404</p>
				<h1>Page not found</h1>
				<p className="description">お探しのページは見つかりませんでした。</p>
			</section>
		</main>
	);
}

function RootComponent() {
	return <Outlet />;
}

export const Route = createRootRoute({
	component: RootComponent,
	notFoundComponent: NotFoundPage,
});
