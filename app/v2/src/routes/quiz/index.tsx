import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, PlayCircle, Sparkles, Star } from "lucide-react";
import { useState } from "react";
import { PrimaryCTA } from "@/components/ui/cta";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { SectionCard } from "@/components/ui/SectionCard";
import { cn } from "@/lib/cn";
import { QUIZ_GROUPS, type QuizGroup } from "@/mocks/quiz-groups";

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
				"flex w-full flex-col gap-4 rounded-panel border px-4 py-4 text-left shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-base-100",
				isSelected
					? "border-primary/30 bg-surface-strong text-base-content shadow-pop"
					: "border-white/80 bg-surface-soft text-base-content hover:-translate-y-0.5 hover:bg-white hover:shadow-pop",
			)}
			aria-pressed={isSelected}
		>
			<div className="flex items-start justify-between gap-3">
				<div className="space-y-2">
					<div className="flex flex-wrap items-center gap-2">
						<span className="inline-flex items-center rounded-pill border border-white/80 bg-white/75 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.18em] text-primary shadow-soft">
							{group.vibeLabel}
						</span>
						{isSelected && (
							<span className="inline-flex items-center gap-1 rounded-pill border border-primary/15 bg-primary/10 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.18em] text-primary">
								<CheckCircle2 className="size-3.5" strokeWidth={2.2} />
								選択中
							</span>
						)}
					</div>
					<div className="space-y-1">
						<p className="text-lg font-black tracking-[-0.03em]">{group.groupName}</p>
						<p className="text-sm leading-6 text-muted-foreground">{group.tagline}</p>
					</div>
				</div>
				<div
					className={cn(
						"mt-1 flex size-11 shrink-0 items-center justify-center rounded-full border shadow-soft",
						isSelected ? "border-primary/25 bg-primary/12 text-primary" : "border-white/80 bg-white/80 text-muted-foreground",
					)}
				>
					{isSelected ? <CheckCircle2 className="size-5" strokeWidth={2.2} /> : <ArrowRight className="size-4.5" strokeWidth={2.2} />}
				</div>
			</div>
			<div className="flex flex-wrap gap-2">
				<span className="inline-flex items-center rounded-pill border border-border-soft bg-white/80 px-3 py-1 text-xs font-semibold text-base-content shadow-soft">
					{group.questionCount}問
				</span>
				<span className="inline-flex items-center rounded-pill border border-border-soft bg-white/80 px-3 py-1 text-xs font-semibold text-base-content shadow-soft">
					{group.rewardHint}
				</span>
			</div>
		</button>
	);
}

function GroupSelectionPage() {
	const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
	const navigate = useNavigate();
	const selectedGroup = QUIZ_GROUPS.find((group) => group.idolGroupId === selectedGroupId) ?? null;

	const handleContinue = () => {
		if (!selectedGroupId) return;
		const sessionId = crypto.randomUUID();
		navigate({ to: "/quiz/$sessionId", params: { sessionId }, search: { groupId: selectedGroupId } });
	};

	return (
		<PageShell className="gap-5">
			<GroupSelectionHeader />

			<SectionCard tone="hero" className="px-5 py-5">
				<div className="flex items-start justify-between gap-3">
					<div className="space-y-2">
						<span className="inline-flex items-center gap-2 rounded-pill border border-white/80 bg-white/75 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.18em] text-primary shadow-soft">
							<Sparkles className="size-3.5" strokeWidth={2.2} />
							QUICK START
						</span>
						<div className="space-y-1">
							<p className="text-xl font-black tracking-[-0.04em] text-base-content">まずは気分に合うセットをひとつ。</p>
							<p className="text-sm leading-6 text-muted-foreground">選ぶだけで開始条件がはっきりして、次の導線が迷いません。</p>
						</div>
					</div>
					<div className="rounded-[1.4rem] border border-white/80 bg-white/75 px-4 py-3 text-right shadow-soft">
						<p className="text-[0.68rem] font-semibold tracking-[0.18em] text-primary">AVAILABLE</p>
						<p className="mt-1 text-2xl font-black tracking-[-0.04em] text-base-content">{QUIZ_GROUPS.length}</p>
						<p className="text-xs text-muted-foreground">グループ</p>
					</div>
				</div>
			</SectionCard>

			<div className="grid gap-3 sm:grid-cols-2">
				{QUIZ_GROUPS.map((group) => (
					<GroupButton key={group.idolGroupId} group={group} isSelected={selectedGroupId === group.idolGroupId} onPress={setSelectedGroupId} />
				))}
			</div>

			<SectionCard tone="soft" className="px-5 py-5">
				<div className="space-y-4">
					<div className="flex items-start gap-3">
						<div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-primary/15 bg-primary/12 text-primary shadow-soft">
							<PlayCircle className="size-5" strokeWidth={2.2} />
						</div>
						<div className="space-y-1">
							<p className="text-base font-black tracking-[-0.03em] text-base-content">
								{selectedGroup ? `${selectedGroup.groupName} セットで挑戦する` : "まずはグループを選ぶ"}
							</p>
							<p className="text-sm leading-6 text-muted-foreground">
								{selectedGroup
									? `${selectedGroup.questionCount}問でテンポよく進めます。${selectedGroup.rewardHint}`
									: "選択すると開始ボタンが有効になり、どのセットで始めるかが明確になります。"}
							</p>
						</div>
					</div>
					{selectedGroup && (
						<div className="flex flex-wrap gap-2">
							<span className="inline-flex items-center gap-2 rounded-pill border border-white/80 bg-white/80 px-3 py-1 text-xs font-semibold text-base-content shadow-soft">
								<Star className="size-3.5 text-primary" strokeWidth={2.2} />
								{selectedGroup.vibeLabel}
							</span>
							<span className="inline-flex items-center rounded-pill border border-white/80 bg-white/80 px-3 py-1 text-xs font-semibold text-base-content shadow-soft">
								{selectedGroup.rewardHint}
							</span>
						</div>
					)}
					<PrimaryCTA className="w-full" disabled={!selectedGroupId} onClick={handleContinue}>
						{selectedGroup ? `${selectedGroup.groupName}でスタート` : "まずはグループを選ぶ"}
					</PrimaryCTA>
				</div>
			</SectionCard>
		</PageShell>
	);
}

export const Route = createFileRoute("/quiz/")({
	component: GroupSelectionPage,
});
