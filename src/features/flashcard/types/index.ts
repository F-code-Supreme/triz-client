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
