import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { QuizQuestionScreen } from "@/components/quiz/QuizQuestionScreen";

type QuizSessionSearch = {
	groupId: string;
};

function QuizSessionPage() {
	const navigate = useNavigate();

	return <QuizQuestionScreen onComplete={() => void navigate({ to: "/quiz/result" })} />;
}

export const Route = createFileRoute("/quiz/$sessionId")({
	component: QuizSessionPage,
	validateSearch: (search: Record<string, unknown>): QuizSessionSearch => ({
		groupId: typeof search.groupId === "string" ? search.groupId : "",
	}),
});
