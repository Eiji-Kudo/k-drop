import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { SectionCard } from "@/components/ui/SectionCard";
import { MOCK_BADGES, MOCK_GROUPS, MOCK_PROGRESS, MOCK_USER } from "./mock-data";
import { ProfileBadges } from "./ProfileBadges";
import { ProfileGroups } from "./ProfileGroups";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileProgress } from "./ProfileProgress";
import { ProfileStats } from "./ProfileStats";

export function ProfilePage() {
	return (
		<PageShell className="gap-4">
			<PageHeader
				eyebrow="PROFILE"
				title="プロフィール"
				description="積み上げの見え方は後続 issue で拡張しやすいよう、まずは面と見出しのルールを揃える。"
			/>
			<ProfileHeader userName={MOCK_USER.userName} nickname={MOCK_USER.nickname} avatarUrl={MOCK_USER.avatarUrl} onSettingsPress={() => {}} />

			<ProfileStats totalOtakuPower={MOCK_USER.totalOtakuPower} fanSince={MOCK_USER.fanSince} layerName={MOCK_USER.layerName} />

			<SectionCard tone="soft" className="px-4 py-4">
				<p className="text-sm leading-7 text-base-content/78">{MOCK_USER.description}</p>
			</SectionCard>

			<ProfileBadges badges={MOCK_BADGES} />

			<ProfileGroups groups={MOCK_GROUPS} />

			<ProfileProgress currentScore={MOCK_PROGRESS.currentScore} percentageIncrease={MOCK_PROGRESS.percentageIncrease} />
		</PageShell>
	);
}
