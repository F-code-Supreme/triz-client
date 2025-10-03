import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';
import { ChatKeys } from '@/features/conversation/services/queries/keys';

import type { IChatDataResponse, IChatPayload } from './types';

export const useChatMutation = () => {
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation({
    mutationFn: async (payload: IChatPayload) => {
      const response = await _request.post<IChatDataResponse>('/chat', payload);

      return response;
    },
    onSuccess: (_, payload) => {
      if (!payload.parentId) {
        queryClient.invalidateQueries({
          queryKey: [ChatKeys.GetConversationsQuery],
        });
      }
    },
  });
};
