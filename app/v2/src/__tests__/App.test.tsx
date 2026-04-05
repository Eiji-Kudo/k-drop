import { createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createAppRouter } from "@/router";

async function renderRoute(path: string) {
	const router = createAppRouter(
		createMemoryHistory({
			initialEntries: [path],
		}),
	);

	await router.load();
	render(<RouterProvider router={router} />);
}

describe("App routes", () => {
	it("renders the starter content on the top page", async () => {
		await renderRoute("/");
		expect(await screen.findByText("K-Drop v2")).toBeInTheDocument();
		expect(screen.getByRole("heading", { name: "Initial setup" })).toBeInTheDocument();
		expect(document.querySelector("[data-theme='kdrop']")).toBeInTheDocument();
	});

	it("renders the 404 page for an unknown path", async () => {
		await renderRoute("/missing");
		expect(await screen.findByRole("heading", { name: "Page not found" })).toBeInTheDocument();
		expect(screen.getByText("お探しのページは見つかりませんでした。")).toBeInTheDocument();
	});
});
