import { APP_DESCRIPTION, APP_NAME, TOOLING } from "@/constants/app";

function App() {
	return (
		<main className="grid flex-1 content-start gap-4">
			<section className="card border border-base-300 bg-white shadow-lg">
				<div className="card-body gap-4">
					<div className="flex items-start justify-between gap-4">
						<div>
							<p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent">K-Drop</p>
							<h1 className="text-4xl font-bold tracking-tight">{APP_NAME}</h1>
						</div>
						<div aria-hidden="true" className="hidden size-16 rounded-box bg-gradient-to-br from-primary to-accent sm:block" />
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

			<section aria-label="Project tooling" className="card border border-base-300 bg-secondary shadow-md">
				<div className="card-body gap-4">
					<div className="flex items-center justify-between gap-4">
						<div>
							<p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-secondary-content/80">Theme setup</p>
							<h2 className="card-title text-2xl text-secondary-content">Initial setup</h2>
						</div>
						<button type="button" className="btn btn-primary btn-sm">
							valentine base
						</button>
					</div>
					<ul className="grid gap-3">
						{TOOLING.map((item) => (
							<li key={item} className="flex items-center gap-3 rounded-box bg-white px-4 py-3 text-sm font-medium text-base-content shadow-sm">
								<span aria-hidden="true" className="inline-block size-2 rounded-full bg-success" />
								<span>{item}</span>
							</li>
						))}
					</ul>
					<div className="alert bg-white text-base-content shadow-sm">
						<span>Tailwind CSS v4 + daisyUI 5 are ready for the mobile-first K-Drop shell.</span>
					</div>
				</div>
			</section>
		</main>
	);
}

export default App;
