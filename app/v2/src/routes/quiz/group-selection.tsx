import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

type IdolGroup = {
	id: string;
	name: string;
	thumbnailUrl: string;
};

const MOCK_IDOL_GROUPS: ReadonlyArray<IdolGroup> = [
	{ id: "1", name: "BLACKPINK", thumbnailUrl: "" },
	{ id: "2", name: "BTS", thumbnailUrl: "" },
	{ id: "3", name: "TWICE", thumbnailUrl: "" },
	{ id: "4", name: "aespa", thumbnailUrl: "" },
	{ id: "5", name: "Stray Kids", thumbnailUrl: "" },
	{ id: "6", name: "IVE", thumbnailUrl: "" },
	{ id: "7", name: "LE SSERAFIM", thumbnailUrl: "" },
	{ id: "8", name: "NewJeans", thumbnailUrl: "" },
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
			onClick={() => onPress(group.id)}
			className={`btn w-full bg-secondary py-4 text-base font-medium text-secondary-content ${isSelected ? "ring-2 ring-primary" : ""}`}
		>
			{group.name}
		</button>
	);
}

function GroupSelectionPage() {
	const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
	const navigate = useNavigate();

	const handleContinue = () => {
		if (!selectedGroupId) return;
		const sessionId = crypto.randomUUID();
		navigate({ to: "/quiz/$sessionId", params: { sessionId } });
	};

	return (
		<main className="grid flex-1 content-start gap-6">
			<GroupSelectionHeader />

			<div className="flex flex-col gap-3">
				{MOCK_IDOL_GROUPS.map((group) => (
					<GroupButton key={group.id} group={group} isSelected={selectedGroupId === group.id} onPress={setSelectedGroupId} />
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

export const Route = createFileRoute("/quiz/group-selection")({
	component: GroupSelectionPage,
});
