export type ChoiceVariant = "unanswered" | "correct" | "incorrect";

type QuizChoiceProps = {
	index: number;
	label: string;
	variant: ChoiceVariant;
	disabled: boolean;
	onPress: () => void;
};

const variantStyles: Record<ChoiceVariant, string> = {
	unanswered: "border-base-300 bg-white",
	correct: "bg-secondary border-primary",
	incorrect: "bg-error border-error text-white",
};

export function QuizChoice({ index, label, variant, disabled, onPress }: QuizChoiceProps) {
	const disabledStyle = disabled && variant === "unanswered" ? "opacity-50 cursor-not-allowed" : "";

	return (
		<button
			type="button"
			className={`w-full rounded-lg border px-4 py-3 text-left text-base font-medium ${variantStyles[variant]} ${disabledStyle}`}
			disabled={disabled}
			onClick={onPress}
		>
			{`${index + 1}. ${label}`}
		</button>
	);
}
