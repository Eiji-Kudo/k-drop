import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { CHOICE_MAX_LENGTH } from "../-constants";
import type { QuizCreateFormValues } from "../-schemas/quiz-create-schema";

const CHOICE_INDICES = [0, 1, 2, 3] as const;

type ChoicesFieldsetProps = {
	register: UseFormRegister<QuizCreateFormValues>;
	errors: FieldErrors<QuizCreateFormValues>["choices"];
};

export function ChoicesFieldset({ register, errors }: ChoicesFieldsetProps) {
	return (
		<fieldset className="fieldset">
			<legend className="label font-semibold">選択肢</legend>
			<div className="flex flex-col gap-3">
				{CHOICE_INDICES.map((index) => (
					<div key={index}>
						<label className="label text-sm" htmlFor={`choices.${index}`}>
							選択肢 {index + 1}
						</label>
						<input
							id={`choices.${index}`}
							type="text"
							className={`input input-bordered w-full ${errors?.[index] ? "input-error" : ""}`}
							maxLength={CHOICE_MAX_LENGTH}
							placeholder={`選択肢 ${index + 1} を入力`}
							{...register(`choices.${index}`)}
						/>
						{errors?.[index] && <p className="label text-error text-sm">{errors[index].message}</p>}
					</div>
				))}
			</div>
		</fieldset>
	);
}

type CorrectChoiceFieldsetProps = {
	register: UseFormRegister<QuizCreateFormValues>;
	error: string | undefined;
};

export function CorrectChoiceFieldset({ register, error }: CorrectChoiceFieldsetProps) {
	return (
		<fieldset className="fieldset">
			<legend className="label font-semibold">正解</legend>
			<div className="flex flex-col gap-2">
				{CHOICE_INDICES.map((index) => (
					<label key={index} className="label cursor-pointer justify-start gap-3">
						<input type="radio" className="radio radio-primary" value={index} {...register("correctChoiceIndex")} />
						<span>選択肢 {index + 1}</span>
					</label>
				))}
			</div>
			{error && <p className="label text-error text-sm">{error}</p>}
		</fieldset>
	);
}
