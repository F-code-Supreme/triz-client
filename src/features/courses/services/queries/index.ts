import { skipToken, useQuery } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';
import useAuth from '@/features/auth/hooks/use-auth';
import { CourseKeys } from '@/features/courses/services/queries/keys';

import type { CourseEnrollResponse, CourseResponse } from './types';
import type { Course } from '@/features/courses/types';
import type { PaginationState } from '@tanstack/react-table';

export const useGetCourseQuery = (pagination?: PaginationState) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [CourseKeys.GetCourseQuery, pagination],
    queryFn: async () => {
      const response = await _request.get<CourseResponse>(`/courses`, {
        params: {
          page: pagination?.pageIndex,
          size: pagination?.pageSize,
          sort: 'status,asc',
        },
      });
      return response.data;
    },
  });
};

export const useGetCourseQueryUser = (pagination?: PaginationState) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [CourseKeys.GetCourseQuery, pagination],
    queryFn: async () => {
      const response = await _request.post<CourseResponse>(`/courses/search`, {
        status: 'ACTIVE',
        params: {
          page: pagination?.pageIndex,
          size: pagination?.pageSize,
          sort: 'status,asc',
        },
      });
      return response.data;
    },
  });
};

export const useGetMyEnrollmentsQuery = () => {
  const { isAuthenticated } = useAuth();
  const _request = useAxios();
  return useQuery({
    queryKey: [CourseKeys.GetCourseQuery, 'my-enrollments'],
    queryFn: isAuthenticated
      ? async () => {
          const response = await _request.get<CourseEnrollResponse>(
            '/enrollments/my-enrollments',
          );
          return response.data;
        }
      : skipToken,
  });
};

export const useGetCourseByIdQuery = (courseId?: string) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [CourseKeys.GetCourseById, courseId],
    queryFn: async () => {
      const response = await _request.get<Course>(`/courses/${courseId}`);
      return response.data;
    },
    enabled: !!courseId,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCourseProgressQuery = (courseId: string) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [CourseKeys.GetCourseProgress, courseId],
    queryFn: async () => {
      const response = await _request.get<{ percentCompleted: number }>(
        `/enrollments/course/${courseId}/progress`,
      );
      return response.data;
    },
    enabled: !!courseId,
  });
};
