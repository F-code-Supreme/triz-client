import {
  getCoreRowModel,
  useReactTable,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getTransactionFilters } from '@/features/payment/transaction/components/transaction-filters';
import { useSearchAllTransactionsQuery } from '@/features/payment/transaction/services/queries';
import {
  AdminTransactionsTable,
  AdminOutOfAppTransactionsTable,
  useAdminTransactionsColumns,
  useAdminOutOfAppTransactionsColumns,
} from '@/features/payment/wallet/components';
import { AdminLayout } from '@/layouts/admin-layout';

const AdminTransactionsPage = () => {
  const { t } = useTranslation('pages.admin');
  const [activeTab, setActiveTab] = useState<'in-app' | 'out-of-app'>('in-app');

  // In-app state
  const [inAppColumnFilters, setInAppColumnFilters] =
    useState<ColumnFiltersState>([]);
  const [inAppPagination, setInAppPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [inAppSorting, setInAppSorting] = useState<SortingState>([]);
  const [inAppFromDate, setInAppFromDate] = useState<Date | undefined>();
  const [inAppToDate, setInAppToDate] = useState<Date | undefined>();

  // Out-of-app state
  const [outOfAppColumnFilters, setOutOfAppColumnFilters] =
    useState<ColumnFiltersState>([]);
  const [outOfAppPagination, setOutOfAppPagination] = useState<PaginationState>(
    {
      pageIndex: 0,
      pageSize: 10,
    },
  );
  const [outOfAppSorting, setOutOfAppSorting] = useState<SortingState>([]);
  const [outOfAppFromDate, setOutOfAppFromDate] = useState<Date | undefined>();
  const [outOfAppToDate, setOutOfAppToDate] = useState<Date | undefined>();

  // Build in-app filters with date range
  const inAppFilters = useMemo(() => {
    const f = inAppColumnFilters.filter(
      (filter) => filter.id !== 'fromDate' && filter.id !== 'toDate',
    );
    if (inAppFromDate && inAppToDate) {
      f.push(
        { id: 'fromDate', value: inAppFromDate },
        { id: 'toDate', value: inAppToDate },
      );
    }
    return f;
  }, [inAppColumnFilters, inAppFromDate, inAppToDate]);

  // Build out-of-app filters with date range and hardcoded TOPUP type
  const outOfAppFilters = useMemo(() => {
    const f = outOfAppColumnFilters.filter(
      (filter) =>
        filter.id !== 'fromDate' &&
        filter.id !== 'toDate' &&
        filter.id !== 'type',
    );
    // Always filter by TOPUP for out-of-app
    f.push({ id: 'type', value: ['TOPUP'] });
    if (outOfAppFromDate && outOfAppToDate) {
      f.push(
        { id: 'fromDate', value: outOfAppFromDate },
        { id: 'toDate', value: outOfAppToDate },
      );
    }
    return f;
  }, [outOfAppColumnFilters, outOfAppFromDate, outOfAppToDate]);

  // Queries
  const { data: inAppTransactionsData, isLoading: inAppTransactionsLoading } =
    useSearchAllTransactionsQuery(inAppPagination, inAppSorting, inAppFilters);

  const {
    data: outOfAppTransactionsData,
    isLoading: outOfAppTransactionsLoading,
  } = useSearchAllTransactionsQuery(
    outOfAppPagination,
    outOfAppSorting,
    outOfAppFilters,
  );

  // Data
  const inAppTransactions = useMemo(
    () => inAppTransactionsData?.content || [],
    [inAppTransactionsData],
  );
  const outOfAppTransactions = useMemo(
    () => outOfAppTransactionsData?.content || [],
    [outOfAppTransactionsData],
  );

  const inAppTotalRowCount = inAppTransactionsData?.page?.totalElements ?? 0;
  const outOfAppTotalRowCount =
    outOfAppTransactionsData?.page?.totalElements ?? 0;

  // Get translated filters and columns
  const inAppTransactionFilters = useMemo(() => getTransactionFilters(t), [t]);
  // Remove type filter for out-of-app
  const outOfAppTransactionFilters = useMemo(
    () => getTransactionFilters(t).filter((f) => f.columnId !== 'type'),
    [t],
  );

  const inAppColumns = useAdminTransactionsColumns();
  const outOfAppColumns = useAdminOutOfAppTransactionsColumns();

  // Create table instances
  const inAppTable = useReactTable({
    data: inAppTransactions,
    columns: inAppColumns,
    state: {
      columnFilters: inAppColumnFilters,
      pagination: inAppPagination,
      sorting: inAppSorting,
    },
    onColumnFiltersChange: setInAppColumnFilters,
    onPaginationChange: setInAppPagination,
    onSortingChange: setInAppSorting,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    rowCount: inAppTotalRowCount,
  });

  const outOfAppTable = useReactTable({
    data: outOfAppTransactions,
    columns: outOfAppColumns,
    state: {
      columnFilters: outOfAppColumnFilters,
      pagination: outOfAppPagination,
      sorting: outOfAppSorting,
    },
    onColumnFiltersChange: setOutOfAppColumnFilters,
    onPaginationChange: setOutOfAppPagination,
    onSortingChange: setOutOfAppSorting,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    rowCount: outOfAppTotalRowCount,
  });

  return (
    <AdminLayout meta={{ title: t('transactions.title') }}>
      <div className="flex flex-col gap-8 p-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('transactions.title')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('transactions.description')}
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as 'in-app' | 'out-of-app')
          }
        >
          <TabsList>
            <TabsTrigger value="in-app">
              {t('transactions.tabs.in_app')}
            </TabsTrigger>
            <TabsTrigger value="out-of-app">
              {t('transactions.tabs.out_of_app')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="in-app" className="mt-6">
            <AdminTransactionsTable
              table={inAppTable}
              isLoading={inAppTransactionsLoading}
              totalRowCount={inAppTotalRowCount}
              t={t}
              pageSize={inAppPagination.pageSize}
              columnsLength={inAppColumns.length}
              filters={inAppTransactionFilters}
              fromDate={inAppFromDate}
              toDate={inAppToDate}
              onFromDateChange={setInAppFromDate}
              onToDateChange={setInAppToDate}
            />
          </TabsContent>

          <TabsContent value="out-of-app" className="mt-6">
            <AdminOutOfAppTransactionsTable
              table={outOfAppTable}
              isLoading={outOfAppTransactionsLoading}
              totalRowCount={outOfAppTotalRowCount}
              t={t}
              pageSize={outOfAppPagination.pageSize}
              columnsLength={outOfAppColumns.length}
              filters={outOfAppTransactionFilters}
              fromDate={outOfAppFromDate}
              toDate={outOfAppToDate}
              onFromDateChange={setOutOfAppFromDate}
              onToDateChange={setOutOfAppToDate}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminTransactionsPage;
