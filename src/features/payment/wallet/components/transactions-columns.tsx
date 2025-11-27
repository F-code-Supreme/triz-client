import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';

import { DataTableColumnHeader } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { TransactionsDataTableRowActions } from '@/features/payment/transaction/components/transactions-data-table-row-actions';

import type {
  Transaction,
  TransactionType,
} from '@/features/payment/transaction/types';
import type { DataTimestamp } from '@/types';

type TransactionWithTimestamp = Transaction & DataTimestamp;

const columnHelper = createColumnHelper<TransactionWithTimestamp>();

export const getTransactionTypeLabel = (type: TransactionType): string => {
  switch (type) {
    case 'TOPUP':
      return 'Top Up';
    case 'REFUND':
      return 'Refund';
    default:
      return 'Spend';
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

export const transactionsColumns = [
  columnHelper.accessor('id', {
    id: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: (info) => {
      const id = info.getValue();
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-[100px] truncate font-mono text-sm cursor-help">
                {id}
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-mono text-xs">
              {id}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    enableSorting: false,
    enableHiding: false,
  }),

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
      <DataTableColumnHeader column={column} title="Provider" />
    ),
    cell: (info) => (
      <Badge variant="outline" className="capitalize">
        {info.getValue()?.toLowerCase() || 'TRIZ'}
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

  columnHelper.display({
    id: 'actions',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => <TransactionsDataTableRowActions row={row} />,
    enableSorting: false,
    enableHiding: false,
  }),
];
