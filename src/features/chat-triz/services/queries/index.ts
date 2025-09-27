import { useInfiniteQuery } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';
import { STRING_EMPTY } from '@/constants';

import { ChatKeys } from './keys';

import type { ConversationsResponse } from '../../types';

export const useGetConversationsQuery = (
  searchQuery = STRING_EMPTY,
  archived = false,
) => {
  const _request = useAxios();
  return useInfiniteQuery({
    queryKey: [ChatKeys.GetConversationsQuery, searchQuery],
    queryFn: async ({ signal, pageParam = 0 }) => {
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
        data: [
          {
            id: '1',
            title: 'Conversation 1',
            updatedAt: new Date().toISOString(),
          },
          {
            id: '2',
            title: 'Conversation 2',
            updatedAt: new Date().toISOString(),
          },
          {
            id: '3',
            title: 'Conversation 3',
            updatedAt: new Date().toISOString(),
          },
          {
            id: '4',
            title: 'Conversation 4',
            updatedAt: new Date().toISOString(),
          },
          {
            id: '5',
            title: 'Conversation 5',
            updatedAt: new Date().toISOString(),
          },
          {
            id: '6',
            title: 'Conversation 6',
            updatedAt: new Date().toISOString(),
          },
          {
            id: '7',
            title: 'Conversation 7',
            updatedAt: new Date().toISOString(),
          },
          {
            id: '8',
            title: 'Conversation 8',
            updatedAt: new Date().toISOString(),
          },
          {
            id: '9',
            title: 'Conversation 9',
            updatedAt: new Date().toISOString(),
          },
          {
            id: '10',
            title: 'Conversation 10',
            updatedAt: new Date().toISOString(),
          },
        ],
        page: {
          number: 0,
          size: 20,
          totalElements: 8,
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
