import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ChoicesFieldset, CorrectChoiceFieldset } from "@/components/quiz/quiz-choice-fields";
import { DifficultySelect, ExplanationField, GroupSelect, PromptField } from "@/components/quiz/quiz-create-fields";
import { type QuizCreateFormValues, quizCreateSchema } from "@/lib/schemas/quiz-create-schema";

type QuizCreateFormProps = {
	onSubmitSuccess: (data: QuizCreateFormValues) => void;
};

export function QuizCreateForm({ onSubmitSuccess }: QuizCreateFormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<QuizCreateFormValues>({
		resolver: zodResolver(quizCreateSchema),
		defaultValues: {
			idolGroupId: "",
			difficulty: undefined,
			prompt: "",
			choices: ["", "", "", ""],
			correctChoiceIndex: undefined,
			explanation: "",
		},
	});

	return (
		<form onSubmit={handleSubmit(onSubmitSuccess)} className="flex flex-col gap-5">
			<GroupSelect register={register} error={errors.idolGroupId?.message} />
			<DifficultySelect register={register} error={errors.difficulty?.message} />
			<PromptField register={register} error={errors.prompt?.message} />
			<ChoicesFieldset register={register} errors={errors.choices} />
			<CorrectChoiceFieldset register={register} error={errors.correctChoiceIndex?.message} />
			<ExplanationField register={register} error={errors.explanation?.message} />

			<button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
				{isSubmitting ? "作成中..." : "作成する"}
			</button>
		</form>
	);
}
