import { useQuery } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';
import { CourseKeys } from '@/features/courses/services/queries/keys';

import type { CourseEnrollResponse, CourseResponse } from './types';
import { CourseDetailResponse } from '../../types';

export const useGetCourseQuery = () => {
  const _request = useAxios();
  return useQuery({
    queryKey: [CourseKeys.GetCourseQuery],
    queryFn: async () => {
      const response = await _request.get<CourseResponse>('/courses');
      return response.data;
    },
  });
};

export const useGetCourseByIdQuery = (courseId: string) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [CourseKeys.GetCourseQuery, courseId],
    queryFn: async () => {
      const response = await _request.get<CourseDetailResponse>(
        `/courses/${courseId}`,
      );
      return response.data;
    },
    enabled: !!courseId,
  });
};

export const useGetMyEnrollmentsQuery = () => {
  const _request = useAxios();
  return useQuery({
    queryKey: [CourseKeys.GetCourseQuery, 'my-enrollments'],
    queryFn: async () => {
      const response = await _request.get<CourseEnrollResponse>(
        '/enrollments/my-enrollments',
      );
      return response.data;
    },
  });
};
