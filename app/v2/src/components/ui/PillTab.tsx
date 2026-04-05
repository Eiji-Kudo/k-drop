import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type PillTabProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	active?: boolean;
};

export function PillTab({ active = false, className, type = "button", ...props }: PillTabProps) {
	return (
		<button
			type={type}
			className={cn(
				"inline-flex min-h-11 shrink-0 items-center justify-center rounded-pill px-4 py-2 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-base-100",
				active
					? "bg-[linear-gradient(135deg,#ff8fbd,#ffcadd)] text-primary-content shadow-soft"
					: "border border-border-soft bg-white/72 text-muted-foreground hover:bg-white hover:text-base-content",
				className,
			)}
			aria-pressed={active}
			{...props}
		/>
	);
}
