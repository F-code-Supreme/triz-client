import { createFileRoute } from '@tanstack/react-router';
import AdminFlashCardCardPage from '@/pages/main/admin/flashcards/card';

export const Route = createFileRoute('/admin/flashcards/card')({
  component: AdminFlashCardCardPage,
});
