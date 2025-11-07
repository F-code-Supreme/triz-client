import type { PaginatedResponse } from '@/types';

export interface FlashcardDeck {
  id: string;
  title: string;
  description: string;
  numberOfFlashcards: number;
  createdAt?: string;
  updatedAt?: string;
}
export type FlashcardDeckResponse = PaginatedResponse<FlashcardDeck>;
