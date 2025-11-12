import { useNavigate, useParams } from '@tanstack/react-router';
import {
  getCoreRowModel,
  useReactTable,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table';
import { ArrowLeft } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import transactionFilters from '@/features/payment/transaction/components/transaction-filters';
import { useSearchAllTransactionsByUserQuery } from '@/features/payment/transaction/services/queries';
import { transactionsColumns } from '@/features/payment/wallet/components/transactions-columns';
import { TransactionsTable } from '@/features/payment/wallet/components/transactions-table';
import { useGetWalletByUserQuery } from '@/features/payment/wallet/services/queries';
import { roleColors } from '@/features/user/components/users-columns';
import { useGetUserByIdQuery } from '@/features/user/services/queries';
import { AdminLayout } from '@/layouts/admin-layout';

const pageTitle = 'User Details';

const AdminUserDetailPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams({ from: '/admin/users/$userId' });

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
    const f = columnFilters.filter(
      (filter) => filter.id !== 'fromDate' && filter.id !== 'toDate',
    );
    if (fromDate) {
      f.push({ id: 'fromDate', value: fromDate });
    }
    if (toDate) {
      f.push({ id: 'toDate', value: toDate });
    }
    return f;
  }, [columnFilters, fromDate, toDate]);

  // Fetch user data
  const { data: userData, isLoading: userLoading } =
    useGetUserByIdQuery(userId);

  // Fetch wallet data
  const { data: walletData, isLoading: walletLoading } =
    useGetWalletByUserQuery(userId);

  // Fetch transactions
  const { data: transactionsData, isLoading: transactionsLoading } =
    useSearchAllTransactionsByUserQuery(pagination, sorting, userId, filters);

  const transactions = useMemo(
    () => transactionsData?.content || [],
    [transactionsData],
  );

  const totalRowCount = transactionsData?.page?.totalElements ?? 0;

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

  if (userLoading) {
    return (
      <AdminLayout meta={{ title: pageTitle }}>
        <div className="flex flex-col gap-8 p-8">
          {/* Back button skeleton */}
          <div className="flex flex-col gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: '/admin/users' })}
              className="w-fit"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
            </div>
          </div>

          {/* User Information Card Skeleton */}
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Wallet Card Skeleton */}
          <Card>
            <CardHeader>
              <CardTitle>Wallet Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-8 w-48" />
                </div>
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-10 w-64" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Card Skeleton */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-96 w-full" />
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  if (!userData) {
    return (
      <AdminLayout meta={{ title: pageTitle }}>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Customer not found</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout meta={{ title: pageTitle }}>
      <div className="flex flex-col gap-8 p-8">
        <div className="flex flex-col gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: '/admin/users' })}
            className="w-fit"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {userData.fullName || userData.email}
            </h1>
            <p className="text-muted-foreground mt-1">{userData.email}</p>
          </div>
        </div>

        {/* User Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">User ID</p>
                <p className="text-base font-medium font-mono truncate">
                  {userData.id}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-base font-medium break-all">
                  {userData.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="text-base font-medium">
                  {userData.fullName || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge
                  variant={userData.enabled ? 'default' : 'destructive'}
                  className="mt-1"
                >
                  {userData.enabled ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Roles</p>
                <div className="flex gap-1 flex-wrap mt-1">
                  <Badge
                    key={userData.roles}
                    variant="secondary"
                    className={`capitalize ${roleColors[userData.roles]}`}
                  >
                    {userData.roles}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wallet Card */}
        <Card>
          <CardHeader>
            <CardTitle>Wallet Information</CardTitle>
          </CardHeader>
          <CardContent>
            {walletLoading ? (
              <p className="text-muted-foreground">Loading wallet data...</p>
            ) : walletData ? (
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Wallet ID</p>
                  <p className="text-2xl font-bold font-mono">
                    {walletData.id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Balance</p>
                  <p className="text-3xl font-bold">
                    {walletData.balance.toLocaleString()} VND
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No wallet data</p>
            )}
          </CardContent>
        </Card>

        {/* Transactions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminUserDetailPage;
