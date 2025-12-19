/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SubscriptionStatus } from '../types';
import type { TFunction } from 'i18next';

export const getSubscriptionStatusColor = (
  status: SubscriptionStatus,
): string => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800 hover:bg-green-100/90';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/90';
    case 'EXPIRED':
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100/90';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800 hover:bg-red-100/90';
    case 'REFUNDED':
      return 'bg-purple-100 text-purple-800 hover:bg-purple-100/90';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100/90';
  }
};

export const getAdminSubscriptionStatusLabel = (
  status: SubscriptionStatus,
  t: TFunction<'pages.admin', undefined>,
): string => {
  switch (status) {
    case 'ACTIVE':
      return t('subscriptions.status.active');
    case 'PENDING':
      return t('subscriptions.status.pending');
    case 'EXPIRED':
      return t('subscriptions.status.expired');
    case 'CANCELLED':
      return t('subscriptions.status.canceled');
    case 'REFUNDED':
      return t('subscriptions.status.refunded');
    default:
      return status;
  }
};

export const getSubscriptionStatusLabel = (
  status: SubscriptionStatus,
  t: TFunction<'pages.subscription', undefined>,
): string => {
  switch (status) {
    case 'ACTIVE':
      return t('subscription_history.status.ACTIVE');
    case 'PENDING':
      return t('subscription_history.status.PENDING');
    case 'EXPIRED':
      return t('subscription_history.status.EXPIRED');
    case 'CANCELLED':
      return t('subscription_history.status.CANCELLED');
    case 'REFUNDED':
      return t('subscription_history.status.REFUNDED');
    default:
      return status;
  }
};
