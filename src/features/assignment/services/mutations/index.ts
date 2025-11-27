import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';
import { AssignmentKeys } from '@/features/assignment/services/queries/keys';
import { ModuleKeys } from '@/features/modules/services/queries/keys';

import type { CreateAssignmentPayload } from '@/features/assignment/services/mutations/types';
import type { Assignment } from '@/features/assignment/services/queries/types';
import type { Module } from '@/features/modules/types';

export const useCreateAssignmentMutation = (moduleId: string) => {
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation({
    mutationFn: async (payload: CreateAssignmentPayload) => {
      const response = await _request.post<Assignment>(
        `/modules/${moduleId}/assignments`,
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ModuleKeys.GetModulesById, moduleId],
      });
      queryClient.invalidateQueries({
        queryKey: [AssignmentKeys.GetAssignmentsByModuleQuery, moduleId],
      });
      queryClient.invalidateQueries({
        queryKey: [ModuleKeys.GetModulesByCourseQuery],
      });
    },
  });
};

export const useUpdateAssignmentMutation = (assignmentId: string) => {
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation({
    mutationFn: async (payload: Partial<CreateAssignmentPayload>) => {
      const response = await _request.put<Assignment>(
        `/assignments/${assignmentId}`,
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [AssignmentKeys.GetAssignmentById, assignmentId],
      });
      queryClient.invalidateQueries({
        queryKey: [AssignmentKeys.GetAssignmentsByModuleQuery],
      });
      queryClient.invalidateQueries({
        queryKey: [ModuleKeys.GetModulesByCourseQuery],
      });
    },
  });
};

export const useDeleteAssignmentMutation = (moduleId: string) => {
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation({
    mutationFn: async (assignmentId: string) => {
      const response = await _request.delete<Assignment>(
        `/assignments/${assignmentId}`,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [AssignmentKeys.GetAssignmentsByModuleQuery, moduleId],
      });
      queryClient.invalidateQueries({
        queryKey: [ModuleKeys.GetModulesById, moduleId],
      });
      queryClient.invalidateQueries({
        queryKey: [ModuleKeys.GetModulesByCourseQuery],
      });
    },
  });
};
export const useReorderAssignmentMutation = (moduleId: string) => {
  const _request = useAxios();
  return useMutation({
    mutationFn: async (assignmentIds: string[]) => {
      const payload = assignmentIds.map((id) => ({
        id,
        type: 'assignment',
      }));

      const response = await _request.patch<Module>(
        `/modules/${moduleId}/reorder`,
        payload,
      );
      return response.data;
    },
  });
};

// expert
export const useExpertReviewAssignmentMutation = (submissionId: string) => {
  const queryClient = useQueryClient();
  const _request = useAxios();
  return useMutation({
    mutationFn: async (payload: { passed: boolean; comment?: string }) => {
      const response = await _request.put(
        `/asm-submissions/${submissionId}/expert-grade`,
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [AssignmentKeys.GetAssignmentQuery],
      });
    },
  });
};
