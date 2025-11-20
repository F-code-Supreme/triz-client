import { skipToken, useQuery } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';

import { SubscriptionKeys } from './keys';

import type { Subscription } from '../../types';
import type { DataTimestamp, PaginatedResponse } from '@/types';
import type { PaginationState, SortingState } from '@tanstack/react-table';

// AUTHENTICATED USER & ADMIN
export const useGetSubscriptionsByUserQuery = (
  pagination: PaginationState,
  sorting: SortingState,
  userId?: string,
) => {
  const _request = useAxios();

  return useQuery({
    queryKey: [
      SubscriptionKeys.GetSubscriptionsByUserQuery,
      userId,
      pagination,
      sorting,
    ],
    queryFn: userId
      ? async ({ signal }) => {
          const response = await _request.get<
            PaginatedResponse<Subscription & DataTimestamp>
          >(`/users/${userId}/subscriptions`, {
            signal,
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
          });

          return response.data;
        }
      : skipToken,
    enabled: !!userId,
  });
};

export const useGetUserSubscriptionByIdQuery = (
  userId?: string,
  subscriptionId?: string,
) => {
  const _request = useAxios();

  return useQuery({
    queryKey: [
      SubscriptionKeys.GetUserSubscriptionByIdQuery,
      userId,
      subscriptionId,
    ],
    queryFn:
      userId && subscriptionId
        ? async ({ signal }) => {
            const response = await _request.get<Subscription & DataTimestamp>(
              `/users/${userId}/subscriptions/${subscriptionId}`,
              {
                signal,
              },
            );

            return response.data;
          }
        : skipToken,
    enabled: !!userId && !!subscriptionId,
  });
};

export const useGetActiveSubscriptionByUserQuery = (userId?: string) => {
  const _request = useAxios();

  return useQuery({
    queryKey: [SubscriptionKeys.GetActiveSubscriptionByUserQuery, userId],
    queryFn: userId
      ? async ({ signal }) => {
          const response = await _request.get<Subscription & DataTimestamp>(
            `/users/${userId}/subscriptions/active`,
            {
              signal,
            },
          );

          return response.data;
        }
      : skipToken,
    enabled: !!userId,
  });
};

// export const useGetPreviewSubscriptionByUserQuery = (userId?: string) => {};

// ADMIN
export const useGetSubscriptionsQuery = (
  pagination: PaginationState,
  sorting: SortingState,
) => {
  const _request = useAxios();

  return useQuery({
    queryKey: [SubscriptionKeys.GetSubscriptionsQuery, pagination, sorting],
    queryFn: async ({ signal }) => {
      const response = await _request.get<
        PaginatedResponse<Subscription & DataTimestamp>
      >('/subscriptions', {
        signal,
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
      });

      return response.data;
    },
  });
};

export const useGetSubscriptionByIdQuery = (subscriptionId?: string) => {
  const _request = useAxios();

  return useQuery({
    queryKey: [SubscriptionKeys.GetSubscriptionByIdQuery, subscriptionId],
    queryFn: subscriptionId
      ? async ({ signal }) => {
          const response = await _request.get<Subscription & DataTimestamp>(
            `/subscriptions/${subscriptionId}`,
            {
              signal,
            },
          );

          return response.data;
        }
      : skipToken,
    enabled: !!subscriptionId,
  });
};
