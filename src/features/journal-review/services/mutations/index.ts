import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';
import { JournalReviewKeys } from '@/features/journal-review/services/queries/keys';

import type {
  CreateChildReviewPayload,
  CreateChildReviewResponse,
  CreateRootReviewPayload,
  CreateRootReviewResponse,
  DeleteReviewPayload,
  PatchReviewPayload,
  PatchReviewResponse,
} from './types';

/**
 * Create a root review (review request) for a problem
 * POST /problems/{problemId}/problem-reviews
 */
export const useCreateRootReviewMutation = () => {
  const queryClient = useQueryClient();
  const _request = useAxios();

  return useMutation({
    mutationFn: async (payload: CreateRootReviewPayload) => {
      const { problemId, content } = payload;
      const response = await _request.post<CreateRootReviewResponse>(
        `/problems/${problemId}/problem-reviews`,
        { content },
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate queries to refetch updated data
      queryClient.invalidateQueries({
        queryKey: [
          JournalReviewKeys.GetRootReviewsByProblemQuery,
          variables.problemId,
        ],
      });
    },
  });
};

/**
 * Create a child review (reply to a review request)
 * POST /problem-reviews/{problemReviewId}/reviews
 */
export const useCreateChildReviewMutation = () => {
  const queryClient = useQueryClient();
  const _request = useAxios();

  return useMutation({
    mutationFn: async (payload: CreateChildReviewPayload) => {
      const { problemReviewId, ...data } = payload;
      const response = await _request.post<CreateChildReviewResponse>(
        `/problem-reviews/${problemReviewId}/reviews`,
        data,
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate SearchChildReviewsQuery with specific stepNumber
      const stepNumber = variables.stepNumber ?? null;
      queryClient.invalidateQueries({
        queryKey: [
          JournalReviewKeys.SearchChildReviewsQuery,
          variables.problemReviewId,
          { stepNumber },
        ],
      });
    },
  });
};

/**
 * Update/patch a review
 * PATCH /users/{userId}/problem-reviews/{problemReviewId}
 */
export const usePatchReviewMutation = () => {
  const queryClient = useQueryClient();
  const _request = useAxios();

  return useMutation({
    mutationFn: async (payload: PatchReviewPayload) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { userId, problemReviewId, rootReviewId, ...data } = payload;
      const response = await _request.patch<PatchReviewResponse>(
        `/users/${userId}/problem-reviews/${problemReviewId}`,
        data,
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate the specific review query
      queryClient.invalidateQueries({
        queryKey: [
          JournalReviewKeys.GetReviewByIdQuery,
          variables.userId,
          variables.problemReviewId,
        ],
      });
      // Also invalidate user's reviews list
      queryClient.invalidateQueries({
        queryKey: [
          JournalReviewKeys.GetRootReviewsByUserQuery,
          variables.userId,
        ],
      });
      // Invalidate SearchChildReviewsQuery with specific stepNumber using rootReviewId
      const stepNumber = variables.stepNumber ?? null;
      queryClient.invalidateQueries({
        queryKey: [
          JournalReviewKeys.SearchChildReviewsQuery,
          variables.rootReviewId,
          { stepNumber },
        ],
      });
    },
  });
};

/**
 * Delete a review
 * DELETE /users/{userId}/problem-reviews/{problemReviewId}
 */
export const useDeleteReviewMutation = () => {
  const queryClient = useQueryClient();
  const _request = useAxios();

  return useMutation({
    mutationFn: async (payload: DeleteReviewPayload) => {
      const { userId, problemReviewId } = payload;
      const response = await _request.delete(
        `/users/${userId}/problem-reviews/${problemReviewId}`,
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries after deletion
      queryClient.invalidateQueries({
        queryKey: [
          JournalReviewKeys.GetReviewByIdQuery,
          variables.userId,
          variables.problemReviewId,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          JournalReviewKeys.GetRootReviewsByUserQuery,
          variables.userId,
        ],
      });
      // Invalidate SearchChildReviewsQuery with specific stepNumber using rootReviewId
      const stepNumber = variables.stepNumber ?? null;
      queryClient.invalidateQueries({
        queryKey: [
          JournalReviewKeys.SearchChildReviewsQuery,
          variables.rootReviewId,
          { stepNumber },
        ],
      });
    },
  });
};
