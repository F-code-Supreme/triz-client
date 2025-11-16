import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';
import { FlashcardKeys } from '@/features/flashcard/types/keys';

import type {
  CreateFlashcardPayload,
  Flashcard,
  UpdateFlashcardPayload,
} from '@/features/flashcard/types';

export const useCreateFlashcardMutation = () => {
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation<
    Flashcard[],
    unknown,
    { deckId: string; payload: CreateFlashcardPayload }
  >({
    mutationKey: [FlashcardKeys.GetFlashcardsByDeckIdQuery],
    mutationFn: async ({ deckId, payload }) => {
      const response = await _request.post<{
        data: Flashcard[];
      }>(`/decks/${deckId}/flashcards`, payload);
      return response.data.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [FlashcardKeys.GetFlashcardsByDeckIdQuery, variables.deckId],
      });
    },
  });
};

export const useUpdateFlashcardMutation = () => {
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation<
    Flashcard,
    unknown,
    { flashcardId: string; payload: UpdateFlashcardPayload; deckId: string }
  >({
    mutationKey: [FlashcardKeys.GetFlashcardsByDeckIdQuery],
    mutationFn: async ({ flashcardId, payload }) => {
      const response = await _request.patch<{
        data: Flashcard;
      }>(`/flashcards/${flashcardId}`, payload);
      return response.data.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [FlashcardKeys.GetFlashcardsByDeckIdQuery, variables.deckId],
      });
    },
  });
};

export const useDeleteFlashcardMutation = () => {
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation<void, unknown, { flashcardId: string; deckId: string }>({
    mutationKey: [FlashcardKeys.GetFlashcardsByDeckIdQuery],
    mutationFn: async ({ flashcardId }) => {
      await _request.delete(`/flashcards/${flashcardId}`);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [FlashcardKeys.GetFlashcardsByDeckIdQuery, variables.deckId],
      });
    },
  });
};
