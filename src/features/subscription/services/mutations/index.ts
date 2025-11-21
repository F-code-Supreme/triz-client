import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';
import useAuth from '@/features/auth/hooks/use-auth';

import { SubscriptionKeys } from '../queries/keys';

import type {
  ICancelSubscriptionPayload,
  IEditAutoRenewalPayload,
  IPurchaseSubscriptionPayload,
  IPurchaseSubscriptionResponse,
} from './types';
import type { Subscription } from '../../types';
import type { DataTimestamp } from '@/types';

// AUTHENTICATED
export const usePurchasePackageMutation = () => {
  const { user } = useAuth();
  const _request = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: IPurchaseSubscriptionPayload) => {
      const { packageId, autoRenew } = payload;
      const response = await _request.post<IPurchaseSubscriptionResponse>(
        `/packages/${packageId}/subscriptions/purchase`,
        undefined,
        {
          autoRenew,
        },
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [SubscriptionKeys.GetSubscriptionsByUserQuery, user?.id],
      });
    },
  });
};

// AUTHENTICATED USER & ADMIN
export const useEditUserAutoRenewalMutation = () => {
  const _request = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: IEditAutoRenewalPayload) => {
      const { userId, subscriptionId, autoRenew } = payload;
      const response = await _request.patch<Subscription & DataTimestamp>(
        `/users/${userId}/subscriptions/${subscriptionId}`,
        {
          autoRenew,
        },
      );

      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          SubscriptionKeys.GetUserSubscriptionByIdQuery,
          variables.userId,
          variables.subscriptionId,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          SubscriptionKeys.GetSubscriptionsByUserQuery,
          variables.userId,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          SubscriptionKeys.GetSubscriptionByIdQuery,
          variables.subscriptionId,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [SubscriptionKeys.GetSubscriptionsQuery],
      });
    },
  });
};

export const useCancelSubscriptionMutation = () => {
  const _request = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ICancelSubscriptionPayload) => {
      const { userId, subscriptionId } = payload;
      const response = await _request.delete(
        `/users/${userId}/subscriptions/${subscriptionId}/cancel`,
      );

      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          SubscriptionKeys.GetUserSubscriptionByIdQuery,
          variables.userId,
          variables.subscriptionId,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          SubscriptionKeys.GetSubscriptionsByUserQuery,
          variables.userId,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          SubscriptionKeys.GetSubscriptionByIdQuery,
          variables.subscriptionId,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [SubscriptionKeys.GetSubscriptionsQuery],
      });
    },
  });
};

// export const useRefundSubscriptionMutation = () => {};

// ADMIN
export const useEditAutoRenewalMutation = () => {
  const _request = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Omit<IEditAutoRenewalPayload, 'userId'>) => {
      const { subscriptionId, autoRenew } = payload;
      const response = await _request.patch<Subscription & DataTimestamp>(
        `/subscriptions/${subscriptionId}`,
        {
          autoRenew,
        },
      );

      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          SubscriptionKeys.GetSubscriptionByIdQuery,
          variables.subscriptionId,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [SubscriptionKeys.GetSubscriptionsQuery],
      });
    },
  });
};
