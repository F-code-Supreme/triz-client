import { useMutation } from '@tanstack/react-query';

import { request } from '@/configs/axios';

import type {
  ISendOtpDataResponse,
  ISendOtpPayload,
  IVerifyOtpPayload,
  IVerifyOtpDataResponse,
} from './types';

export const useSendOtpMutation = () => {
  return useMutation({
    mutationFn: async (payload: ISendOtpPayload) => {
      const response = await request.post<ISendOtpDataResponse>(
        '/otp/send',
        payload,
      );

      return response;
    },
  });
};

export const useVerifyOtpMutation = () => {
  return useMutation({
    mutationFn: async (payload: IVerifyOtpPayload) => {
      const response = await request.post<IVerifyOtpDataResponse>(
        '/otp/verify',
        payload,
      );

      return response;
    },
  });
};
