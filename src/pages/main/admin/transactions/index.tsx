import {
  getCoreRowModel,
  useReactTable,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';

import transactionFilters from '@/features/payment/transaction/components/transaction-filters';
import { useSearchAllTransactionsQuery } from '@/features/payment/transaction/services/queries';
import { TransactionsTable } from '@/features/payment/wallet/components';
import { transactionsColumns } from '@/features/payment/wallet/components/transactions-columns';
import { AdminLayout } from '@/layouts/admin-layout';

const AdminTransactionsPage = () => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();

  // Build filters with date range
  const filters = useMemo(() => {
    // Remove existing fromDate and toDate filters
    const f = columnFilters.filter(
      (filter) => filter.id !== 'fromDate' && filter.id !== 'toDate',
    );
    // Add updated date range filters
    if (fromDate && toDate) {
      f.push(
        { id: 'fromDate', value: fromDate },
        { id: 'toDate', value: toDate },
      );
    }
    return f;
  }, [columnFilters, fromDate]);

  const { data: transactionsData, isLoading: transactionsLoading } =
    useSearchAllTransactionsQuery(pagination, sorting, filters);

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
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
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
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTransactionsPage;
