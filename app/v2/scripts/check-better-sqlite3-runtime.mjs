try {
	await import("better-sqlite3");
} catch (error) {
	const message = error instanceof Error ? error.message : String(error);

	if (message.includes("NODE_MODULE_VERSION")) {
		console.error("better-sqlite3 was built for a different Node.js version.");
		console.error(
			"After switching Node.js majors, make sure `pnpm exec node -v` reports a 24.x runtime, then run `pnpm run rebuild:native` in app/v2 and rerun the tests.",
		);
		process.exit(1);
	}

	if (message.includes("Cannot find package")) {
		console.error(
			"Dependencies are not installed. Make sure `pnpm exec node -v` reports a 24.x runtime, then run `pnpm install` in app/v2 before running tests.",
		);
		process.exit(1);
	}

	throw error;
}
