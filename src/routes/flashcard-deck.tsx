import { createFileRoute } from '@tanstack/react-router';

import FlashcardDeckPage from '@/pages/main/flashcard';

export const Route = createFileRoute('/flashcard-deck')({
  component: FlashcardDeckPage,
});
