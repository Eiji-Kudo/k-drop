type ProfileHeaderProps = {
	userName: string;
	nickname?: string;
	avatarUrl?: string;
	onSettingsPress?: () => void;
};

export function ProfileHeader({ userName, nickname, avatarUrl, onSettingsPress }: ProfileHeaderProps) {
	return (
		<div className="flex items-center gap-4 px-4 py-4">
			<div className="size-20 shrink-0 overflow-hidden rounded-full">
				{avatarUrl ? (
					<img src={avatarUrl} alt={userName} className="size-full object-cover" />
				) : (
					<div className="flex size-full items-center justify-center bg-secondary">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="size-10 text-secondary-content/60"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							/>
						</svg>
					</div>
				)}
			</div>

			<div className="flex min-w-0 flex-1 flex-col gap-1">
				<h1 className="truncate text-xl font-bold">{userName}</h1>
				{nickname && <p className="truncate text-sm text-base-content/60">{nickname}</p>}
			</div>

			{onSettingsPress && (
				<button type="button" onClick={onSettingsPress} className="btn btn-ghost btn-sm btn-circle" aria-label="設定">
					<svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
						/>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
					</svg>
				</button>
			)}
		</div>
	);
}
