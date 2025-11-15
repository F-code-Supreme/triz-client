import { useQuery } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';
import { FlashcardKeys } from '@/features/flashcard/types/keys';

import type { Flashcard } from '@/features/flashcard/types';

export const useGetFlashcardsByDeckIdQuery = (deckId: string) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [FlashcardKeys.GetFlashcardsByDeckIdQuery, deckId],
    queryFn: async () => {
      const response = await _request.get<Flashcard[]>(
        `/decks/${deckId}/flashcards`,
      );
      return response.data;
    },
    enabled: !!deckId,
  });
};
