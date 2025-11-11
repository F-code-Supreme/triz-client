import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';

import { UserKeys } from '../queries/keys';

import type { ICreateUserPayload, IEditUserPayload } from './types';
import type { IUser } from '../../types';
import type { DataTimestamp } from '@/types';

// ADMIN
export const useCreateUserMutation = () => {
  const _request = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ICreateUserPayload) => {
      const response = await _request.post<IUser & DataTimestamp>(
        '/users',
        payload,
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [UserKeys.GetAllUsersQuery] });
    },
  });
};

export const useEditUserMutation = () => {
  const _request = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: IEditUserPayload) => {
      const { id, ...updateData } = payload;
      const response = await _request.put<IUser & DataTimestamp>(
        `/users/${id}`,
        updateData,
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [UserKeys.GetAllUsersQuery] });
    },
  });
};
