import HistoryPage from '@/pages/main/quiz/History';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/quiz/history/')({
  component: HistoryPage,
});
