import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

function NotFoundPage() {
	return (
		<main className="flex flex-1 items-center">
			<section className="card w-full border border-base-300 bg-base-100 shadow-lg">
				<div className="card-body gap-4 text-center">
					<p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">404</p>
					<h1 className="text-4xl font-bold tracking-tight">Page not found</h1>
					<p className="text-base text-base-content/80">お探しのページは見つかりませんでした。</p>
					<div className="card-actions justify-center">
						<Link to="/" className="btn btn-primary">トップページに戻る</Link>
					</div>
				</div>
			</section>
		</main>
	);
}

function RootComponent() {
	return (
		<div className="min-h-screen bg-base-100">
			<div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 py-6 sm:px-6">
				<Outlet />
			</div>
		</div>
	);
}

export const Route = createRootRoute({
	component: RootComponent,
	notFoundComponent: NotFoundPage,
});
