import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { useAxios } from '@/configs/axios';
import { ChatKeys } from '@/features/conversation/services/queries/keys';
import { SubscriptionKeys } from '@/features/subscription/services/queries/keys';

import type { IChatDataResponse, IChatPayload } from './types';

export const useChatMutation = () => {
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation({
    mutationFn: async (payload: IChatPayload) => {
      try {
        const response = await _request.post<IChatDataResponse>(
          '/chat',
          payload,
        );
        return response;
      } catch (error) {
        if (error instanceof AxiosError) {
          const responseData = error.response?.data;
          // Handle subscription/token exhaustion error
          if (responseData?.code === 402) {
            throw {
              code: 402,
              message:
                responseData.message ||
                "You don't have an active subscription or your daily tokens have been exhausted.",
              type: 'SUBSCRIPTION_ERROR',
            };
          }
        }
        throw error;
      }
    },
    onSuccess: (_, payload) => {
      if (!payload.parentId) {
        queryClient.invalidateQueries({
          queryKey: [ChatKeys.GetConversationsQuery],
        });
      }

      queryClient.invalidateQueries({
        queryKey: [SubscriptionKeys.GetActiveSubscriptionByUserQuery],
        exact: false,
      });
    },
  });
};
