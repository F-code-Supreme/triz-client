import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';

import { ChatKeys } from '../queries/keys';

import type {
  IArchiveConversationPayload,
  IRenameConversationPayload,
} from './types';
import type { Conversation } from '../../types';

export const useArchiveConversationMutation = () => {
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation({
    mutationFn: async (payload: IArchiveConversationPayload) => {
      const response = await _request.patch<Conversation>(
        `/conversations/${payload.conversationId}`,
        {
          archived: payload.archived,
        },
      );

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ChatKeys.GetConversationsQuery],
      });
    },
  });
};

export const useRenameConversationMutation = () => {
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation({
    mutationFn: async (payload: IRenameConversationPayload) => {
      const response = await _request.patch<Conversation>(
        `/conversations/${payload.conversationId}`,
        {
          title: payload.title,
        },
      );

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ChatKeys.GetConversationsQuery],
      });
    },
  });
};

export const useDeleteConversationMutation = () => {
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation({
    mutationFn: async (conversationId: string) => {
      const response = await _request.delete(
        `/conversations/${conversationId}`,
      );

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ChatKeys.GetConversationsQuery],
      });
    },
  });
};
