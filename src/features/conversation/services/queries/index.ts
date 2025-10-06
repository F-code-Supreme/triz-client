import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';
import { STRING_EMPTY } from '@/constants';

import { ChatKeys } from './keys';

import type { IGetConversationDataResponse } from './types';
import type { ConversationsResponse } from '../../types';

export const useGetConversationsQuery = (
  searchQuery = STRING_EMPTY,
  archived = false,
) => {
  const _request = useAxios();
  return useInfiniteQuery({
    queryKey: [ChatKeys.GetConversationsQuery, searchQuery],
    queryFn: async ({ signal, pageParam = 0 }) => {
      const response = await _request.post<ConversationsResponse>(
        `/conversations/me/search`,
        {
          signal,
          params: {
            page: pageParam,
            size: 20,
          },
          data: {
            archived,
            title: searchQuery,
          },
        },
      );

      return response.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.page.number + 1 < lastPage.page.totalPages
        ? lastPage.page.number + 1
        : undefined;
    },
  });
};

export const useGetConversationQuery = (conversationId: string | null) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [ChatKeys.GetConversationQuery, conversationId],
    queryFn: async () => {
      const response = await _request.get<IGetConversationDataResponse>(
        `/conversations/${conversationId}`,
      );

      return response.data;
    },
    enabled: !!conversationId,
  });
};
