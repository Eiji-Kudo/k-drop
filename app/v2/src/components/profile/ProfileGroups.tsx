import type { MockGroup } from "./mock-data";

type ProfileGroupsProps = {
	groups: MockGroup[];
};

export function ProfileGroups({ groups }: ProfileGroupsProps) {
	return (
		<section className="px-4 py-3">
			<h2 className="mb-3 text-base font-semibold">My Groups</h2>

			{groups.length > 0 ? (
				<div className="grid grid-cols-2 gap-3">
					{groups.map((group) => (
						<div key={group.id} className="flex items-center gap-3 rounded-box bg-base-200 p-3">
							<div className="size-[60px] shrink-0 overflow-hidden rounded-full">
								{group.imageUrl ? (
									<img src={group.imageUrl} alt={group.name} className="size-full object-cover" />
								) : (
									<div className="flex size-full items-center justify-center bg-secondary text-sm font-semibold text-secondary-content">
										{group.name.substring(0, 2)}
									</div>
								)}
							</div>
							<span className="min-w-0 truncate text-sm font-medium">{group.name}</span>
						</div>
					))}
				</div>
			) : (
				<p className="py-4 text-center text-sm text-base-content/60">クイズに回答して推しグループを追加しよう！</p>
			)}
		</section>
	);
}
