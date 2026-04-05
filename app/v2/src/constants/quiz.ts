export const DIFFICULTY_OPTIONS = [
	{ value: "easy", label: "Easy" },
	{ value: "normal", label: "Normal" },
	{ value: "hard", label: "Hard" },
] as const;

export const MOCK_IDOL_GROUPS = [
	{ idol_group_id: "01J0000000000000000000001", group_name: "TWICE" },
	{ idol_group_id: "01J0000000000000000000002", group_name: "BLACKPINK" },
	{ idol_group_id: "01J0000000000000000000003", group_name: "aespa" },
	{ idol_group_id: "01J0000000000000000000004", group_name: "IVE" },
	{ idol_group_id: "01J0000000000000000000005", group_name: "NewJeans" },
	{ idol_group_id: "01J0000000000000000000006", group_name: "LE SSERAFIM" },
	{ idol_group_id: "01J0000000000000000000007", group_name: "ITZY" },
	{ idol_group_id: "01J0000000000000000000008", group_name: "Stray Kids" },
	{ idol_group_id: "01J0000000000000000000009", group_name: "ENHYPEN" },
	{ idol_group_id: "01J0000000000000000000010", group_name: "BTS" },
] as const;

export const CHOICE_COUNT = 4;
export const PROMPT_MAX_LENGTH = 500;
export const CHOICE_MAX_LENGTH = 100;
export const EXPLANATION_MAX_LENGTH = 1000;
