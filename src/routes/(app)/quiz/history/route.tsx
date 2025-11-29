import { createFileRoute } from '@tanstack/react-router';

import HistoryPage from '@/pages/main/customer/quiz/history';

export const Route = createFileRoute('/(app)/quiz/history')({
  component: HistoryPage,
});
