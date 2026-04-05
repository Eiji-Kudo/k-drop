import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type PageShellProps = ComponentPropsWithoutRef<"main">;

export function PageShell({ className, ...props }: PageShellProps) {
	return <main className={cn("flex flex-1 flex-col gap-5 pb-8", className)} {...props} />;
}
