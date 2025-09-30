import { useMutation } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';

import type {
  IArchiveConversationPayload,
  IRenameConversationPayload,
} from './types';
import type { Conversation } from '../../types';

export const useArchiveConversationMutation = () => {
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
  });
};

export const useRenameConversationMutation = () => {
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
  });
};

export const useDeleteConversationMutation = () => {
  const _request = useAxios();
  return useMutation({
    mutationFn: async (conversationId: string) => {
      const response = await _request.delete(
        `/conversations/${conversationId}`,
      );

      return response;
    },
  });
};
