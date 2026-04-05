import { BentoCard } from "./BentoCard";

export function BentoGrid() {
	return (
		<div className="flex flex-col gap-3">
			<div className="flex gap-3">
				<div className="flex-[1.2]">
					<BentoCard title={"問題を解く"} subtitle={"クイズに挑戦"} icon={"✏️"} variant="gradient" />
				</div>
				<div className="flex-[0.8]">
					<BentoCard title={"問題を作成"} icon={"➕"} />
				</div>
			</div>
			<div className="flex gap-3">
				<div className="flex-1">
					<BentoCard title={"ランキング"} icon={"🪖"} />
				</div>
				<div className="flex-1">
					<BentoCard title={"プロフィール"} icon={"👤"} />
				</div>
			</div>
		</div>
	);
}
