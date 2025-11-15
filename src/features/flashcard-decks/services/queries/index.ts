import { useQuery } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';
import { FlashcardDeckKeys } from '@/features/flashcard-decks/types/keys';

import type { FlashcardDeckResponse } from '@/features/flashcard-decks/types';

export const useGetFlashcardDecksQuery = () => {
  const _request = useAxios();
  return useQuery({
    queryKey: [FlashcardDeckKeys.GetFlashcardDeckQuery],
    queryFn: async () => {
      const response = await _request.get<FlashcardDeckResponse>('/decks');
      return response.data;
    },
  });
};

export const useGetFlashcardDeckByIdQuery = (deckId: string) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [FlashcardDeckKeys.GetFlashcardDeckByIdQuery, deckId],
    queryFn: async () => {
      const response = await _request.get<{
        data: FlashcardDeckResponse;
      }>(`/decks/${deckId}`);
      return response.data.data;
    },
    enabled: !!deckId,
  });
};
