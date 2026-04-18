import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import type { FileRoutesByTo } from "@/routeTree.gen";

type BentoCardVariant = "gradient" | "default";

type BentoCardProps = {
	to: keyof FileRoutesByTo;
	title: string;
	subtitle?: string;
	icon: LucideIcon;
	variant?: BentoCardVariant;
	className?: string;
};

export function BentoCard({ to, title, subtitle, icon: Icon, variant = "default", className }: BentoCardProps) {
	const isGradient = variant === "gradient";

	return (
		<Link
			to={to}
			className={cn(
				"group flex h-full min-h-36 flex-col justify-between rounded-panel border px-4 py-4 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-pop focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-base-100",
				isGradient
					? "border-white/75 bg-[linear-gradient(145deg,#ff99c7_0%,#ffd7e9_100%)] text-primary-content"
					: "border-border-soft bg-surface text-base-content hover:bg-white/90",
				className,
			)}
		>
			<div className="flex items-start justify-between gap-3">
				<div
					className={cn(
						"flex size-12 items-center justify-center rounded-[1.15rem] border",
						isGradient ? "border-white/50 bg-white/18 text-white" : "border-primary/10 bg-surface-strong text-primary",
					)}
				>
					<Icon className="size-5" strokeWidth={2.2} />
				</div>
				<ChevronRight
					className={cn("mt-1 size-4 transition duration-200 group-hover:translate-x-0.5", isGradient ? "text-white/85" : "text-muted-foreground")}
				/>
			</div>
			<div className="space-y-1">
				<p className={cn("text-lg font-black tracking-[-0.03em]", isGradient ? "text-primary-content" : "text-base-content")}>{title}</p>
				{subtitle && <p className={cn("text-sm leading-5", isGradient ? "text-primary-content/78" : "text-muted-foreground")}>{subtitle}</p>}
			</div>
		</Link>
	);
}
