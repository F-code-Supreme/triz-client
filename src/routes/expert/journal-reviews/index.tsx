import { createFileRoute } from '@tanstack/react-router';

import ExpertJournalReviewsPage from '@/pages/main/expert/journal-reviews';

export const Route = createFileRoute('/expert/journal-reviews/')({
  component: ExpertJournalReviewsPage,
});
