import HistoryPage from '@/pages/main/quiz/history';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/quiz/history/')({
  component: HistoryPage,
});
