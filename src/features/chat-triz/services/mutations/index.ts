import { useMutation } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';

import type { IChatDataResponse, IChatPayload } from './types';

export const useChatMutation = () => {
  const _request = useAxios();
  return useMutation({
    mutationFn: async (payload: IChatPayload) => {
      const response = await _request.post<IChatDataResponse>('/chat', payload);

      return response;
    },
  });
};
