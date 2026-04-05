import { z } from "zod";
import { CHOICE_COUNT, CHOICE_MAX_LENGTH, EXPLANATION_MAX_LENGTH, PROMPT_MAX_LENGTH } from "../-constants";

const choiceSchema = z.string().min(1, "選択肢を入力してください").max(CHOICE_MAX_LENGTH, `選択肢は${CHOICE_MAX_LENGTH}文字以内で入力してください`);

export const quizCreateSchema = z.object({
	idolGroupId: z.string().min(1, "対象グループを選択してください"),
	difficulty: z.enum(["easy", "normal", "hard"], {
		required_error: "難易度を選択してください",
	}),
	prompt: z.string().min(1, "問題文を入力してください").max(PROMPT_MAX_LENGTH, `問題文は${PROMPT_MAX_LENGTH}文字以内で入力してください`),
	choices: z.tuple([choiceSchema, choiceSchema, choiceSchema, choiceSchema]),
	correctChoiceIndex: z.coerce.number().pipe(
		z
			.number()
			.int()
			.min(0, "正解を選択してください")
			.max(CHOICE_COUNT - 1, "正解を選択してください"),
	),
	explanation: z.string().min(1, "解説を入力してください").max(EXPLANATION_MAX_LENGTH, `解説は${EXPLANATION_MAX_LENGTH}文字以内で入力してください`),
});

export type QuizCreateFormValues = z.infer<typeof quizCreateSchema>;
