import { createFileRoute } from '@tanstack/react-router';

import AdminFlashCardsPage from '@/pages/main/admin/flashcards';

export const Route = createFileRoute('/admin/flashcards')({
  component: AdminFlashCardsPage,
});
