import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionCardTone = "default" | "soft" | "hero";

type SectionCardProps<T extends ElementType> = {
	as?: T;
	tone?: SectionCardTone;
	children: ReactNode;
	className?: string;
};

type PolymorphicProps<T extends ElementType> = SectionCardProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof SectionCardProps<T>>;

const toneClassName: Record<SectionCardTone, string> = {
	default: "border-border-soft bg-surface text-base-content shadow-soft",
	soft: "border-white/80 bg-surface-soft text-base-content shadow-soft",
	hero: "border-white/80 bg-[linear-gradient(145deg,var(--color-hero-start),var(--color-hero-end))] text-base-content shadow-pop",
};

export function SectionCard<T extends ElementType = "section">({ as, tone = "default", className, children, ...props }: PolymorphicProps<T>) {
	const Component = as ?? "section";

	return (
		<Component className={cn("rounded-panel border px-4 py-4", toneClassName[tone], className)} {...props}>
			{children}
		</Component>
	);
}
