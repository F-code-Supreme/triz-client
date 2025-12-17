import { skipToken, useQuery } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';

import { JournalReviewKeys } from './keys';

import type {
  GetChildReviewsByRootResponse,
  GetReviewByIdResponse,
  GetRootReviewsByProblemResponse,
  GetRootReviewsByUserResponse,
  SearchChildReviewsPayload,
  SearchChildReviewsResponse,
  SearchRootReviewsPayload,
  SearchRootReviewsResponse,
} from './types';
import type { PaginationState, SortingState } from '@tanstack/react-table';

/**
 * Get all root reviews (review requests) by problem ID
 * @param pagination - Pagination state
 * @param sorting - Sorting state
 * @param problemId - The ID of the problem
 */
export const useGetRootReviewsByProblemQuery = (
  pagination: PaginationState,
  sorting: SortingState,
  problemId?: string,
) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [
      JournalReviewKeys.GetRootReviewsByProblemQuery,
      problemId,
      pagination,
      sorting,
    ],
    queryFn: problemId
      ? async ({ signal }) => {
          const response = await _request.get<GetRootReviewsByProblemResponse>(
            `/problems/${problemId}/problem-reviews`,
            {
              params: {
                page: pagination.pageIndex,
                size: pagination.pageSize,
                sort:
                  sorting.length > 0
                    ? sorting
                        .map(({ id, desc }) => `${id},${desc ? 'desc' : 'asc'}`)
                        .join('&')
                    : undefined,
              },
              signal,
            },
          );
          return response.data;
        }
      : skipToken,
    enabled: !!problemId,
  });
};

/**
 * Get all root reviews (review requests) by user ID
 * @param pagination - Pagination state
 * @param sorting - Sorting state
 * @param userId - The ID of the user
 */
export const useGetRootReviewsByUserQuery = (
  pagination: PaginationState,
  sorting: SortingState,
  userId?: string,
) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [
      JournalReviewKeys.GetRootReviewsByUserQuery,
      userId,
      pagination,
      sorting,
    ],
    queryFn: userId
      ? async ({ signal }) => {
          const response = await _request.get<GetRootReviewsByUserResponse>(
            `/users/${userId}/problem-reviews`,
            {
              params: {
                page: pagination.pageIndex,
                size: pagination.pageSize,
                sort:
                  sorting.length > 0
                    ? sorting
                        .map(({ id, desc }) => `${id},${desc ? 'desc' : 'asc'}`)
                        .join('&')
                    : undefined,
              },
              signal,
            },
          );
          return response.data;
        }
      : skipToken,
    enabled: !!userId,
  });
};

/**
 * Get all child reviews for a specific root review (deprecated - use search instead)
 * @param pagination - Pagination state
 * @param sorting - Sorting state
 * @param problemReviewId - The ID of the parent problem review
 */
export const useGetChildReviewsByRootQuery = (
  pagination: PaginationState,
  sorting: SortingState,
  problemReviewId?: string,
) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [
      JournalReviewKeys.GetChildReviewsByRootQuery,
      problemReviewId,
      pagination,
      sorting,
    ],
    queryFn: problemReviewId
      ? async ({ signal }) => {
          const response = await _request.get<GetChildReviewsByRootResponse>(
            `/problem-reviews/${problemReviewId}/reviews`,
            {
              params: {
                page: pagination.pageIndex,
                size: pagination.pageSize,
                sort:
                  sorting.length > 0
                    ? sorting
                        .map(({ id, desc }) => `${id},${desc ? 'desc' : 'asc'}`)
                        .join('&')
                    : undefined,
              },
              signal,
            },
          );
          return response.data;
        }
      : skipToken,
    enabled: !!problemReviewId,
  });
};

/**
 * Get a specific review by user ID and review ID
 * @param userId - The ID of the user
 * @param problemReviewId - The ID of the problem review
 */
export const useGetReviewByIdQuery = (
  userId?: string,
  problemReviewId?: string,
) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [JournalReviewKeys.GetReviewByIdQuery, userId, problemReviewId],
    queryFn:
      userId && problemReviewId
        ? async ({ signal }) => {
            const response = await _request.get<GetReviewByIdResponse>(
              `/users/${userId}/problem-reviews/${problemReviewId}`,
              {
                signal,
              },
            );
            return response.data;
          }
        : skipToken,
    enabled: !!userId && !!problemReviewId,
  });
};

/**
 * Search all root reviews (expert/admin)
 * POST /problem-reviews/search
 * @param payload - Search criteria
 * @param pagination - Pagination state
 * @param sorting - Sorting state
 */
export const useSearchRootReviewsQuery = (
  payload: SearchRootReviewsPayload,
  pagination: PaginationState,
  sorting: SortingState,
) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [
      JournalReviewKeys.SearchRootReviewsQuery,
      payload,
      pagination,
      sorting,
    ],
    queryFn: async ({ signal }) => {
      const response = await _request.post<SearchRootReviewsResponse>(
        '/problem-reviews/search',
        payload,
        {
          page: pagination.pageIndex,
          size: pagination.pageSize,
          sort:
            sorting.length > 0
              ? sorting
                  .map(({ id, desc }) => `${id},${desc ? 'desc' : 'asc'}`)
                  .join('&')
              : undefined,
        },
        signal,
      );
      return response.data;
    },
  });
};

/**
 * Search all child reviews (grouped by stepNumber if specified)
 * POST /problem-reviews/{problemReviewId}/reviews/search
 * @param problemReviewId - The ID of the parent problem review
 * @param payload - Search criteria (stepNumber: 1-6 or null for all)
 * @param pagination - Pagination state
 * @param sorting - Sorting state
 */
export const useSearchChildReviewsQuery = (
  problemReviewId: string | undefined,
  payload: SearchChildReviewsPayload,
  pagination: PaginationState,
  sorting: SortingState,
) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [
      JournalReviewKeys.SearchChildReviewsQuery,
      problemReviewId,
      payload,
      pagination,
      sorting,
    ],
    queryFn: problemReviewId
      ? async ({ signal }) => {
          const response = await _request.post<SearchChildReviewsResponse>(
            `/problem-reviews/${problemReviewId}/reviews/search`,
            payload,
            {
              params: {
                page: pagination.pageIndex,
                size: pagination.pageSize,
                sort:
                  sorting.length > 0
                    ? sorting
                        .map(({ id, desc }) => `${id},${desc ? 'desc' : 'asc'}`)
                        .join('&')
                    : undefined,
              },
              signal,
            },
          );
          return response.data;
        }
      : skipToken,
    enabled: !!problemReviewId,
  });
};
