import { useMutation } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';

import type { CreateScorePayload } from '@/features/game/services/mutations/types';

export const useUpdateGameScoreMutation = () => {
  const _request = useAxios();
  return useMutation({
    mutationFn: async (data: CreateScorePayload) => {
      const response = await _request.post(`/game-scores/submit`, data);
      return response.data;
    },
  });
};
