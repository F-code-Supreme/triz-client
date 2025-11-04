import { createFileRoute } from '@tanstack/react-router';

import FlashcardPage from '@/pages/main/flashcard';

export const Route = createFileRoute('/flashcard/$deckId')({
  component: FlashcardPage,
});
