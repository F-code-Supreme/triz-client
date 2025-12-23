import { createFileRoute } from '@tanstack/react-router';

import JournalReviewsPage from '@/pages/main/customer/journals/reviews';

export const Route = createFileRoute('/(app)/journals/$journalId/reviews/')({
  component: JournalReviewsPage,
});
