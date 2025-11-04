import { useQuery } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';
import useAuth from '@/features/auth/hooks/use-auth';

import { BookHighlightKeys } from './keys';

import type { BookHighlight } from '../../types';

export const useGetHighlightsByBookQuery = (bookId: string | null) => {
  const { user } = useAuth();
  const _request = useAxios();
  return useQuery({
    queryKey: [BookHighlightKeys.GetHighlightsByBookQuery, bookId, user?.id],
    queryFn: async ({ signal }) => {
      const response = await _request.get<
        (BookHighlight & {
          createdAt: string;
        })[]
      >(`/books/${bookId}/users/${user?.id}/book-highlights`, { signal });

      return response.data;
    },
    enabled: !!bookId && !!user?.id,
  });
};
