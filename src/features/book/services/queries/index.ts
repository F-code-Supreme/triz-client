import { skipToken, useQuery } from '@tanstack/react-query';

import { request, useAxios } from '@/configs/axios';
import useAuth from '@/features/auth/hooks/use-auth';

import { BookKeys } from './keys';

import type {
  BooksResponse,
  IGetAllBookProgressDataResponse,
  IGetAllBooksAdminDataResponse,
} from './types';
import type { Book, BookProgress } from '../../types';
import type { DataTimestamp } from '@/types';

// PUBLIC
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

// AUTHENTICATED USER
export const useGetAllBookProgressQuery = () => {
  const _request = useAxios();
  return useQuery({
    queryKey: [BookKeys.GetAllBookProgressQuery],
    queryFn: async ({ signal }) => {
      const response = await _request.get<IGetAllBookProgressDataResponse>(
        `/books/me`,
        { signal },
      );

      return response.data;
    },
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
            const response = await _request.get<BookProgress & DataTimestamp>(
              `/books/${bookId}/users/${user?.id}/progress`,
              { signal },
            );

            return response.data;
          }
        : skipToken,
    enabled: !!bookId && !!user?.id,
  });
};

// ADMIN
export const useGetAllBooksAdminQuery = () => {
  const _request = useAxios();
  return useQuery({
    queryKey: [BookKeys.GetAllBooksAdminQuery],
    queryFn: async ({ signal }) => {
      const response = await _request.get<IGetAllBooksAdminDataResponse>(
        '/books',
        {
          signal,
        },
      );

      return response.data;
    },
  });
};

export const useGetAllDeletedBooksAdminQuery = () => {
  const _request = useAxios();
  return useQuery({
    queryKey: [BookKeys.GetAllBooksAdminQuery, 'deleted'],
    queryFn: async ({ signal }) => {
      const response = await _request.get<IGetAllBooksAdminDataResponse>(
        '/books/deleted',
        {
          signal,
        },
      );

      return response.data;
    },
  });
};
