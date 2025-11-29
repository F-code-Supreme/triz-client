import { createFileRoute } from '@tanstack/react-router';

import QuizDetailPage from '@/pages/main/customer/quiz/detail';

export const Route = createFileRoute('/(app)/quiz/$quizId')({
  component: QuizDetailPage,
});
