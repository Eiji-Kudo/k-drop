import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { QuizQuestionScreen } from "@/components/quiz/QuizQuestionScreen";

function QuizQuestionPage() {
	const navigate = useNavigate();

	return <QuizQuestionScreen groupName="K-POP" onComplete={() => void navigate({ to: "/quiz/result" })} />;
}

export const Route = createFileRoute("/quiz/question")({
	component: QuizQuestionPage,
});
