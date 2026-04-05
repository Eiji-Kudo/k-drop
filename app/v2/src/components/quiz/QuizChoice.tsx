import { cn } from "@/lib/cn";

export type ChoiceVariant = "idle" | "selected" | "correct" | "incorrect" | "dimmed";

type QuizChoiceProps = {
	index: number;
	label: string;
	variant: ChoiceVariant;
	disabled: boolean;
	onPress: () => void;
};

const variantStyles: Record<ChoiceVariant, string> = {
	idle: "border-white/80 bg-surface-soft text-base-content hover:-translate-y-0.5 hover:bg-white hover:shadow-pop",
	selected: "border-primary/30 bg-surface-strong text-base-content shadow-pop",
	correct: "border-success/18 bg-[linear-gradient(180deg,#f7fff9_0%,#ebfff1_100%)] text-[#0c6f32] shadow-pop",
	incorrect: "border-error/15 bg-[linear-gradient(180deg,#fff7f8_0%,#ffecef_100%)] text-[#b5273a] shadow-soft",
	dimmed: "border-border-soft bg-white/70 text-muted-foreground shadow-soft",
};

const badgeStyles: Record<ChoiceVariant, string> = {
	idle: "border-border-soft bg-white/85 text-base-content",
	selected: "border-primary/20 bg-primary/12 text-primary",
	correct: "border-success/18 bg-success/10 text-[#0c6f32]",
	incorrect: "border-error/15 bg-error/10 text-[#b5273a]",
	dimmed: "border-border-soft bg-white/75 text-muted-foreground",
};

export function QuizChoice({ index, label, variant, disabled, onPress }: QuizChoiceProps) {
	const disabledStyle = disabled && variant === "idle" ? "cursor-not-allowed opacity-50" : "";

	return (
		<button
			type="button"
			className={cn(
				"w-full rounded-panel border px-4 py-4 text-left text-base font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-base-100",
				variantStyles[variant],
				disabledStyle,
			)}
			disabled={disabled}
			onClick={onPress}
		>
			<div className="flex items-start gap-3">
				<span
					className={cn("flex size-9 shrink-0 items-center justify-center rounded-full border text-sm font-black shadow-soft", badgeStyles[variant])}
				>
					{`${index + 1}.`}
				</span>
				<div className="pt-1">
					<p className="text-base font-black leading-6 tracking-[-0.02em]">{label}</p>
				</div>
			</div>
		</button>
	);
}
