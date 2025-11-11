import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';

import { useGetAllTransactionsQuery } from '@/features/payment/transaction/services/queries';
import { TransactionsTable } from '@/features/payment/wallet/components';
import { transactionsColumns } from '@/features/payment/wallet/components/transactions-columns';
import { AdminLayout } from '@/layouts/admin-layout';

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
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data: transactionsData, isLoading: transactionsLoading } =
    useGetAllTransactionsQuery(pagination, sorting);

  // Get transactions from current page response
  const transactions = useMemo(
    () => transactionsData?.content || [],
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
      sorting,
    },
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    manualSorting: true,
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
            totalRowCount={totalRowCount}
            filters={transactionFilters}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTransactionsPage;
