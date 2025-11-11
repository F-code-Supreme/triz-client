import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';

import { DataTableColumnHeader } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';

import type { Transaction } from '@/features/payment/transaction/types';
import type { DataTimestamp } from '@/types';

type TransactionWithTimestamp = Transaction & DataTimestamp;

const columnHelper = createColumnHelper<TransactionWithTimestamp>();

export const getTransactionTypeLabel = (type: string): string => {
  return type === 'TOPUP' ? 'Top Up' : 'Spend';
};

export const getTransactionTypeColor = (type: string): string => {
  return type === 'TOPUP' ? 'text-green-600' : 'text-red-600';
};

export const getTransactionStatusColor = (status: string): string => {
  switch (status) {
    case 'COMPLETED':
      return 'bg-green-100 text-green-800';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const transactionsColumns = [
  columnHelper.accessor('orderCode', {
    header: 'Order Code',
    cell: (info) => (
      <span className="font-mono text-sm">{info.getValue()}</span>
    ),
  }),

  columnHelper.accessor('type', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: (info) => {
      const type = info.getValue();
      const label = getTransactionTypeLabel(type);
      const color = getTransactionTypeColor(type);
      return <span className={`font-medium ${color}`}>{label}</span>;
    },
  }),

  columnHelper.accessor('amount', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: (info) => {
      const amount = info.getValue();
      const type = info.row.original.type;
      return (
        <span className={type === 'TOPUP' ? 'text-green-600' : 'text-red-600'}>
          {type === 'TOPUP' ? '+' : '-'}
          {amount.toLocaleString()} VND
        </span>
      );
    },
  }),

  columnHelper.accessor('provider', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Provider" />
    ),
    cell: (info) => (
      <Badge variant="outline" className="capitalize">
        {info.getValue()?.toLowerCase() || 'Unknown'}
      </Badge>
    ),
  }),

  columnHelper.accessor('status', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: (info) => {
      const status = info.getValue();
      const colors = getTransactionStatusColor(status);
      return <Badge className={colors}>{status}</Badge>;
    },
  }),

  columnHelper.accessor('createdAt', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: (info) => (
      <span className="text-sm">
        {format(new Date(info.getValue()), 'MMM dd, yyyy HH:mm')}
      </span>
    ),
  }),
];
