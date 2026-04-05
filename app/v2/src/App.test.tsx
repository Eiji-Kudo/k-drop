import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import App from "@/App";

describe("App", () => {
	it("renders the starter content", () => {
		const html = renderToStaticMarkup(<App />);

		expect(html).toContain("K-Drop v2");
		expect(html).toContain("Strict TypeScript");
		expect(html).toContain("Vitest test runner");
	});
});
