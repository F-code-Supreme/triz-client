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

export interface CreateFlashcardDeckPayload {
  title: string;
  description: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateFlashcardDeckPayload extends FlashcardDeckResponse {}
