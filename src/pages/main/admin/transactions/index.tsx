import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type PaginationState,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';

import { useGetAllTransactionsQuery } from '@/features/payment/transaction/services/queries';
import { TransactionsTable } from '@/features/payment/wallet/components';
import { transactionsColumns } from '@/features/payment/wallet/components/transactions-columns';
import { AdminLayout } from '@/layouts/admin-layout';

import type { Transaction } from '@/features/payment/transaction/types';
import type { DataTimestamp } from '@/types';

type TransactionWithTimestamp = Transaction & DataTimestamp;

// Transaction type filter options
const transactionFilters = [
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
];

const AdminTransactionsPage = () => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: transactionsData, isLoading: transactionsLoading } =
    useGetAllTransactionsQuery(pagination);

  // Get transactions from current page response
  const transactions = useMemo(
    () => (transactionsData?.content || []) as TransactionWithTimestamp[],
    [transactionsData],
  );

  const totalRowCount = transactionsData?.page?.totalElements ?? 0;

  // Create table instance with manual pagination
  const table = useReactTable({
    data: transactions,
    columns: transactionsColumns,
    state: {
      columnFilters,
      pagination,
    },
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    rowCount: totalRowCount,
  });

  return (
    <AdminLayout meta={{ title: 'Transactions' }}>
      <div className="flex flex-col gap-8 p-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground mt-2">
            View and manage all system transactions
          </p>
        </div>

        <div>
          <TransactionsTable
            table={table}
            isLoading={transactionsLoading}
            pagination={pagination}
            totalRowCount={totalRowCount}
            filters={transactionFilters}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTransactionsPage;
