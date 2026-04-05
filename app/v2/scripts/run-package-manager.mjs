import { spawn } from "node:child_process";

const npmExecPath = process.env.npm_execpath;

if (!npmExecPath) {
	console.error("npm_execpath is not available. Run this command through pnpm so app/v2 can reuse the active package manager.");
	process.exit(1);
}

const child = spawn(process.execPath, [npmExecPath, ...process.argv.slice(2)], {
	env: process.env,
	stdio: "inherit",
});

child.on("exit", (code, signal) => {
	if (signal) {
		process.kill(process.pid, signal);
		return;
	}

	process.exit(code ?? 1);
});
