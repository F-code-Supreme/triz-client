import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';

import { DataTableColumnHeader } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { TransactionsDataTableRowActions } from '@/features/payment/transaction/components/transactions-data-table-row-actions';

import type {
  Transaction,
  TransactionType,
} from '@/features/payment/transaction/types';
import type { DataTimestamp } from '@/types';
import type { TFunction } from 'i18next';

type TransactionWithTimestamp = Transaction & DataTimestamp;

const columnHelper = createColumnHelper<TransactionWithTimestamp>();

export const getTransactionTypeLabel = (
  type: TransactionType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: TFunction<'pages.admin', undefined> | ((key: string) => any),
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
      return 'text-green-600';
    case 'REFUND':
      return 'text-blue-600';
    default:
      return 'text-red-600';
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

export const transactionsColumns = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: TFunction<'pages.admin', undefined> | ((key: string) => any),
) => [
  columnHelper.accessor('orderCode', {
    header: t('transactions.columns.order_code'),
    cell: (info) => (
      <span className="font-mono text-sm">{info.getValue()}</span>
    ),
  }),

  columnHelper.accessor('type', {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t('transactions.columns.type')}
      />
    ),
    cell: (info) => {
      const type = info.getValue();
      const label = getTransactionTypeLabel(type, t);
      const color = getTransactionTypeColor(type);
      return <span className={`font-medium ${color}`}>{label}</span>;
    },
  }),

  columnHelper.accessor('amount', {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t('transactions.columns.amount')}
      />
    ),
    cell: (info) => {
      const amount = info.getValue();
      const type = info.row.original.type;
      return (
        <span
          className={
            type === 'TOPUP' || type === 'REFUND'
              ? 'text-green-600'
              : 'text-red-600'
          }
        >
          {type === 'TOPUP' || type === 'REFUND' ? '+' : '-'}
          {amount.toLocaleString()} VND
        </span>
      );
    },
  }),

  columnHelper.accessor('provider', {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t('transactions.columns.provider')}
      />
    ),
    cell: (info) => (
      <Badge variant="outline" className="capitalize">
        {info.getValue()?.toLowerCase() || 'TRIZ'}
      </Badge>
    ),
  }),

  columnHelper.accessor('status', {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t('transactions.columns.status')}
      />
    ),
    cell: (info) => {
      const status = info.getValue();
      const colors = getTransactionStatusColor(status);
      return <Badge className={colors}>{status}</Badge>;
    },
  }),

  columnHelper.accessor('createdAt', {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t('transactions.columns.date')}
      />
    ),
    cell: (info) => (
      <span className="text-sm">
        {format(new Date(info.getValue()), 'MMM dd, yyyy HH:mm')}
      </span>
    ),
  }),

  columnHelper.display({
    id: 'actions',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t('transactions.columns.actions')}
      />
    ),
    cell: ({ row }) => <TransactionsDataTableRowActions row={row} />,
    enableSorting: false,
    enableHiding: false,
  }),
];
