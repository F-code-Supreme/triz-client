import { useQuery } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';
import { CourseKeys } from '@/features/courses/services/queries/keys';

import type { CourseResponse } from './types';

export const useGetCourseQuery = (page: number, size: number) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [CourseKeys.GetCourseQuery, page, size],
    queryFn: async () => {
      const response = await _request.get<CourseResponse>('/courses', {
        params: {
          page,
          size,
        },
      });

      return response.data;
    },
  });
};
