import { Flame, Sparkles, Star } from "lucide-react";
import { SectionCard } from "@/components/ui/SectionCard";

type WelcomeHeaderProps = {
	levelName: string;
	levelStars: number;
};

export function WelcomeHeader({ levelName, levelStars }: WelcomeHeaderProps) {
	const clampedStars = Math.min(5, Math.max(0, Math.floor(levelStars)));
	const starLabel = `${"★".repeat(clampedStars)}${"☆".repeat(5 - clampedStars)}`;

	return (
		<SectionCard tone="hero" className="relative overflow-hidden px-5 py-5">
			<div className="absolute right-5 top-4 hidden size-24 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.48),transparent_70%)] blur-xl sm:block" />
			<div className="relative flex flex-col gap-4">
				<div className="flex items-start justify-between gap-3">
					<div className="space-y-2">
						<span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/65 bg-white/50 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.18em] text-primary shadow-soft">
							<Sparkles className="size-3.5" strokeWidth={2.2} />
							TODAY&apos;S DROP
						</span>
						<div className="space-y-1">
							<h2 className="text-[1.9rem] font-black leading-none tracking-[-0.05em] text-base-content">オタ力バトルしよう！</h2>
							<p className="text-sm leading-6 text-base-content/70">今日の 1 プレイで、推し知識のメーターをもう少し前へ。</p>
						</div>
					</div>
					<div className="flex size-12 shrink-0 items-center justify-center rounded-[1.15rem] border border-white/55 bg-white/35 text-primary shadow-soft">
						<Flame className="size-5" strokeWidth={2.2} />
					</div>
				</div>

				<div className="flex items-center justify-between gap-4 rounded-[1.35rem] border border-white/55 bg-white/52 px-4 py-3 shadow-soft">
					<div className="space-y-1">
						<p className="text-xs font-semibold tracking-[0.16em] text-base-content/52">CURRENT TIER</p>
						<p className="text-base font-black tracking-[-0.03em] text-base-content">{levelName}</p>
					</div>
					<div className="flex items-center gap-1 text-warning">
						<span className="sr-only">{starLabel}</span>
						{Array.from({ length: 5 }, (_, index) => (
							<Star key={index} className={index < clampedStars ? "size-4 fill-current" : "size-4 text-base-content/20"} strokeWidth={2.1} />
						))}
					</div>
				</div>
			</div>
		</SectionCard>
	);
}
