import type { ButtonHTMLAttributes } from "react";
import { primaryCTAClassName, secondaryCTAClassName } from "@/components/ui/cta-class-names";
import { cn } from "@/lib/cn";

type CTAProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function PrimaryCTA({ className, type = "button", ...props }: CTAProps) {
	return <button type={type} className={cn(primaryCTAClassName, className)} {...props} />;
}

export function SecondaryCTA({ className, type = "button", ...props }: CTAProps) {
	return <button type={type} className={cn(secondaryCTAClassName, className)} {...props} />;
}
