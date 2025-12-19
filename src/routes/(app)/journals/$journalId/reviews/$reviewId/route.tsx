import { createFileRoute } from '@tanstack/react-router';

import JournalReviewDetailsPage from '@/pages/main/customer/journals/reviews/detail';

export const Route = createFileRoute(
  '/(app)/journals/$journalId/reviews/$reviewId',
)({
  component: JournalReviewDetailsPage,
});
