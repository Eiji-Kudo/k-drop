import { formatFanDuration } from "../utils/format-fan-duration";

type ProfileStatsProps = {
	totalOtakuPower: number;
	fanSince?: Date;
	layerName?: string;
};

export function ProfileStats({ totalOtakuPower, fanSince, layerName }: ProfileStatsProps) {
	return (
		<div className="flex gap-3 px-4 py-2">
			<div className="flex flex-1 flex-col items-center gap-1 rounded-box bg-secondary p-4">
				<span className="text-xs text-secondary-content/70">Otaku Power</span>
				<span className="text-xl font-bold">{totalOtakuPower}</span>
				{layerName && <span className="text-xs text-primary">{layerName}</span>}
			</div>

			<div className="flex flex-1 flex-col items-center gap-1 rounded-box bg-secondary p-4">
				<span className="text-xs text-secondary-content/70">Fan Since</span>
				<span className="text-xl font-bold">{formatFanDuration(fanSince)}</span>
			</div>
		</div>
	);
}
