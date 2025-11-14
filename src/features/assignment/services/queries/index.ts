import { useQuery } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';
import { AssignmentKeys } from '@/features/assignment/services/queries/keys';

import type { AssignmentResponse } from '@/features/assignment/services/queries/types';

export const useGetAssignmentsQuery = (page?: number, size?: number) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [AssignmentKeys.GetAssignmentQuery, page, size],
    queryFn: async () => {
      const response = await _request.get<AssignmentResponse>('/assignments', {
        params: {
          page,
          size,
        },
      });

      return response.data;
    },
  });
};
