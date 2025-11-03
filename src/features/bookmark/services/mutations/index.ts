import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';
import useAuth from '@/features/auth/hooks/use-auth';

import { BookmarkKeys } from '../queries/keys';

import type {
  ICreateBookmarkPayload,
  IUpdateBookmarkPayload,
  IDeleteBookmarkPayload,
} from './types';
import type { Bookmark } from '../../types';
import type { DataTimestamp } from '@/types';

export const useCreateBookmarkMutation = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation({
    mutationFn: async (payload: ICreateBookmarkPayload) => {
      const { bookId, ...data } = payload;
      const response = await _request.post<Bookmark & DataTimestamp>(
        `/books/${bookId}/users/${user?.id}/bookmarks`,
        data,
      );

      return response;
    },
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({
        queryKey: [
          BookmarkKeys.GetBookmarksByBookQuery,
          payload.bookId,
          user?.id,
        ],
      });
    },
  });
};

export const useUpdateBookmarkMutation = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation({
    mutationFn: async (payload: IUpdateBookmarkPayload) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { bookmarkId, bookId, ...data } = payload;
      const response = await _request.patch<Bookmark & DataTimestamp>(
        `/bookmarks/${bookmarkId}/users/${user?.id}`,
        data,
      );

      return response;
    },
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({
        queryKey: [
          BookmarkKeys.GetBookmarksByBookQuery,
          payload.bookId,
          user?.id,
        ],
      });
    },
  });
};

export const useDeleteBookmarkMutation = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation({
    mutationFn: async (payload: IDeleteBookmarkPayload) => {
      const response = await _request.delete(
        `/bookmarks/${payload.bookmarkId}/users/${user?.id}`,
      );

      return response;
    },
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({
        queryKey: [
          BookmarkKeys.GetBookmarksByBookQuery,
          payload.bookId,
          user?.id,
        ],
      });
    },
  });
};
