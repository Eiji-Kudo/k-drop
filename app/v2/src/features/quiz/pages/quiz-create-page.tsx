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
		<main className="grid flex-1 content-start gap-4">
			<section className="card border border-base-300 bg-base-100 shadow-lg">
				<div className="card-body gap-6">
					<h1 className="card-title text-2xl">クイズ作成</h1>
					<QuizCreateForm onSubmitSuccess={handleSubmitSuccess} />
				</div>
			</section>
		</main>
	);
}
