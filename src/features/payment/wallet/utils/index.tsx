import type {
  TransactionStatus,
  TransactionType,
} from '../../transaction/types';
import type { TFunction } from 'i18next';

export const TRANSACTION_TYPE_COLORS = {
  TOPUP: 'text-green-600',
  REFUND: 'text-blue-600',
  SPEND: 'text-red-600',
} as const;

export const getTransactionTypeLabel = (
  type: TransactionType,
  t: TFunction<'pages.admin' | 'pages.wallet', undefined>,
): string => {
  switch (type) {
    case 'TOPUP':
      return t('transactions.types.topup');
    case 'REFUND':
      return t('transactions.types.refund');
    default:
      return t('transactions.types.spend');
  }
};

export const getTransactionTypeColor = (type: TransactionType): string => {
  switch (type) {
    case 'TOPUP':
      return TRANSACTION_TYPE_COLORS.TOPUP;
    case 'REFUND':
      return TRANSACTION_TYPE_COLORS.REFUND;
    default:
      return TRANSACTION_TYPE_COLORS.SPEND;
  }
};

export const getTransactionStatusColor = (status: string): string => {
  switch (status) {
    case 'COMPLETED':
      return 'bg-green-100 text-green-800 hover:bg-green-100/90';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/90';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800 hover:bg-red-100/90';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100/90';
  }
};

export const getTransactionStatusLabel = (
  status: TransactionStatus,
  t: TFunction<'pages.admin' | 'pages.wallet', undefined>,
): string => {
  switch (status) {
    case 'COMPLETED':
      return t('transactions.status.completed');
    case 'PENDING':
      return t('transactions.status.pending');
    case 'CANCELLED':
      return t('transactions.status.cancelled');
    default:
      return status;
  }
};
