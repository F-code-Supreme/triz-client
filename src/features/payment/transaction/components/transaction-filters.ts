import type { FilterOption } from '@/components/data-table';

const transactionFilters: FilterOption[] = [
  {
    columnId: 'type',
    title: 'Transaction Type',
    options: [
      { label: 'Top up', value: 'TOPUP' },
      { label: 'Spend', value: 'SPEND' },
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
      { label: 'PayPal', value: 'PAYPAL' },
    ],
  },
];

export default transactionFilters;
