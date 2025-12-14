import { skipToken, useQuery } from '@tanstack/react-query';

import { request, useAxios } from '@/configs/axios';

import { AchievementKeys } from './keys';

import type {
  Achievement,
  AchievementResponse,
  UserAchievement,
  UserAchievementResponse,
} from '../../types';
import type { PaginationState, SortingState } from '@tanstack/react-table';

// PUBLIC
export const useGetActiveAchievementsQuery = (
  pagination?: PaginationState,
  sorting?: SortingState,
) => {
  return useQuery({
    queryKey: [
      AchievementKeys.GetActiveAchievementsQuery,
      pagination?.pageIndex,
      pagination?.pageSize,
      sorting,
    ],
    queryFn:
      pagination && sorting
        ? async ({ signal }) => {
            const response = await request.get<AchievementResponse>(
              '/achievements/public',
              {
                signal,
                params: {
                  page: pagination.pageIndex,
                  size: pagination.pageSize,
                  sort:
                    sorting.length > 0
                      ? sorting
                          .map(
                            ({ id, desc }) => `${id},${desc ? 'desc' : 'asc'}`,
                          )
                          .join('&')
                      : undefined,
                },
              },
            );

            return response.data;
          }
        : skipToken,
  });
};

// ADMIN
export const useGetAchievementsQuery = (
  pagination?: PaginationState,
  sorting?: SortingState,
) => {
  const _request = useAxios();

  return useQuery({
    queryKey: [
      AchievementKeys.GetAchievementsQuery,
      pagination?.pageIndex,
      pagination?.pageSize,
      sorting,
    ],
    queryFn:
      pagination && sorting
        ? async ({ signal }) => {
            const response = await _request.get<AchievementResponse>(
              '/achievements',
              {
                signal,
                params: {
                  page: pagination.pageIndex,
                  size: pagination.pageSize,
                  sort:
                    sorting.length > 0
                      ? sorting
                          .map(
                            ({ id, desc }) => `${id},${desc ? 'desc' : 'asc'}`,
                          )
                          .join('&')
                      : undefined,
                },
              },
            );

            return response.data;
          }
        : skipToken,
  });
};

export const useGetDeletedAchievementsQuery = (
  pagination?: PaginationState,
  sorting?: SortingState,
) => {
  const _request = useAxios();

  return useQuery({
    queryKey: [
      AchievementKeys.GetDeletedAchievementsQuery,
      pagination?.pageIndex,
      pagination?.pageSize,
      sorting,
    ],
    queryFn:
      pagination && sorting
        ? async ({ signal }) => {
            const response = await _request.get<AchievementResponse>(
              '/achievements/deleted',
              {
                signal,
                params: {
                  page: pagination.pageIndex,
                  size: pagination.pageSize,
                  sort:
                    sorting.length > 0
                      ? sorting
                          .map(
                            ({ id, desc }) => `${id},${desc ? 'desc' : 'asc'}`,
                          )
                          .join('&')
                      : undefined,
                },
              },
            );

            return response.data;
          }
        : skipToken,
  });
};

export const useGetAchievementByIdQuery = (achievementId?: string) => {
  const _request = useAxios();

  return useQuery({
    queryKey: [AchievementKeys.GetAchievementByIdQuery, achievementId],
    queryFn: achievementId
      ? async ({ signal }) => {
          const response = await _request.get<Achievement>(
            `/achievements/${achievementId}`,
            {
              signal,
            },
          );

          return response.data;
        }
      : skipToken,
    enabled: !!achievementId,
  });
};

// USER ACHIEVEMENTS
export const useGetUserAchievementsQuery = (
  userId?: string,
  pagination?: PaginationState,
  sorting?: SortingState,
) => {
  const _request = useAxios();

  return useQuery({
    queryKey: [
      AchievementKeys.GetUserAchievementsQuery,
      userId,
      pagination?.pageIndex,
      pagination?.pageSize,
      sorting,
    ],
    queryFn:
      userId && pagination && sorting
        ? async ({ signal }) => {
            const response = await _request.get<UserAchievementResponse>(
              `/users/${userId}/achievements`,
              {
                signal,
                params: {
                  page: pagination.pageIndex,
                  size: pagination.pageSize,
                  sort:
                    sorting.length > 0
                      ? sorting
                          .map(
                            ({ id, desc }) => `${id},${desc ? 'desc' : 'asc'}`,
                          )
                          .join('&')
                      : undefined,
                },
              },
            );

            return response.data;
          }
        : skipToken,
    enabled: !!userId,
  });
};

export const useGetUserUnreadAchievementsQuery = (
  userId?: string,
  options?: {
    refetchInterval?: number | false;
  },
) => {
  const _request = useAxios();

  return useQuery({
    queryKey: [AchievementKeys.GetUserUnreadAchievementsQuery, userId],
    queryFn: userId
      ? async ({ signal }) => {
          const response = await _request.get<UserAchievement[]>(
            `/users/${userId}/achievements/unread`,
            {
              signal,
            },
          );

          return response.data;
        }
      : skipToken,
    enabled: !!userId,
    refetchInterval: options?.refetchInterval,
  });
};
