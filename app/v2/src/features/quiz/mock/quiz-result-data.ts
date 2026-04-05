import type { QuizResultData } from "../types";

export const mockQuizResultData: QuizResultData = {
	totalScore: 80,
	results: [
		{
			questionId: "q1",
			prompt: "BLACKPINKのメンバーで、ソロ曲「LALISA」をリリースしたのは誰？",
			isCorrect: true,
			userAnswer: "リサ",
			correctAnswer: "リサ",
			explanation: "リサは2021年にソロシングル「LALISA」をリリースし、MVは公開24時間で7,360万回再生を記録しました。",
		},
		{
			questionId: "q2",
			prompt: "TWICEのデビュー曲はどれ？",
			isCorrect: true,
			userAnswer: "Like Ooh-Ahh",
			correctAnswer: "Like Ooh-Ahh",
			explanation: "TWICEは2015年10月に「Like Ooh-Ahh（OOH-AHH하게）」でデビューしました。",
		},
		{
			questionId: "q3",
			prompt: "BTSの公式ファンクラブの名前は？",
			isCorrect: false,
			userAnswer: "BLINK",
			correctAnswer: "ARMY",
			explanation: "BTSの公式ファンクラブ名は「ARMY」（Adorable Representative M.C for Youth）です。BLINKはBLACKPINKのファンクラブ名です。",
		},
		{
			questionId: "q4",
			prompt: "IVEのメンバー数は何人？",
			isCorrect: true,
			userAnswer: "6人",
			correctAnswer: "6人",
			explanation: "IVEは、ユジン、ガウル、レイ、ウォニョン、リズ、イソの6人で構成されています。",
		},
		{
			questionId: "q5",
			prompt: "Stray Kidsの所属事務所はどこ？",
			isCorrect: false,
			userAnswer: "SM Entertainment",
			correctAnswer: "JYP Entertainment",
			explanation: "Stray KidsはJYP Entertainmentに所属しています。SM EntertainmentにはNCTやaespaなどが所属しています。",
		},
	],
};
