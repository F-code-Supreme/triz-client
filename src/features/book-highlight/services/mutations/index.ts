import { useMutation } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';
import useAuth from '@/features/auth/hooks/use-auth';

import type { ICreateHighlightPayload, IDeleteHighlightPayload } from './types';
import type { BookHighlight } from '../../types';

export const useCreateHighlightMutation = () => {
  const { user } = useAuth();
  const _request = useAxios();
  return useMutation({
    mutationFn: async (payload: ICreateHighlightPayload) => {
      const { bookId, ...data } = payload;
      const response = await _request.post<
        BookHighlight & {
          createdAt: string;
        }
      >(`/books/${bookId}/users/${user?.id}/book-highlights`, data);

      return response;
    },
  });
};

export const useDeleteHighlightMutation = () => {
  const { user } = useAuth();
  const _request = useAxios();
  return useMutation({
    mutationFn: async (payload: IDeleteHighlightPayload) => {
      const response = await _request.delete(
        `/book-highlights/${payload.highlightId}/users/${user?.id}`,
      );

      return response;
    },
  });
};
