import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { DataTableColumnHeader } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { TransactionsDataTableRowActions } from '@/features/payment/transaction/components/transactions-data-table-row-actions';
import { formatTriziliumShort } from '@/utils';

import {
  getTransactionStatusColor,
  getTransactionStatusLabel,
  getTransactionTypeColor,
  getTransactionTypeLabel,
  TRANSACTION_TYPE_COLORS,
} from '../utils';

import type { Transaction } from '@/features/payment/transaction/types';
import type { DataTimestamp } from '@/types';

type TransactionWithTimestamp = Transaction & DataTimestamp;

const columnHelper = createColumnHelper<TransactionWithTimestamp>();

// Customer transactions columns
export const useTransactionsColumns = () => {
  const { t } = useTranslation('pages.wallet');

  return useMemo(
    () => [
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
                  ? TRANSACTION_TYPE_COLORS.TOPUP
                  : TRANSACTION_TYPE_COLORS.SPEND
              }
            >
              {type === 'TOPUP' || type === 'REFUND' ? '+' : '-'}
              {formatTriziliumShort(amount)}
            </span>
          );
        },
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
          const label = getTransactionStatusLabel(status, t);
          return <Badge className={colors}>{label}</Badge>;
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
        cell: ({ row }) => (
          <TransactionsDataTableRowActions row={row} namespace="pages.wallet" />
        ),
        enableSorting: false,
        enableHiding: false,
      }),
    ],
    [t],
  );
};
