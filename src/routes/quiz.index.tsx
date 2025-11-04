import { createFileRoute } from '@tanstack/react-router';

import QuizPage from '@/pages/main/quiz/index';

export const Route = createFileRoute('/quiz/')({
  component: QuizPage,
});
