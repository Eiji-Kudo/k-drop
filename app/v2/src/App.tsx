import { APP_DESCRIPTION, APP_NAME, TOOLING } from "@/constants/app";
import { useHealthCheckQuery } from "@/lib/rpc/health-check";
import "./App.css";

function App() {
	const healthCheckQuery = useHealthCheckQuery();
	const healthCheckLabel = healthCheckQuery.isPending
		? "Checking API..."
		: healthCheckQuery.isError
			? "API status: unavailable"
			: `API status: ${healthCheckQuery.data.status}`;

	return (
		<main className="app">
			<section className="hero">
				<p className="eyebrow">K-Drop</p>
				<h1>{APP_NAME}</h1>
				<p className="description">{APP_DESCRIPTION}</p>
			</section>

			<section className="status" aria-live="polite">
				<h2>Backend connection</h2>
				<p className="status-value">{healthCheckLabel}</p>
			</section>

			<section className="tooling" aria-label="Project tooling">
				<h2>Initial setup</h2>
				<ul>
					{TOOLING.map((item) => (
						<li key={item}>{item}</li>
					))}
				</ul>
			</section>
		</main>
	);
}

export default App;
