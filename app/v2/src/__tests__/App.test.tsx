import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "@/App";

describe("App", () => {
	it("renders the starter content", () => {
		render(<App />);
		expect(screen.getByText("K-Drop v2")).toBeInTheDocument();
	});
});
