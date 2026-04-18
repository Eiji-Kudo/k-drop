import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { QuizCreatePage } from "@/features/quiz/pages/quiz-create-page";

export const Route = createFileRoute("/(tabs)/quiz/create")({
	component: QuizCreateRoute,
});

function QuizCreateRoute() {
	const navigate = useNavigate();

	const handleCreated = () => {
		navigate({ to: "/" });
	};

	return <QuizCreatePage onCreated={handleCreated} />;
}
