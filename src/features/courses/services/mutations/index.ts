import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';
import { CourseKeys } from '@/features/courses/services/queries/keys';

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
      const response = await _request.post<Response<Course>>(
        '/courses',
        payload,
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
