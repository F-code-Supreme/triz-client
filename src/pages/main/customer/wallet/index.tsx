import { useSearch } from '@tanstack/react-router';
import {
  getCoreRowModel,
  useReactTable,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table';
import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import useAuth from '@/features/auth/hooks/use-auth';
import { getTransactionFilters } from '@/features/payment/transaction/components/transaction-filters';
import { useSearchAllTransactionsByUserQuery } from '@/features/payment/transaction/services/queries';
import {
  WalletBalanceCard,
  TopupDialog,
  TransactionsTable,
  useTransactionsColumns,
} from '@/features/payment/wallet/components';
import { useGetWalletByUserQuery } from '@/features/payment/wallet/services/queries';
import { DefaultLayout } from '@/layouts/default-layout';

const WalletPage = () => {
  const { t } = useTranslation('pages.wallet');
  const search = useSearch({ strict: false }) as {
    topup?: string;
    amount?: number;
  };
  const [topupOpen, setTopupOpen] = useState(false);
  const [topupAmount, setTopupAmount] = useState<number | undefined>();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const { user } = useAuth();

  // Auto-open topup dialog if query params present
  useEffect(() => {
    if (search?.topup === 'open') {
      setTopupAmount(search.amount);
      setTopupOpen(true);
    }
  }, [search]);

  // Build filters with date range
  const filters = useMemo(() => {
    // Remove existing fromDate and toDate filters
    const f = columnFilters.filter(
      (filter) => filter.id !== 'fromDate' && filter.id !== 'toDate',
    );
    // Add updated date range filters
    if (fromDate) {
      f.push({ id: 'fromDate', value: fromDate });
    }
    if (toDate) {
      f.push({ id: 'toDate', value: toDate });
    }
    return f;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnFilters, fromDate]);

  const { data: wallet, isLoading: walletLoading } = useGetWalletByUserQuery(
    user?.id,
  );

  const { data: transactionsData, isLoading: transactionsLoading } =
    useSearchAllTransactionsByUserQuery(pagination, sorting, user?.id, filters);

  // Get transactions from current page response
  const transactions = useMemo(
    () => transactionsData?.content || [],
    [transactionsData],
  );

  const totalRowCount = transactionsData?.page?.totalElements ?? 0;

  // Get translated filters and columns using hook
  const transactionFilters = useMemo(() => getTransactionFilters(t), [t]);
  const transactionColumns = useTransactionsColumns();

  // Create table instance with manual pagination
  const table = useReactTable({
    data: transactions,
    columns: transactionColumns,
    state: {
      columnFilters,
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    rowCount: totalRowCount,
  });

  return (
    <DefaultLayout meta={{ title: t('page_meta_title') }}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground mt-2">{t('description')}</p>
        </div>

        <WalletBalanceCard
          wallet={wallet}
          isLoading={walletLoading}
          onTopupClick={() => setTopupOpen(true)}
        />

        <div>
          <h2 className="text-2xl font-bold mb-4">{t('transactions.title')}</h2>
          <TransactionsTable
            table={table}
            isLoading={transactionsLoading}
            totalRowCount={totalRowCount}
            t={t}
            pageSize={pagination.pageSize}
            columnsLength={transactionColumns.length}
            filters={transactionFilters}
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
          />
        </div>

        <TopupDialog
          open={topupOpen}
          onOpenChange={setTopupOpen}
          initialAmount={topupAmount}
        />
      </div>
    </DefaultLayout>
  );
};

export default WalletPage;
