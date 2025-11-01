import { skipToken, useQuery } from '@tanstack/react-query';

import { request, useAxios } from '@/configs/axios';
import useAuth from '@/features/auth/hooks/use-auth';

import { BookKeys } from './keys';

import type { BooksResponse, IGetBookProgressDataResponse } from './types';
import type { Book } from '../../types';
import type { DataTimestamp } from '@/types';

export const useGetAllBooksQuery = () => {
  return useQuery({
    queryKey: [BookKeys.GetAllBooksQuery],
    queryFn: async ({ signal }) => {
      const response = await request.get<BooksResponse>('/books/public', {
        signal,
      });

      return response.data;
    },
  });
};

export const useGetBookByIdQuery = (bookId?: string) => {
  return useQuery({
    queryKey: [BookKeys.GetBookByIdQuery, bookId],
    queryFn: bookId
      ? async ({ signal }) => {
          const response = await request.get<Book & DataTimestamp>(
            `/books/${bookId}`,
            {
              signal,
            },
          );

          return response.data;
        }
      : skipToken,
    enabled: !!bookId,
  });
};

export const useGetBookProgressQuery = (bookId?: string) => {
  const { user, isAuthenticated } = useAuth();
  const _request = useAxios();
  return useQuery({
    queryKey: [BookKeys.GetBookProgressQuery, bookId, user?.id],
    queryFn:
      isAuthenticated && bookId && user?.id
        ? async ({ signal }) => {
            const response = await _request.get<IGetBookProgressDataResponse>(
              `/books/${bookId}/users/${user?.id}/progress`,
              { signal },
            );

            return response.data;
          }
        : skipToken,
    enabled: !!bookId && !!user?.id,
  });
};
