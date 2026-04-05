import { SectionCard } from "@/components/ui/SectionCard";

type QuestionPromptProps = {
	prompt: string;
};

export function QuestionPrompt({ prompt }: QuestionPromptProps) {
	return (
		<SectionCard className="px-5 py-6">
			<p className="text-xl font-black leading-8 tracking-[-0.03em] text-base-content">{prompt}</p>
		</SectionCard>
	);
}
