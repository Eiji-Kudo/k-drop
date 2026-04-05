import { describe, expect, it } from "vitest";
import { formatFanDuration } from "./format-fan-duration";

describe("formatFanDuration", () => {
	const now = new Date("2026-04-05");

	it("returns 'New Fan' when date is undefined", () => {
		expect(formatFanDuration(undefined, now)).toBe("New Fan");
	});

	it("returns 'New Fan' when date is in the future", () => {
		expect(formatFanDuration(new Date("2027-01-01"), now)).toBe("New Fan");
	});

	it("returns 'New Fan' when difference is less than a month", () => {
		expect(formatFanDuration(new Date("2026-03-20"), now)).toBe("New Fan");
	});

	it("returns '1 Month Fan' for exactly one month ago", () => {
		expect(formatFanDuration(new Date("2026-03-01"), now)).toBe("1 Month Fan");
	});

	it("returns plural months when more than one month", () => {
		expect(formatFanDuration(new Date("2025-12-01"), now)).toBe("4 Months Fan");
	});

	it("returns '1 Year Fan' for exactly one year", () => {
		expect(formatFanDuration(new Date("2025-04-01"), now)).toBe("1 Year Fan");
	});

	it("returns plural years when more than one year", () => {
		expect(formatFanDuration(new Date("2022-03-15"), now)).toBe("4 Years Fan");
	});
});
