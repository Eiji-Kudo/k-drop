import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

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
	return (
		<div className="flex flex-col items-center gap-2">
			<h1 className="text-3xl font-bold tracking-tight">ジャンルを選択</h1>
			<p className="text-base text-base-content/80">挑戦したいジャンルを選んでください</p>
		</div>
	);
}

function GroupButton({ group, isSelected, onPress }: { group: IdolGroup; isSelected: boolean; onPress: (groupId: string) => void }) {
	return (
		<button
			type="button"
			onClick={() => onPress(group.idolGroupId)}
			className={`btn w-full bg-secondary py-4 text-base font-medium text-secondary-content ${isSelected ? "ring-2 ring-primary" : ""}`}
		>
			{group.groupName}
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
		<main className="grid flex-1 content-start gap-6">
			<GroupSelectionHeader />

			<div className="flex flex-col gap-3">
				{MOCK_IDOL_GROUPS.map((group) => (
					<GroupButton key={group.idolGroupId} group={group} isSelected={selectedGroupId === group.idolGroupId} onPress={setSelectedGroupId} />
				))}
			</div>

			<div className="pt-4">
				<button type="button" className="btn btn-primary w-full" disabled={!selectedGroupId} onClick={handleContinue}>
					問題へ進む
				</button>
			</div>
		</main>
	);
}

export const Route = createFileRoute("/quiz/")({
	component: GroupSelectionPage,
});
