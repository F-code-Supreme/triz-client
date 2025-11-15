import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from '@/configs/axios';
import { FlashcardDeckKeys } from '@/features/flashcard-decks/types/keys';
import type {
  CreateFlashcardDeckPayload,
  FlashcardDeckResponse,
  UpdateFlashcardDeckPayload,
} from '@/features/flashcard-decks/types';

export const useCreateFlashcardDeckMutation = () => {
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation<
    FlashcardDeckResponse,
    unknown,
    CreateFlashcardDeckPayload
  >({
    mutationKey: [FlashcardDeckKeys.CreateFlashcardDeckMutation],
    mutationFn: async (payload) => {
      const response = await _request.post<{
        data: FlashcardDeckResponse;
      }>('/decks', payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [FlashcardDeckKeys.GetFlashcardDeckQuery],
      });
    },
  });
};

export const useUpdateFlashcardDeckMutation = () => {
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation<
    FlashcardDeckResponse,
    unknown,
    { deckId: string; payload: UpdateFlashcardDeckPayload }
  >({
    mutationKey: [FlashcardDeckKeys.UpdateFlashcardDeckMutation],
    mutationFn: async ({ deckId, payload }) => {
      const response = await _request.patch<{
        data: FlashcardDeckResponse;
      }>(`/decks/${deckId}`, payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [FlashcardDeckKeys.GetFlashcardDeckQuery],
      });
    },
  });
};

export const useDeleteFlashcardDeckMutation = () => {
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation<void, unknown, { deckId: string }>({
    mutationKey: [FlashcardDeckKeys.DeleteFlashcardDeckMutation],
    mutationFn: async ({ deckId }) => {
      await _request.delete(`/decks/${deckId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [FlashcardDeckKeys.GetFlashcardDeckQuery],
      });
    },
  });
};
