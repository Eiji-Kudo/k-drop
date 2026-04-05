type ResultModalProps = {
	isCorrect: boolean;
};

export function ResultModal({ isCorrect }: ResultModalProps) {
	const color = isCorrect ? "#68c1f1" : "#f56f6f";
	const symbol = isCorrect ? "◎" : "×";
	const text = isCorrect ? "正解!" : "不正解";

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
			<div
				className="flex aspect-square w-[70vw] max-w-[300px] flex-col items-center justify-start gap-4 rounded-3xl border-4 bg-white/90 pt-5 shadow-lg backdrop-blur-sm"
				style={{ borderColor: color }}
			>
				<p className="text-2xl font-extrabold" style={{ color }}>
					{text}
				</p>
				<span className="text-[min(calc(70vw*0.55),165px)] font-black leading-none" style={{ color }}>
					{symbol}
				</span>
			</div>
		</div>
	);
}
