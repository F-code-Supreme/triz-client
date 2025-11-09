import { createFileRoute } from '@tanstack/react-router';

import QuizPage from '@/pages/main/quiz/index';

export const Route = createFileRoute('/(app)/quiz/')({
  component: QuizPage,
});
