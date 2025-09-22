import { useMutation } from '@tanstack/react-query';

import { request, useAxios } from '@/configs/axios';

import type {
  ILoginPayload,
  ILoginDataResponse,
  IRegisterPayload,
  IRefreshTokenPayload,
  IResetForgotPasswordPayload,
  IGoogleLoginPayload,
} from './types';

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (payload: ILoginPayload) => {
      const response = await request.post<ILoginDataResponse>(
        '/auth/login',
        payload,
      );

      return response;
    },
  });
};

export const useGoogleLoginMutation = () => {
  return useMutation({
    mutationFn: async (payload: IGoogleLoginPayload) => {
      const response = await request.post<ILoginDataResponse>(
        '/auth/google',
        payload,
      );

      return response;
    },
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: async (payload: IRegisterPayload) => {
      const response = await request.post('/auth/register', payload);

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

      return response;
    },
  });
};

export const useResetForgotPasswordMutation = () => {
  const _request = useAxios();
  return useMutation({
    mutationFn: async (payload: IResetForgotPasswordPayload) => {
      const response = await _request.patch('/auth/resetPassword', payload);

      return response;
    },
  });
};

export const useLogoutMutation = () => {
  const _request = useAxios();
  return useMutation({
    mutationFn: async () => {
      const response = await _request.post('/auth/logout');

      return response;
    },
  });
};
