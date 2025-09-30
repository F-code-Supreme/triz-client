import { useInfiniteQuery } from '@tanstack/react-query';

// import { useAxios } from '@/configs/axios';
import { STRING_EMPTY } from '@/constants';

import { ChatKeys } from './keys';

import type { ConversationsResponse } from '../../types';

export const useGetConversationsQuery = (
  searchQuery = STRING_EMPTY,
  // archived = false,
) => {
  // const _request = useAxios();
  return useInfiniteQuery({
    queryKey: [ChatKeys.GetConversationsQuery, searchQuery],
    // queryFn: async ({ signal, pageParam = 0 }) => {
    queryFn: async () => {
      // const response = await _request.post<ConversationsResponse>(
      //   `/conversations/me/search`,
      //   {
      //     signal,
      //     params: {
      //       page: pageParam,
      //       size: 20,
      //     },
      //     data: {
      //       archived,
      //       title: searchQuery,
      //     },
      //   },
      // );

      // Mock response conversation
      const mockConversations: ConversationsResponse = {
        data: new Array(18).fill(0).map((_, i) => ({
          id: (i + 1).toString(),
          title: `Conversation ${i + 1}`,
          updatedAt: new Date().toISOString(),
        })),
        page: {
          number: 0,
          size: 20,
          totalElements: 18,
          totalPages: 1,
        },
      };

      return mockConversations;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.page.number + 1 < lastPage.page.totalPages
        ? lastPage.page.number + 1
        : undefined;
    },
  });
};
