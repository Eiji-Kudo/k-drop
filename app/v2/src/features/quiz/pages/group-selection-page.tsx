import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { PrimaryCTA } from "@/components/ui/cta";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { cn } from "@/lib/cn";
import { MOCK_QUIZ_GROUPS } from "../mock/idol-groups";
import type { QuizGroup } from "../types";

function GroupSelectionHeader() {
	return <PageHeader eyebrow="QUIZ START" title="ジャンルを選択" description="今の気分に合うグループを選んで、すぐにクイズへ入れます。" />;
}

function GroupButton({ group, isSelected, onPress }: { group: QuizGroup; isSelected: boolean; onPress: (groupId: string) => void }) {
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

export function GroupSelectionPage() {
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
				{MOCK_QUIZ_GROUPS.map((group) => (
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
