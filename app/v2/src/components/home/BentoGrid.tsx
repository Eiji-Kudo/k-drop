import { BentoCard } from "@/components/home/BentoCard";

export function BentoGrid() {
	return (
		<div className="flex flex-col gap-3">
			<div className="flex gap-3">
				<div className="flex-[1.2]">
					<BentoCard
						title={"\u554F\u984C\u3092\u89E3\u304F"}
						subtitle={"\u30AF\u30A4\u30BA\u306B\u6311\u6226"}
						icon={"\u270F\uFE0F"}
						variant="gradient"
					/>
				</div>
				<div className="flex-[0.8]">
					<BentoCard title={"\u554F\u984C\u3092\u4F5C\u6210"} icon={"\u2795"} />
				</div>
			</div>
			<div className="flex gap-3">
				<div className="flex-1">
					<BentoCard title={"\u30E9\u30F3\u30AD\u30F3\u30B0"} icon={"\u1FA96"} />
				</div>
				<div className="flex-1">
					<BentoCard title={"\u30D7\u30ED\u30D5\u30A3\u30FC\u30EB"} icon={"\u1F464"} />
				</div>
			</div>
		</div>
	);
}
