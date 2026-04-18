import { useNavigate } from "@tanstack/react-router";
import { QuizQuestionScreen } from "../components/QuizQuestionScreen";

export function QuizQuestionPage() {
	const navigate = useNavigate();

	return <QuizQuestionScreen onComplete={() => void navigate({ to: "/quiz/result" })} />;
}
