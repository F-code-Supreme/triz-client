import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';
import { LessonKeys } from '@/features/lesson/services/queries/keys';
import { ModuleKeys } from '@/features/modules/services/queries/keys';

import type { CreateLessonPayload } from '@/features/lesson/services/mutations/types';
import type { Lesson } from '@/features/lesson/types';
import type { Response } from '@/types';

export const useCreateLessonMutation = (moduleId: string) => {
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation({
    mutationFn: async (payload: CreateLessonPayload) => {
      const response = await _request.post<Response<Lesson>>(
        `/modules/${moduleId}/lessons`,
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ModuleKeys.GetModulesById, moduleId],
      });
      queryClient.invalidateQueries({
        queryKey: [LessonKeys.GetLessonsByModuleQuery, moduleId],
      });
      queryClient.invalidateQueries({
        queryKey: [ModuleKeys.GetModulesByCourseQuery],
      });
    },
  });
};
export const useUpdateLessonMutation = (lessonId: string) => {
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation({
    mutationFn: async (payload: CreateLessonPayload) => {
      const response = await _request.post<Response<Lesson>>(
        `/lessons/${lessonId}`,
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ModuleKeys.GetModulesByCourseQuery],
      });
    },
  });
};

export const useReorderLessonMutation = (moduleId: string) => {
  const _request = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lessonIds: string[]) => {
      const payload = lessonIds.map((id) => ({
        id,
        type: 'lesson',
      }));

      const response = await _request.patch<Lesson>(
        `/modules/${moduleId}/reorder`,
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ModuleKeys.GetModulesById, moduleId],
      });
      queryClient.invalidateQueries({
        queryKey: [LessonKeys.GetLessonsByModuleQuery, moduleId],
      });
      queryClient.invalidateQueries({
        queryKey: [ModuleKeys.GetModulesByCourseQuery],
      });
    },
  });
};
