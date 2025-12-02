import { useMutation } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';

import type {
  IStep1SuggestionResponse,
  IStep1SuggestionPayload,
  IStep2SuggestionPayload,
  IStep2SuggestionResponse,
  IStep3SuggestionPayload,
  IStep3SuggestionResponse,
  IStep4SuggestionPayload,
  IStep4SuggestionResponse,
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

export const useStep3SuggestionMutation = () => {
  const _request = useAxios();

  return useMutation({
    mutationFn: async (payload: IStep3SuggestionPayload) => {
      const response = await _request.post<IStep3SuggestionResponse>(
        '/step3/suggestions',
        payload,
      );

      return response.data;
    },
  });
};

export const useStep4SuggestionMutation = () => {
  const _request = useAxios();

  return useMutation({
    mutationFn: async (payload: IStep4SuggestionPayload) => {
      const response = await _request.post<IStep4SuggestionResponse>(
        '/step4/suggestions',
        payload,
      );

      return response.data;
    },
  });
};
