import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { QuizCreateForm } from "@/components/quiz/quiz-create-form";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { SectionCard } from "@/components/ui/SectionCard";
import type { QuizCreateFormValues } from "@/lib/schemas/quiz-create-schema";

function QuizCreatePage() {
	const navigate = useNavigate();

	const handleSubmitSuccess = (data: QuizCreateFormValues) => {
		console.log("Quiz created:", data);
		alert("クイズを作成しました！");
		navigate({ to: "/" });
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

export const Route = createFileRoute("/quiz/create")({
	component: QuizCreatePage,
});
