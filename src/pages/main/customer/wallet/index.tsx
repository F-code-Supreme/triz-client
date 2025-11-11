import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table';
import { useState, useMemo } from 'react';

import useAuth from '@/features/auth/hooks/use-auth';
import { useGetAllTransactionsByUserQuery } from '@/features/payment/transaction/services/queries';
import {
  WalletBalanceCard,
  TopupDialog,
  TransactionsTable,
} from '@/features/payment/wallet/components';
import { transactionsColumns } from '@/features/payment/wallet/components/transactions-columns';
import { useGetWalletByUserQuery } from '@/features/payment/wallet/services/queries';
import { DefaultLayout } from '@/layouts/default-layout';

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

const WalletPage = () => {
  const [topupOpen, setTopupOpen] = useState(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const { user } = useAuth();

  const { data: wallet, isLoading: walletLoading } = useGetWalletByUserQuery(
    user?.id,
  );

  const { data: transactionsData, isLoading: transactionsLoading } =
    useGetAllTransactionsByUserQuery(pagination, sorting, user?.id);

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
    <DefaultLayout meta={{ title: 'Wallet' }}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
          <p className="text-muted-foreground mt-2">
            Manage your wallet balance and view transaction history
          </p>
        </div>

        <WalletBalanceCard
          wallet={wallet}
          isLoading={walletLoading}
          onTopupClick={() => setTopupOpen(true)}
        />

        <div>
          <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
          <TransactionsTable
            table={table}
            isLoading={transactionsLoading}
            totalRowCount={totalRowCount}
            filters={transactionFilters}
          />
        </div>

        <TopupDialog open={topupOpen} onOpenChange={setTopupOpen} />
      </div>
    </DefaultLayout>
  );
};

export default WalletPage;
