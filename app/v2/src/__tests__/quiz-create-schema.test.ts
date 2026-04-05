import { describe, expect, it } from "vitest";
import { CHOICE_MAX_LENGTH, EXPLANATION_MAX_LENGTH, PROMPT_MAX_LENGTH } from "@/features/quiz/constants";
import { quizCreateSchema } from "@/features/quiz/schemas/quiz-create-schema";

const validInput = {
	idolGroupId: "01J0000000000000000000001",
	difficulty: "easy",
	prompt: "TWICEのデビュー曲は？",
	choices: ["Like Ooh-Ahh", "TT", "Cheer Up", "What is Love?"],
	correctChoiceIndex: 0,
	explanation: "TWICEは2015年に「Like Ooh-Ahh」でデビューしました。",
};

describe("quizCreateSchema", () => {
	it("accepts valid input", () => {
		const result = quizCreateSchema.safeParse(validInput);
		expect(result.success).toBe(true);
	});

	it("accepts string correctChoiceIndex via coerce", () => {
		const result = quizCreateSchema.safeParse({ ...validInput, correctChoiceIndex: "2" });
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.correctChoiceIndex).toBe(2);
		}
	});

	it("rejects empty idolGroupId", () => {
		const result = quizCreateSchema.safeParse({ ...validInput, idolGroupId: "" });
		expect(result.success).toBe(false);
	});

	it("rejects invalid difficulty", () => {
		const result = quizCreateSchema.safeParse({ ...validInput, difficulty: "extreme" });
		expect(result.success).toBe(false);
	});

	it("rejects missing difficulty", () => {
		const result = quizCreateSchema.safeParse({ ...validInput, difficulty: undefined });
		expect(result.success).toBe(false);
	});

	it("rejects empty prompt", () => {
		const result = quizCreateSchema.safeParse({ ...validInput, prompt: "" });
		expect(result.success).toBe(false);
	});

	it("rejects prompt exceeding max length", () => {
		const result = quizCreateSchema.safeParse({ ...validInput, prompt: "あ".repeat(PROMPT_MAX_LENGTH + 1) });
		expect(result.success).toBe(false);
	});

	it("rejects empty choice", () => {
		const result = quizCreateSchema.safeParse({ ...validInput, choices: ["A", "", "C", "D"] });
		expect(result.success).toBe(false);
	});

	it("rejects choice exceeding max length", () => {
		const result = quizCreateSchema.safeParse({ ...validInput, choices: ["あ".repeat(CHOICE_MAX_LENGTH + 1), "B", "C", "D"] });
		expect(result.success).toBe(false);
	});

	it("rejects fewer than 4 choices", () => {
		const result = quizCreateSchema.safeParse({ ...validInput, choices: ["A", "B", "C"] });
		expect(result.success).toBe(false);
	});

	it("rejects NaN correctChoiceIndex", () => {
		const result = quizCreateSchema.safeParse({ ...validInput, correctChoiceIndex: "abc" });
		expect(result.success).toBe(false);
	});

	it("rejects negative correctChoiceIndex", () => {
		const result = quizCreateSchema.safeParse({ ...validInput, correctChoiceIndex: -1 });
		expect(result.success).toBe(false);
	});

	it("rejects correctChoiceIndex out of range", () => {
		const result = quizCreateSchema.safeParse({ ...validInput, correctChoiceIndex: 4 });
		expect(result.success).toBe(false);
	});

	it("rejects non-integer correctChoiceIndex", () => {
		const result = quizCreateSchema.safeParse({ ...validInput, correctChoiceIndex: 1.5 });
		expect(result.success).toBe(false);
	});

	it("rejects empty explanation", () => {
		const result = quizCreateSchema.safeParse({ ...validInput, explanation: "" });
		expect(result.success).toBe(false);
	});

	it("rejects explanation exceeding max length", () => {
		const result = quizCreateSchema.safeParse({ ...validInput, explanation: "あ".repeat(EXPLANATION_MAX_LENGTH + 1) });
		expect(result.success).toBe(false);
	});

	it("accepts all difficulty values", () => {
		for (const d of ["easy", "normal", "hard"]) {
			const result = quizCreateSchema.safeParse({ ...validInput, difficulty: d });
			expect(result.success).toBe(true);
		}
	});

	it("accepts max boundary correctChoiceIndex", () => {
		const result = quizCreateSchema.safeParse({ ...validInput, correctChoiceIndex: 3 });
		expect(result.success).toBe(true);
	});
});
