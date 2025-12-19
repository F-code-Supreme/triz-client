/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TFunction } from 'i18next';

export const getSubscriptionStatusColor = (status: string): string => {
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

export const getSubscriptionStatusLabel = (
  status: string,
  t:
    | TFunction<'pages.admin' | 'pages.subscription', undefined>
    | ((key: string) => any),
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
