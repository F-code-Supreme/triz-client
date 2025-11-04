import QuizDetailPage from '@/pages/main/quiz/detail';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/quiz/$quizId/')({
  component: QuizDetailPage,
});
