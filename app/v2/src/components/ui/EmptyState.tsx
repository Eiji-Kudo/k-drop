import type { ReactNode } from "react";
import { SectionCard } from "@/components/ui/SectionCard";

type EmptyStateProps = {
	title: string;
	description: string;
	action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
	return (
		<SectionCard className="flex flex-col items-center gap-4 px-6 py-8 text-center">
			<div className="space-y-2">
				<h2 className="text-xl font-black tracking-[-0.03em] text-base-content">{title}</h2>
				<p className="text-sm leading-6 text-muted-foreground">{description}</p>
			</div>
			{action}
		</SectionCard>
	);
}
