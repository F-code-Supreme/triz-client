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
  IConvertMLtoMKPayload,
  IConvertMLtoMKResponse,
  IStep5SuggestionPayload,
  IStep5SuggestionResponse,
  IStep6SuggestionPayload,
  IStep6SuggestionResponse,
  ICreateSixStepJournalPayload,
} from './types';
import type { Problem } from '../../types';

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

export const useConvertMLtoMKMutation = () => {
  const _request = useAxios();

  return useMutation({
    mutationFn: async (payload: IConvertMLtoMKPayload) => {
      const response = await _request.post<IConvertMLtoMKResponse>(
        '/ml-to-mk/suggestions',
        payload,
      );

      return response.data;
    },
  });
};

export const useStep5SuggestionMutation = () => {
  const _request = useAxios();

  return useMutation({
    mutationFn: async (payload: IStep5SuggestionPayload) => {
      const response = await _request.post<IStep5SuggestionResponse>(
        '/step5/suggestions',
        payload,
      );

      return response.data;
    },
  });
};

export const useStep6SuggestionMutation = () => {
  const _request = useAxios();

  return useMutation({
    mutationFn: async (payload: IStep6SuggestionPayload) => {
      const response = await _request.post<IStep6SuggestionResponse>(
        '/step6/suggestions',
        payload,
      );

      return response.data;
    },
  });
};

export const useCreateSixStepJournalMutation = () => {
  const _request = useAxios();

  return useMutation({
    mutationFn: async (payload: ICreateSixStepJournalPayload) => {
      const response = await _request.post<Problem>(
        '/problems/steps/all',
        payload,
      );

      return response.data;
    },
  });
};
