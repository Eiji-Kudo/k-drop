import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type PageHeaderProps = {
	title: string;
	description?: string;
	eyebrow?: string;
	align?: "left" | "center";
	action?: ReactNode;
	className?: string;
};

export function PageHeader({ title, description, eyebrow, align = "left", action, className }: PageHeaderProps) {
	const isCentered = align === "center";
	const hasAction = Boolean(action);

	return (
		<header className={cn("flex flex-col gap-3", isCentered && "items-center text-center", className)}>
			<div className={cn("flex flex-col gap-2", hasAction && "w-full sm:flex-row sm:items-start sm:justify-between", isCentered && "items-center")}>
				<div className={cn("flex flex-col gap-2", isCentered && "items-center")}>
					{eyebrow && (
						<span className="inline-flex w-fit items-center rounded-full border border-primary/15 bg-white/70 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.2em] text-primary shadow-soft">
							{eyebrow}
						</span>
					)}
					<div className="space-y-1">
						<h1 className="text-[clamp(1.9rem,5vw,2.45rem)] font-black leading-none tracking-[-0.04em] text-base-content">{title}</h1>
						{description && <p className="max-w-[32rem] text-sm leading-6 text-muted-foreground">{description}</p>}
					</div>
				</div>
				{action}
			</div>
		</header>
	);
}
