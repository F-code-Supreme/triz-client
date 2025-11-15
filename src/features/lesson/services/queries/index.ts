import { useQuery } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';
import { LessonKeys } from '@/features/lesson/services/queries/keys';

import type { LessonResponse } from '@/features/lesson/services/queries/types';

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
