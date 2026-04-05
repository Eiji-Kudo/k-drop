import { BarChart3, PencilLine, Sparkles, UserRound } from "lucide-react";
import { BentoCard } from "@/components/home/BentoCard";

export function BentoGrid() {
	return (
		<div className="flex flex-col gap-3">
			<div className="grid grid-cols-[1.15fr,0.85fr] gap-3">
				<div className="flex-[1.2]">
					<BentoCard to="/quiz" title="問題を解く" subtitle="今日の推し知識を増やす" icon={Sparkles} variant="gradient" />
				</div>
				<div className="flex-[0.8]">
					<BentoCard to="/quiz/create" title="問題を作成" subtitle="新しいお題を投稿" icon={PencilLine} />
				</div>
			</div>
			<div className="grid grid-cols-2 gap-3">
				<div className="flex-1">
					<BentoCard to="/ranking" title="ランキング" subtitle="ライバルをチェック" icon={BarChart3} />
				</div>
				<div className="flex-1">
					<BentoCard to="/profile" title="プロフィール" subtitle="成長を見返す" icon={UserRound} />
				</div>
			</div>
		</div>
	);
}
