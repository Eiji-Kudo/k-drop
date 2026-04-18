type ResultModalProps = {
	isCorrect: boolean;
};

export function ResultModal({ isCorrect }: ResultModalProps) {
	const symbol = isCorrect ? "◎" : "×";
	const text = isCorrect ? "正解!" : "不正解";
	const toneClassName = isCorrect ? "border-info/20 bg-[#eff8ff] text-info-content" : "border-error/20 bg-[#fff1f3] text-[#ab2438]";

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20" role="dialog" aria-modal="true" aria-label={text}>
			<div
				className={`flex aspect-square w-[70vw] max-w-[300px] flex-col items-center justify-start gap-4 rounded-panel border bg-white/90 pt-5 shadow-pop backdrop-blur-sm ${toneClassName}`}
			>
				<p className="text-2xl font-extrabold">{text}</p>
				<span className="text-[min(calc(70vw*0.55),165px)] font-black leading-none">{symbol}</span>
			</div>
		</div>
	);
}
