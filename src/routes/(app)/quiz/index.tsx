import { createFileRoute } from '@tanstack/react-router';

import QuizPage from '@/pages/main/customer/quiz';

export const Route = createFileRoute('/(app)/quiz/')({
  component: QuizPage,
});
