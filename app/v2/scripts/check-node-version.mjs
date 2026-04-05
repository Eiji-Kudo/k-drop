const minimumV24 = [24, 14, 1];
const current = process.versions.node.split(".").map((value) => Number.parseInt(value, 10));

const compareVersions = (left, right) => {
	for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
		const leftPart = left[index] ?? 0;
		const rightPart = right[index] ?? 0;

		if (leftPart > rightPart) return 1;
		if (leftPart < rightPart) return -1;
	}

	return 0;
};

const isSupportedNodeVersion = current[0] === 24 && compareVersions(current, minimumV24) >= 0;

if (!isSupportedNodeVersion) {
	console.error(`Unsupported Node.js ${process.version}. app/v2 requires Node.js 24.14.1+ within the 24.x LTS line.`);
	console.error("Run `nvm use` in app/v2 or switch to a compatible Node.js version before rerunning this command.");
	process.exit(1);
}
