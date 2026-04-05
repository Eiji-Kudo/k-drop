import { Settings2, UserRound } from "lucide-react";
import { SectionCard } from "@/components/ui/SectionCard";

type ProfileHeaderProps = {
	userName: string;
	nickname?: string;
	avatarUrl?: string;
	onSettingsPress?: () => void;
};

export function ProfileHeader({ userName, nickname, avatarUrl, onSettingsPress }: ProfileHeaderProps) {
	return (
		<SectionCard tone="hero" className="relative overflow-hidden px-4 py-4">
			<div className="absolute right-0 top-0 size-28 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.42),transparent_72%)] blur-2xl" />
			<div className="relative flex items-center gap-4">
				<div className="size-20 shrink-0 overflow-hidden rounded-full">
					{avatarUrl ? (
						<img src={avatarUrl} alt={userName} className="size-full object-cover" />
					) : (
						<div className="flex size-full items-center justify-center bg-white/50 text-primary shadow-soft">
							<UserRound className="size-10" strokeWidth={2} />
						</div>
					)}
				</div>

				<div className="flex min-w-0 flex-1 flex-col gap-1">
					<h2 className="truncate text-2xl font-black tracking-[-0.04em] text-base-content">{userName}</h2>
					{nickname && <p className="truncate text-sm text-base-content/65">{nickname}</p>}
				</div>

				{onSettingsPress && (
					<button
						type="button"
						onClick={onSettingsPress}
						className="flex size-11 items-center justify-center rounded-full border border-white/70 bg-white/60 text-base-content shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-base-100"
						aria-label="設定"
					>
						<Settings2 className="size-5" strokeWidth={2.1} />
					</button>
				)}
			</div>
		</SectionCard>
	);
}
