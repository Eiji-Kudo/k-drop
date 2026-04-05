import { SectionCard } from "@/components/ui/SectionCard";
import type { MockGroup } from "./types";

type ProfileGroupsProps = {
	groups: MockGroup[];
};

export function ProfileGroups({ groups }: ProfileGroupsProps) {
	return (
		<SectionCard className="px-4 py-4">
			<h2 className="mb-3 text-base font-black tracking-[-0.02em] text-base-content">推しグループ</h2>

			{groups.length > 0 ? (
				<div className="grid grid-cols-2 gap-3">
					{groups.map((group) => (
						<div key={group.id} className="flex items-center gap-3 rounded-[1.35rem] border border-border-soft bg-surface-soft p-3">
							<div className="size-[60px] shrink-0 overflow-hidden rounded-full">
								{group.imageUrl ? (
									<img src={group.imageUrl} alt={group.name} loading="lazy" className="size-full object-cover" />
								) : (
									<div className="flex size-full items-center justify-center bg-surface-strong text-sm font-semibold text-base-content">
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
		</SectionCard>
	);
}
