import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { SectionCard } from "@/components/ui/SectionCard";
import { QuizCreateForm } from "../components/QuizCreateForm";
import type { QuizCreateFormValues } from "../schemas/quiz-create-schema";

type QuizCreatePageProps = {
	onCreated: (data: QuizCreateFormValues) => void;
};

export function QuizCreatePage({ onCreated }: QuizCreatePageProps) {
	const handleSubmitSuccess = (data: QuizCreateFormValues) => {
		console.log("Quiz created:", data);
		alert("クイズを作成しました！");
		onCreated(data);
	};

	return (
		<PageShell>
			<PageHeader eyebrow="CREATE QUIZ" title="クイズ作成" description="後から磨き込みやすいよう、まずは共通フォームの土台を揃える。" />
			<SectionCard className="px-5 py-5">
				<QuizCreateForm onSubmitSuccess={handleSubmitSuccess} />
			</SectionCard>
		</PageShell>
	);
}
