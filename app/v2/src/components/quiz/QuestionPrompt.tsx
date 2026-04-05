type QuestionPromptProps = {
	prompt: string;
};

export function QuestionPrompt({ prompt }: QuestionPromptProps) {
	return (
		<div>
			<p className="text-lg leading-7">{prompt}</p>
		</div>
	);
}
