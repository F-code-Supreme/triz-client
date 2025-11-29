import { useMutation, useQuery } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';
import { AssignmentKeys } from '@/features/assignment/services/queries/keys';

import type {
  Assignment,
  AssignmentResponse,
  AssignmentSubmissionExpertReview,
  AssignmentSubmissionExpertReviewResponse,
  AssignmentSubmission,
  AssignmentSubmissionHistoryResponse,
  SubmitAssignmentPayload,
} from '@/features/assignment/services/queries/types';

//amdin
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

export const useGetAssignmentModuleQuery = (moduleId: string) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [AssignmentKeys.GetAssignmentQuery, moduleId],
    queryFn: async () => {
      const response = await _request.get<AssignmentResponse>(
        `/modules/${moduleId}/assignments`,
      );
      return response.data;
    },
    enabled: !!moduleId,
  });
};

export const useGetAssignmentSubmissionHistoryQuery = (
  userId?: string,
  assignmentId?: string,
) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [
      AssignmentKeys.GetAssignmentSubmissionHistoryQuery,
      userId,
      assignmentId,
    ],
    queryFn: async () => {
      const response = await _request.get<AssignmentSubmissionHistoryResponse>(
        `/asm-submissions/users/${userId}/assignments/${assignmentId}`,
      );
      return response.data;
    },
    enabled: !!userId && !!assignmentId,
  });
};

export const useSubmitAssignmentMutation = () => {
  const _request = useAxios();
  return useMutation({
    mutationFn: async (payload: SubmitAssignmentPayload) => {
      const response = await _request.post<AssignmentSubmission>(
        '/asm-submissions/submit',
        payload,
      );
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

// expert
export const useGetAssignmentsQueryExpert = (page?: number, size?: number) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [AssignmentKeys.GetAssignmentQuery, page, size],
    queryFn: async () => {
      const response =
        await _request.get<AssignmentSubmissionExpertReviewResponse>(
          '/asm-submissions',
          {
            params: {
              page,
              size,
            },
          },
        );

      return response.data;
    },
  });
};

export const useGetAssignmentByIdQueryExpert = (assignmentId?: string) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [AssignmentKeys.GetAssignmentById, assignmentId],
    queryFn: async () => {
      const response = await _request.get<AssignmentSubmissionExpertReview>(
        `/asm-submissions/${assignmentId}`,
      );
      return response.data;
    },
    enabled: !!assignmentId,
  });
};
