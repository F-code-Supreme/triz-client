import { useQuery } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';
import { CourseKeys } from '@/features/courses/services/queries/keys';

import type { CourseResponse } from './types';
import type { PaginationState } from '@tanstack/react-table';

export const useGetCourseQuery = (pagination: PaginationState) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [CourseKeys.GetCourseQuery, pagination],
    queryFn: async () => {
      const response = await _request.get<CourseResponse>(`/courses`, {
        params: {
          page: pagination.pageIndex,
          size: pagination.pageSize,
        },
      });

      return response.data;
    },
  });
};
