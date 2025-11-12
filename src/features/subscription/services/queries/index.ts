import { skipToken, useQuery } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';

import { SubscriptionKeys } from './keys';

import type { Subscription } from '../../types';
import type { DataTimestamp, PaginatedResponse } from '@/types';

// AUTHENTICATED USER & ADMIN
export const useGetSubscriptionsByUserQuery = (userId?: string) => {
  const _request = useAxios();

  return useQuery({
    queryKey: [SubscriptionKeys.GetSubscriptionsByUserQuery, userId],
    queryFn: userId
      ? async ({ signal }) => {
          const response = await _request.get<
            PaginatedResponse<Subscription & DataTimestamp>
          >(`/users/${userId}/subscriptions`, {
            signal,
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

// ADMIN
export const useGetSubscriptionsQuery = () => {
  const _request = useAxios();

  return useQuery({
    queryKey: [SubscriptionKeys.GetSubscriptionsQuery],
    queryFn: async ({ signal }) => {
      const response = await _request.get<
        PaginatedResponse<Subscription & DataTimestamp>
      >('/subscriptions', {
        signal,
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
