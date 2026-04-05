type WelcomeHeaderProps = {
	levelName: string;
	levelStars: number;
};

export function WelcomeHeader({ levelName, levelStars }: WelcomeHeaderProps) {
	const stars = Array.from({ length: 5 }, (_, i) => (i < levelStars ? "\u2605" : "\u2606")).join("");

	return (
		<div className="rounded-3xl bg-gradient-to-b from-white to-secondary p-6 text-center shadow-sm">
			<p className="text-xl font-bold text-base-content">{"\u30AA\u30BF\u529B\u30D0\u30C8\u30EB\u3057\u3088\u3046\uFF01"}</p>
			<div className="mt-2 flex items-center justify-center gap-2">
				<span className="text-lg tracking-widest text-warning">{stars}</span>
				<span className="text-base font-semibold text-accent">{levelName}</span>
			</div>
		</div>
	);
}
