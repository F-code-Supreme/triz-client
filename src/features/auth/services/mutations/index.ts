import { useMutation } from '@tanstack/react-query';

import { request } from '@/configs/axios';

import type {
  ILoginPayload,
  ILoginDataResponse,
  IRegisterPayload,
  IRefreshTokenPayload,
  IResetForgotPasswordPayload,
} from './types';

export const useLoginMutation = () => {
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

export const useRegisterMutation = () => {
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

export const useRefreshTokenMutation = () => {
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

export const useResetForgotPasswordMutation = () => {
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

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await request.post('/auth/logout');

      if (response.code !== 200) {
        throw new Error(response.message);
      }

      return response;
    },
  });
};
