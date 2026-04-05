type BentoCardVariant = "gradient" | "default";

type BentoCardProps = {
	title: string;
	subtitle?: string;
	icon: React.ReactNode;
	variant?: BentoCardVariant;
};

export function BentoCard({ title, subtitle, icon, variant = "default" }: BentoCardProps) {
	const isGradient = variant === "gradient";

	return (
		<div
			className={[
				"flex h-full flex-col items-center justify-center gap-2 rounded-2xl p-5 transition-transform active:scale-[0.97]",
				isGradient ? "bg-gradient-to-br from-primary to-[#ff6faa] text-white shadow-md" : "border border-base-300 bg-base-100 shadow-sm",
			].join(" ")}
		>
			<div className="text-3xl">{icon}</div>
			<span className={["text-base font-bold", isGradient ? "text-white" : "text-base-content"].join(" ")}>{title}</span>
			{subtitle && <span className={["text-xs", isGradient ? "text-white/80" : "text-base-content/60"].join(" ")}>{subtitle}</span>}
		</div>
	);
}
