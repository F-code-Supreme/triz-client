import { useQuery } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';
import { ModuleKeys } from '@/features/modules/services/queries/keys';

import type { ModuleResponseData, Module } from '../../types';
import type { ModuleResponse } from '@/features/modules/services/queries/types';

export const useGetModulesQuery = (page?: number, size?: number) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [ModuleKeys.GetModuleQuery, page, size],
    queryFn: async () => {
      const response = await _request.get<ModuleResponse>('/modules', {
        params: {
          page,
          size,
        },
      });

      return response.data;
    },
  });
};

export const useGetModuleByCourseQuery = (courseId: string) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [ModuleKeys.GetModuleQuery, courseId],
    queryFn: async () => {
      const response = await _request.get<ModuleResponseData>(
        `/courses/${courseId}/modules`,
      );
      return response.data.content;
    },
  });
};
export const useGetModulesByCourseQuery = (courseId: string) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [ModuleKeys.GetModulesByCourseQuery, courseId],
    queryFn: async () => {
      const response = await _request.get<ModuleResponse>(
        `/courses/${courseId}/modules`,
      );

      return response.data;
    },
    enabled: !!courseId,
  });
};

export const useGetModulesById = (moduleId: string) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [ModuleKeys.GetModulesById, moduleId],
    queryFn: async () => {
      const response = await _request.get<Module>(`modules/${moduleId}`);

      return response.data;
    },
    enabled: !!moduleId,
  });
};
