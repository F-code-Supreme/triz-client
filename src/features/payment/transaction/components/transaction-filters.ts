import type { FilterOption } from '@/components/data-table';
import type { TFunction } from 'i18next';

export const getTransactionFilters = (
  t: TFunction<'pages.admin' | 'pages.wallet', undefined>,
): FilterOption[] => [
  {
    columnId: 'type',
    title: t('transactions.filters.transaction_type'),
    options: [
      { label: t('transactions.types.topup'), value: 'TOPUP' },
      { label: t('transactions.types.spend'), value: 'SPEND' },
      { label: t('transactions.types.refund'), value: 'REFUND' },
    ],
  },
  {
    columnId: 'status',
    title: t('transactions.filters.status'),
    options: [
      { label: t('transactions.status.pending'), value: 'PENDING' },
      { label: t('transactions.status.completed'), value: 'COMPLETED' },
      { label: t('transactions.status.cancelled'), value: 'CANCELLED' },
    ],
  },
  {
    columnId: 'provider',
    title: t('transactions.filters.provider'),
    options: [
      { label: t('transactions.providers.stripe'), value: 'STRIPE' },
      { label: t('transactions.providers.payos'), value: 'PAYOS' },
    ],
  },
];

const transactionFilters: FilterOption[] = [
  {
    columnId: 'type',
    title: 'Transaction Type',
    options: [
      { label: 'Top up', value: 'TOPUP' },
      { label: 'Spend', value: 'SPEND' },
      { label: 'Refund', value: 'REFUND' },
    ],
  },
  {
    columnId: 'status',
    title: 'Status',
    options: [
      { label: 'Pending', value: 'PENDING' },
      { label: 'Completed', value: 'COMPLETED' },
      { label: 'Cancelled', value: 'CANCELLED' },
    ],
  },
  {
    columnId: 'provider',
    title: 'Provider',
    options: [
      { label: 'Stripe', value: 'STRIPE' },
      { label: 'PayOS', value: 'PAYOS' },
    ],
  },
];

export default transactionFilters;
