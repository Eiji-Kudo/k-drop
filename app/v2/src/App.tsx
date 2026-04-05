import { APP_DESCRIPTION, APP_NAME, TOOLING } from "@/constants/app";
import { useHealthCheckQuery } from "@/lib/rpc/health-check";

function App() {
	const healthCheckQuery = useHealthCheckQuery();
	const healthCheckLabel = healthCheckQuery.isPending
		? "Checking API..."
		: healthCheckQuery.isError
			? "API status: unavailable"
			: `API status: ${healthCheckQuery.data?.status ?? "unknown"}`;

	return (
		<main className="grid flex-1 content-start gap-4">
			<section className="card border border-base-300 bg-base-100 shadow-lg">
				<div className="card-body gap-4">
					<div>
						<p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent-on-base">K-Drop</p>
						<h1 className="text-4xl font-bold tracking-tight">{APP_NAME}</h1>
					</div>
					<p className="text-base leading-7 text-base-content/80">{APP_DESCRIPTION}</p>
					<div className="flex flex-wrap gap-2">
						<span className="badge badge-primary">Primary</span>
						<span className="badge badge-secondary">Secondary</span>
						<span className="badge badge-accent">Accent</span>
						<span className="badge badge-success">Success</span>
						<span className="badge badge-error">Error</span>
					</div>
				</div>
			</section>

			<section className="card border border-base-300 bg-base-100 shadow-md" aria-live="polite">
				<div className="card-body gap-4">
					<h2 className="card-title text-2xl">Backend connection</h2>
					<p className="text-lg font-semibold text-base-content">{healthCheckLabel}</p>
				</div>
			</section>

			<section aria-label="Project tooling" className="card border border-base-300 bg-secondary shadow-md">
				<div className="card-body gap-4">
					<div className="flex items-center justify-between gap-4">
						<div>
							<p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-secondary-content/80">Theme setup</p>
							<h2 className="card-title text-2xl text-secondary-content">Initial setup</h2>
						</div>
						<span className="badge badge-primary badge-sm">valentine base</span>
					</div>
					<ul className="grid gap-3">
						{TOOLING.map((item) => (
							<li key={item} className="flex items-center gap-3 rounded-box bg-base-100 px-4 py-3 text-sm font-medium text-base-content shadow-sm">
								<span aria-hidden="true" className="inline-block size-2 rounded-full bg-success" />
								<span className="sr-only">Included:</span>
								<span>{item}</span>
							</li>
						))}
					</ul>
					<div role="status" className="alert bg-base-100 text-base-content shadow-sm">
						<span>Tailwind CSS v4 + daisyUI 5 are ready for the mobile-first K-Drop shell.</span>
					</div>
				</div>
			</section>
		</main>
	);
}

export default App;
