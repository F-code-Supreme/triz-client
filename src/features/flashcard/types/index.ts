export interface Flashcard {
  id: string;
  term: string;
  termImgUrl?: string | null;
  definition: string;
  defImgUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deckId: string;
}

export interface CreateFlashcardPayload {
  flashcards: {
    term: string;
    definition: string;
    termImgUrl?: string | null;
    defImgUrl?: string | null;
  }[];
}

export interface UpdateFlashcardPayload {
  term: string;
  definition: string;
  termImgUrl?: string | null;
  defImgUrl?: string | null;
}
