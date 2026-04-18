import { formatFanDuration } from "../utils/format-fan-duration";

type ProfileStatsProps = {
	totalOtakuPower: number;
	fanSince?: Date;
	layerName?: string;
};

export function ProfileStats({ totalOtakuPower, fanSince, layerName }: ProfileStatsProps) {
	return (
		<div className="grid grid-cols-2 gap-3">
			<div className="flex flex-1 flex-col items-center gap-1 rounded-panel border border-border-soft bg-surface px-4 py-4 shadow-soft">
				<span className="text-xs text-muted-foreground">オタ力</span>
				<span className="text-xl font-black tracking-[-0.03em]">{totalOtakuPower}</span>
				{layerName && <span className="text-xs font-semibold text-primary">{layerName}</span>}
			</div>

			<div className="flex flex-1 flex-col items-center gap-1 rounded-panel border border-border-soft bg-surface px-4 py-4 shadow-soft">
				<span className="text-xs text-muted-foreground">推し歴</span>
				<span className="text-xl font-black tracking-[-0.03em]">{formatFanDuration(fanSince)}</span>
			</div>
		</div>
	);
}
