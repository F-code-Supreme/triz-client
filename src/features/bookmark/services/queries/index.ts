import { skipToken, useQuery } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';
import useAuth from '@/features/auth/hooks/use-auth';

import { BookmarkKeys } from './keys';

import type { Bookmark } from '../../types';
import type { DataTimestamp } from '@/types';

export const useGetBookmarksByBookQuery = (bookId?: string) => {
  const { user } = useAuth();
  const _request = useAxios();
  return useQuery({
    queryKey: [BookmarkKeys.GetBookmarksByBookQuery, bookId, user?.id],
    queryFn:
      bookId && user?.id
        ? async ({ signal }) => {
            const response = await _request.get<(Bookmark & DataTimestamp)[]>(
              `/books/${bookId}/users/${user?.id}/bookmarks`,
              { signal },
            );

            return response.data;
          }
        : skipToken,
    enabled: !!bookId && !!user?.id,
  });
};
