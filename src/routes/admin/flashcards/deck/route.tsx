import { createFileRoute } from '@tanstack/react-router';
import AdminFlashCardDeckPage from '@/pages/main/admin/flashcards/deck';

export const Route = createFileRoute('/admin/flashcards/deck')({
  component: AdminFlashCardDeckPage,
});
