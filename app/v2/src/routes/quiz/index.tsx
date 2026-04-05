import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { PrimaryCTA } from "@/components/ui/cta";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { cn } from "@/lib/cn";

type IdolGroup = {
	idolGroupId: string;
	groupName: string;
	thumbnailUrl: string;
};

const MOCK_IDOL_GROUPS: ReadonlyArray<IdolGroup> = [
	{ idolGroupId: "1", groupName: "BLACKPINK", thumbnailUrl: "" },
	{ idolGroupId: "2", groupName: "BTS", thumbnailUrl: "" },
	{ idolGroupId: "3", groupName: "TWICE", thumbnailUrl: "" },
	{ idolGroupId: "4", groupName: "aespa", thumbnailUrl: "" },
	{ idolGroupId: "5", groupName: "Stray Kids", thumbnailUrl: "" },
	{ idolGroupId: "6", groupName: "IVE", thumbnailUrl: "" },
	{ idolGroupId: "7", groupName: "LE SSERAFIM", thumbnailUrl: "" },
	{ idolGroupId: "8", groupName: "NewJeans", thumbnailUrl: "" },
];

function GroupSelectionHeader() {
	return <PageHeader eyebrow="QUIZ START" title="ジャンルを選択" description="今の気分に合うグループを選んで、すぐにクイズへ入れます。" />;
}

function GroupButton({ group, isSelected, onPress }: { group: IdolGroup; isSelected: boolean; onPress: (groupId: string) => void }) {
	return (
		<button
			type="button"
			onClick={() => onPress(group.idolGroupId)}
			aria-label={group.groupName}
			className={cn(
				"flex w-full items-center justify-between rounded-panel border px-4 py-4 text-left shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-base-100",
				isSelected
					? "border-primary/25 bg-surface-strong text-base-content shadow-pop"
					: "border-border-soft bg-surface text-base-content hover:bg-white",
			)}
			aria-pressed={isSelected}
		>
			<div className="space-y-1">
				<p className="text-base font-black tracking-[-0.03em]">{group.groupName}</p>
				<p className="text-xs text-muted-foreground">このグループの問題セットに挑戦する</p>
			</div>
			{isSelected ? (
				<CheckCircle2 className="size-5 shrink-0 text-primary" strokeWidth={2.2} />
			) : (
				<ArrowRight className="size-4 shrink-0 text-muted-foreground" />
			)}
		</button>
	);
}

function GroupSelectionPage() {
	const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
	const navigate = useNavigate();

	const handleContinue = () => {
		if (!selectedGroupId) return;
		const sessionId = crypto.randomUUID();
		navigate({ to: "/quiz/$sessionId", params: { sessionId }, search: { groupId: selectedGroupId } });
	};

	return (
		<PageShell className="gap-6">
			<GroupSelectionHeader />

			<div className="flex flex-col gap-3">
				{MOCK_IDOL_GROUPS.map((group) => (
					<GroupButton key={group.idolGroupId} group={group} isSelected={selectedGroupId === group.idolGroupId} onPress={setSelectedGroupId} />
				))}
			</div>

			<div className="pt-2">
				<PrimaryCTA className="w-full" disabled={!selectedGroupId} onClick={handleContinue}>
					問題へ進む
				</PrimaryCTA>
			</div>
		</PageShell>
	);
}

export const Route = createFileRoute("/quiz/")({
	component: GroupSelectionPage,
});
