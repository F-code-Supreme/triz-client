import { useQuery } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';
import { AssignmentKeys } from '@/features/assignment/services/queries/keys';

import type { Assignment, AssignmentResponse } from '@/features/assignment/services/queries/types';

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
export const useGetAssignmentByIdQuery = (assignmentId?: string) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [AssignmentKeys.GetAssignmentById, assignmentId],
    queryFn: async () => {
      const response = await _request.get<Assignment>(
        `/assignments/${assignmentId}`,
      );
      return response.data;
    },
    enabled: !!assignmentId,
  });
};
export const useGetAssignmentsByModuleQuery = (moduleId: string) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [AssignmentKeys.GetAssignmentsByModuleQuery, moduleId],
    queryFn: async () => {
      const response = await _request.get<AssignmentResponse>(
        `/modules/${moduleId}/assignments`,
      );

      return response.data;
    },
    enabled: !!moduleId,
  });
};
