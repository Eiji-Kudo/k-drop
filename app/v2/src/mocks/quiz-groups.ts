export type QuizGroup = {
	idolGroupId: string;
	groupName: string;
	tagline: string;
	questionCount: number;
	vibeLabel: string;
	rewardHint: string;
};

export const QUIZ_GROUPS: ReadonlyArray<QuizGroup> = [
	{
		idolGroupId: "1",
		groupName: "BLACKPINK",
		tagline: "王道ヒットをテンポよく確認したい日に。",
		questionCount: 5,
		vibeLabel: "定番セット",
		rewardHint: "+120 score からスタート",
	},
	{
		idolGroupId: "2",
		groupName: "BTS",
		tagline: "知識量を試したいときの濃いめラウンド。",
		questionCount: 5,
		vibeLabel: "熱量高め",
		rewardHint: "コンボで一気に伸ばせる",
	},
	{
		idolGroupId: "3",
		groupName: "TWICE",
		tagline: "曲名とメンバーを軽快に取りにいく。",
		questionCount: 5,
		vibeLabel: "ウォームアップ",
		rewardHint: "3分で気持ちよく進める",
	},
	{
		idolGroupId: "4",
		groupName: "aespa",
		tagline: "世界観系の問題で流れを作りたいときに。",
		questionCount: 5,
		vibeLabel: "世界観重視",
		rewardHint: "推し力を積み上げやすい",
	},
	{
		idolGroupId: "5",
		groupName: "Stray Kids",
		tagline: "勢い重視でテンションを上げたい日に。",
		questionCount: 5,
		vibeLabel: "勢い全開",
		rewardHint: "連続正解で加速",
	},
	{
		idolGroupId: "6",
		groupName: "IVE",
		tagline: "知っている曲から気持ちよく入りやすい。",
		questionCount: 5,
		vibeLabel: "入りやすい",
		rewardHint: "初手にちょうどいい",
	},
	{
		idolGroupId: "7",
		groupName: "LE SSERAFIM",
		tagline: "最近の推し活をそのまま試したい人向け。",
		questionCount: 5,
		vibeLabel: "今っぽい",
		rewardHint: "集中が切れにくい短尺",
	},
	{
		idolGroupId: "8",
		groupName: "NewJeans",
		tagline: "耳なじみのある問題でリズムよく進める。",
		questionCount: 5,
		vibeLabel: "軽快",
		rewardHint: "次の挑戦につなげやすい",
	},
];

export function findQuizGroup(groupId: string) {
	return QUIZ_GROUPS.find((group) => group.idolGroupId === groupId);
}
