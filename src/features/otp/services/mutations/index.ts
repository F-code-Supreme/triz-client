import { useMutation } from '@tanstack/react-query';

import { request } from '@/configs/axios';

import type { ISendOtpDataResponse, ISendOtpPayload } from './types';

export const useSendOtpMutation = () => {
  return useMutation({
    mutationFn: async (payload: ISendOtpPayload) => {
      const response = await request.post<ISendOtpDataResponse>(
        '/otp/send',
        payload,
      );

      if (response.code !== 200) {
        throw new Error(response.message);
      }

      return response;
    },
  });
};

export const useVerifyOtpMutation = () => {
  return useMutation({
    mutationFn: async (payload: ISendOtpPayload) => {
      const response = await request.post<ISendOtpDataResponse>(
        '/otp/verify',
        payload,
      );

      if (response.code !== 200) {
        throw new Error(response.message);
      }

      return response;
    },
  });
};
