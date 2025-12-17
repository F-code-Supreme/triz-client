import { createFileRoute } from '@tanstack/react-router';

import ExpertJournalReviewDetailPage from '@/pages/main/expert/journal-reviews/detail';

export const Route = createFileRoute(
  '/expert/journal-reviews/$journalReviewId',
)({
  component: ExpertJournalReviewDetailPage,
});
