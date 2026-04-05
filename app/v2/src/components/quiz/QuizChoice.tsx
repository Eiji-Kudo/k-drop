import { cn } from "@/lib/cn";

export type ChoiceVariant = "unanswered" | "correct" | "incorrect";

type QuizChoiceProps = {
	index: number;
	label: string;
	variant: ChoiceVariant;
	disabled: boolean;
	onPress: () => void;
};

const variantStyles: Record<ChoiceVariant, string> = {
	unanswered: "border-border-soft bg-surface text-base-content hover:bg-white",
	correct: "border-success/20 bg-[#effcf3] text-[#0b6b2f]",
	incorrect: "border-error/15 bg-[#fff0f1] text-[#b5273a]",
};

export function QuizChoice({ index, label, variant, disabled, onPress }: QuizChoiceProps) {
	const disabledStyle = disabled && variant === "unanswered" ? "cursor-not-allowed opacity-50" : "";

	return (
		<button
			type="button"
			className={cn(
				"w-full rounded-panel border px-4 py-4 text-left text-base font-semibold shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-base-100",
				variantStyles[variant],
				disabledStyle,
			)}
			disabled={disabled}
			onClick={onPress}
		>
			{`${index + 1}. ${label}`}
		</button>
	);
}
