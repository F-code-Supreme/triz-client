import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';
import { ModuleKeys } from '@/features/modules/services/queries/keys';

import type {
  CreateModulePayload,
  UpdateModulePayload,
} from '@/features/modules/services/mutations/types';
import type { Module } from '@/features/modules/types';
import type { Response } from '@/types';

export const useCreateModuleMutation = (courseId: string) => {
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation({
    mutationFn: async (payload: CreateModulePayload) => {
      const response = await _request.post<Response<Module>>(
        `/courses/${courseId}/modules`,
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ModuleKeys.GetModuleQuery],
      });
    },
  });
};

export const useUpdateModuleMutation = (id: string) => {
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation({
    mutationFn: async (payload: UpdateModulePayload) => {
      const response = await _request.put<Response<Module>>(
        `/modules/${id}`,
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ModuleKeys.GetModuleQuery],
      });
    },
  });
};
