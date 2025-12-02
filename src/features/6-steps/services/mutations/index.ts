import { useMutation } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';

import type {
  IStep1SuggestionResponse,
  IStep1SuggestionPayload,
  IStep2SuggestionPayload,
  IStep2SuggestionResponse,
} from './types';

export const useStep1SuggestionMutation = () => {
  const _request = useAxios();

  return useMutation({
    mutationFn: async (payload: IStep1SuggestionPayload) => {
      const response = await _request.post<IStep1SuggestionResponse>(
        '/step1/suggestions',
        payload,
      );

      return response.data;
    },
  });
};

export const useStep2SuggestionMutation = () => {
  const _request = useAxios();

  return useMutation({
    mutationFn: async (payload: IStep2SuggestionPayload) => {
      const response = await _request.post<IStep2SuggestionResponse>(
        '/step2/suggestions',
        payload,
      );

      return response.data;
    },
  });
};
