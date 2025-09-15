import { useMutation } from '@tanstack/react-query';

import { request } from '@/configs/axios';

import type {
  ILoginPayload,
  ILoginDataResponse,
  IRegisterPayload,
  IRefreshTokenPayload,
  IResetForgotPasswordPayload,
} from './types';

export const useLogin = () => {
  return useMutation({
    mutationFn: async (payload: ILoginPayload) => {
      const response = await request.post<ILoginDataResponse>(
        '/auth/login',
        payload,
      );

      if (response.code !== 200) {
        throw new Error(response.message);
      }

      return response;
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (payload: IRegisterPayload) => {
      const response = await request.post('/auth/register', payload);

      if (response.code !== 200) {
        throw new Error(response.message);
      }

      return response;
    },
  });
};

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: async (payload: IRefreshTokenPayload) => {
      const response = await request.post<ILoginDataResponse>(
        '/auth/refreshToken',
        payload,
      );

      if (response.code !== 200) {
        throw new Error(response.message);
      }

      return response;
    },
  });
};

export const useResetForgotPassword = () => {
  return useMutation({
    mutationFn: async (payload: IResetForgotPasswordPayload) => {
      const response = await request.patch('/auth/resetPassword', payload);

      if (response.code !== 200) {
        throw new Error(response.message);
      }

      return response;
    },
  });
};
