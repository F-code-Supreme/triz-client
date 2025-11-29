import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';
import { CourseKeys } from '@/features/courses/services/queries/keys';
import { ModuleKeys } from '@/features/modules/services/queries/keys';

import type {
  CreateCoursePayload,
  Enrollment,
} from '@/features/courses/services/mutations/types';
import type { Course } from '@/features/courses/types';
import type { Response } from '@/types';

export const useCreateCourseMutation = () => {
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation({
    mutationFn: async (payload: CreateCoursePayload) => {
      const response = await _request.post<Course>('/courses', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CourseKeys.GetCourseQuery],
      });
    },
  });
};

export const useEnrollCourseMutation = () => {
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation({
    mutationFn: async (courseId: string) => {
      const response = await _request.post<Response<Enrollment>>(
        '/enrollments',
        { courseId },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CourseKeys.GetCourseQuery],
      });
    },
  });
};

export const useUpdateCourseMutation = (courseId: string) => {
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation({
    mutationFn: async (payload: Partial<CreateCoursePayload>) => {
      const response = await _request.put<Response<Course>>(
        `/courses/${courseId}`,
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CourseKeys.GetCourseQuery],
      });
      queryClient.invalidateQueries({
        queryKey: [CourseKeys.GetCourseById, courseId],
      });
    },
  });
};
export const usePublishCourseMutation = (courseId: string) => {
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation({
    mutationFn: async (payload: { status: 'DRAFT' | 'ACTIVE' }) => {
      const response = await _request.patch<Response<Course>>(
        `/courses/${courseId}/status`,
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CourseKeys.GetCourseQuery],
      });
      queryClient.invalidateQueries({
        queryKey: [CourseKeys.GetCourseById, courseId],
      });
    },
  });
};
export const useDeleteCourseMutation = () => {
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation({
    mutationFn: async (courseId: string) => {
      const response = await _request.delete<Response<null>>(
        `/courses/${courseId}`,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CourseKeys.GetCourseQuery],
      });
    },
  });
};

export const useReorderModuleMutation = (courseId: string) => {
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation({
    mutationFn: async (moduleIds: string[]) => {
      const payload = moduleIds.map((moduleId) => ({
        moduleId,
        type: 'module',
      }));

      const response = await _request.patch<Course>(
        `/courses/${courseId}/reorder`,
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CourseKeys.GetCourseQuery],
      });
      queryClient.invalidateQueries({
        queryKey: [CourseKeys.GetCourseById, courseId],
      });
      queryClient.invalidateQueries({
        queryKey: [ModuleKeys.GetModulesByCourseQuery, courseId],
      });
    },
  });
};
