import { useQuery } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';
import { LessonKeys } from '@/features/lesson/services/queries/keys';

import type { LessonResponse } from '@/features/lesson/services/queries/types';
import type { Lesson } from '@/features/lesson/types';

export const useGetLessonsQuery = (page?: number, size?: number) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [LessonKeys.GetLessonQuery, page, size],
    queryFn: async () => {
      const response = await _request.get<LessonResponse>('/lessons', {
        params: {
          page,
          size,
        },
      });

      return response.data;
    },
  });
};

export const useGetLessonByModuleQuery = (moduleId: string) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [LessonKeys.GetLessonQuery, moduleId],
    queryFn: async () => {
      const response = await _request.get<LessonResponse[]>(
        `/modules/${moduleId}/lessons`,
      );
      return response.data;
    },
    enabled: !!moduleId,
  });
};
export const useGetLessonsByModuleQuery = (moduleId: string) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [LessonKeys.GetLessonsByModuleQuery, moduleId],
    queryFn: async () => {
      const response = await _request.get<Lesson[]>(
        `/modules/${moduleId}/lessons`,
      );

      return response.data;
    },
    enabled: !!moduleId,
  });
};
// New: fetch a single lesson by id
export const useGetLessonById = (lessonId?: string) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [LessonKeys.GetLessonQuery, lessonId],
    queryFn: async () => {
      const response = await _request.get<Lesson>(`/lessons/${lessonId}`);
      return response.data;
    },
    enabled: !!lessonId,
  });
};
