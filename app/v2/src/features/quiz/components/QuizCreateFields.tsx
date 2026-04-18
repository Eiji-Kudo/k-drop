import type { UseFormRegister } from "react-hook-form";
import { DIFFICULTY_OPTIONS, EXPLANATION_MAX_LENGTH, PROMPT_MAX_LENGTH } from "../constants";
import { MOCK_QUIZ_GROUPS } from "../mock/idol-groups";
import type { QuizCreateFormValues } from "../schemas/quiz-create-schema";

type FieldProps = {
	register: UseFormRegister<QuizCreateFormValues>;
	error: string | undefined;
};

export function GroupSelect({ register, error }: FieldProps) {
	return (
		<fieldset className="fieldset">
			<label className="label font-semibold" htmlFor="idolGroupId">
				対象グループ
			</label>
			<select id="idolGroupId" className={`select select-bordered w-full ${error ? "select-error" : ""}`} {...register("idolGroupId")}>
				<option value="">グループを選択してください</option>
				{MOCK_QUIZ_GROUPS.map((group) => (
					<option key={group.idolGroupId} value={group.idolGroupId}>
						{group.groupName}
					</option>
				))}
			</select>
			{error && <p className="label text-error text-sm">{error}</p>}
		</fieldset>
	);
}

export function DifficultySelect({ register, error }: FieldProps) {
	return (
		<fieldset className="fieldset">
			<label className="label font-semibold" htmlFor="difficulty">
				難易度
			</label>
			<select id="difficulty" className={`select select-bordered w-full ${error ? "select-error" : ""}`} {...register("difficulty")}>
				<option value="">難易度を選択してください</option>
				{DIFFICULTY_OPTIONS.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
			{error && <p className="label text-error text-sm">{error}</p>}
		</fieldset>
	);
}

export function PromptField({ register, error }: FieldProps) {
	return (
		<fieldset className="fieldset">
			<label className="label font-semibold" htmlFor="prompt">
				問題文
			</label>
			<textarea
				id="prompt"
				className={`textarea textarea-bordered w-full ${error ? "textarea-error" : ""}`}
				rows={3}
				maxLength={PROMPT_MAX_LENGTH}
				placeholder="問題文を入力してください"
				{...register("prompt")}
			/>
			{error && <p className="label text-error text-sm">{error}</p>}
		</fieldset>
	);
}

export function ExplanationField({ register, error }: FieldProps) {
	return (
		<fieldset className="fieldset">
			<label className="label font-semibold" htmlFor="explanation">
				解説
			</label>
			<textarea
				id="explanation"
				className={`textarea textarea-bordered w-full ${error ? "textarea-error" : ""}`}
				rows={4}
				maxLength={EXPLANATION_MAX_LENGTH}
				placeholder="解説を入力してください"
				{...register("explanation")}
			/>
			{error && <p className="label text-error text-sm">{error}</p>}
		</fieldset>
	);
}
