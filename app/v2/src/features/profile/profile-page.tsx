import { ProfileBadges } from "./components/ProfileBadges";
import { ProfileGroups } from "./components/ProfileGroups";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileProgress } from "./components/ProfileProgress";
import { ProfileStats } from "./components/ProfileStats";
import { MOCK_BADGES, MOCK_GROUPS, MOCK_PROGRESS, MOCK_USER } from "./mock-data";

export function ProfilePage() {
	return (
		<main className="grid flex-1 content-start gap-2 pb-8">
			<ProfileHeader userName={MOCK_USER.userName} nickname={MOCK_USER.nickname} avatarUrl={MOCK_USER.avatarUrl} onSettingsPress={() => {}} />

			<ProfileStats totalOtakuPower={MOCK_USER.totalOtakuPower} fanSince={MOCK_USER.fanSince} layerName={MOCK_USER.layerName} />

			<p className="px-4 py-2 text-sm leading-relaxed text-base-content/80">{MOCK_USER.description}</p>

			<ProfileBadges badges={MOCK_BADGES} />

			<ProfileGroups groups={MOCK_GROUPS} />

			<ProfileProgress currentScore={MOCK_PROGRESS.currentScore} percentageIncrease={MOCK_PROGRESS.percentageIncrease} />
		</main>
	);
}
