import { cn } from "@/lib/cn";

const sharedClassName =
	"inline-flex min-h-12 items-center justify-center rounded-pill px-5 py-3 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-base-100 disabled:cursor-not-allowed disabled:opacity-45";

export const primaryCTAClassName = cn(
	sharedClassName,
	"bg-[linear-gradient(135deg,#ff8fbd,#ffc8de)] text-primary-content shadow-soft hover:-translate-y-0.5 hover:shadow-pop active:translate-y-0",
);

export const secondaryCTAClassName = cn(
	sharedClassName,
	"border border-border-soft bg-white/80 text-base-content shadow-soft hover:bg-white active:bg-surface-strong",
);
