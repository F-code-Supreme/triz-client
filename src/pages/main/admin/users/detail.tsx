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
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useGetUserAchievementsQuery } from '@/features/achievement/services/queries';
import { getTransactionFilters } from '@/features/payment/transaction/components/transaction-filters';
import { useSearchAllTransactionsByUserQuery } from '@/features/payment/transaction/services/queries';
import {
  TransactionsTable,
  useTransactionsColumns,
} from '@/features/payment/wallet/components';
import { useGetWalletByUserQuery } from '@/features/payment/wallet/services/queries';
import {
  createSubscriptionsColumns,
  AdminSubscriptionsTable,
} from '@/features/subscription/components';
import { useCancelSubscriptionMutation } from '@/features/subscription/services/mutations';
import {
  useGetActiveSubscriptionByUserQuery,
  useGetSubscriptionsByUserQuery,
} from '@/features/subscription/services/queries';
import { roleColors } from '@/features/user/components/users-columns';
import { useGetUserByIdQuery } from '@/features/user/services/queries';
import { AdminLayout } from '@/layouts/admin-layout';
import { formatTrizilium } from '@/utils';

// eslint-disable-next-line sonarjs/cognitive-complexity
const AdminUserDetailPage = () => {
  const { t } = useTranslation('pages.admin');
  const { t: tWallet } = useTranslation('pages.wallet');
  const navigate = useNavigate();
  const { userId } = useParams({ from: '/admin/users/$userId' });

  const pageTitle = t('users.detail.title');

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [subscriptionPagination, setSubscriptionPagination] =
    useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });
  const [subscriptionSorting, setSubscriptionSorting] = useState<SortingState>(
    [],
  );
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [achievementPagination] = useState({ pageIndex: 0, pageSize: 100 });
  const [achievementSorting] = useState([{ id: 'earnedAt', desc: true }]);

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
  const { data: walletData } = useGetWalletByUserQuery(userId);

  // Fetch transactions
  const { data: transactionsData, isLoading: transactionsLoading } =
    useSearchAllTransactionsByUserQuery(pagination, sorting, userId, filters);

  // Fetch subscriptions
  const { data: subscriptionsData, isLoading: subscriptionsLoading } =
    useGetSubscriptionsByUserQuery(
      subscriptionPagination,
      subscriptionSorting,
      userId,
    );

  const { data: activeSubscription, isLoading: activeSubscriptionLoading } =
    useGetActiveSubscriptionByUserQuery(userId);

  const { data: achievementsData, isLoading: achievementsLoading } =
    useGetUserAchievementsQuery(
      userId,
      achievementPagination,
      achievementSorting,
    );

  const { mutate: cancelSubscription, isPending: isCancelingSubscription } =
    useCancelSubscriptionMutation();

  const subscriptions = useMemo(
    () => subscriptionsData?.content || [],
    [subscriptionsData],
  );

  const subscriptionsTotalRowCount =
    subscriptionsData?.page?.totalElements ?? 0;

  const transactions = useMemo(
    () => transactionsData?.content || [],
    [transactionsData],
  );

  const totalRowCount = transactionsData?.page?.totalElements ?? 0;

  // Get translated filters and columns
  const transactionFilters = useMemo(() => getTransactionFilters(t), [t]);
  const transactionColumns = useTransactionsColumns();

  const handleCancelSubscription = () => {
    if (!userId || !activeSubscription) return;

    cancelSubscription(
      { userId: userId, subscriptionId: activeSubscription.id },
      {
        onSuccess: () => {
          setIsCancelDialogOpen(false);
          toast.success(t('users.detail.cancel_dialog.success'));
        },
        onError: (error) => {
          toast.error(
            (error as Error).message || t('users.detail.cancel_dialog.error'),
          );
        },
      },
    );
  };

  const table = useReactTable({
    data: transactions,
    columns: transactionColumns,
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

  const subscriptionTable = useReactTable({
    data: subscriptions,
    columns: createSubscriptionsColumns(() => {}),
    state: {
      pagination: subscriptionPagination,
      sorting: subscriptionSorting,
    },
    onPaginationChange: setSubscriptionPagination,
    onSortingChange: setSubscriptionSorting,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    rowCount: subscriptionsTotalRowCount,
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
              {t('users.detail.back')}
            </Button>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
            </div>
          </div>

          {/* User Information Card Skeleton */}
          <Card>
            <CardHeader>
              <CardTitle>{t('users.detail.user_information')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-8">
                {/* Avatar Skeleton */}
                <div className="flex flex-col items-center">
                  <Skeleton className="h-24 w-24 rounded-full" />
                </div>

                {/* Details Skeleton */}
                <div className="flex-1 grid grid-cols-1 gap-6 md:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i}>
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Subscription Card Skeleton */}
          <Card className="border-2 border-primary">
            <CardHeader>
              <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Subscription History Card Skeleton */}
          <Card>
            <CardHeader>
              <CardTitle>{t('users.detail.subscription_history')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-96 w-full" />
            </CardContent>
          </Card>

          {/* Transaction Card Skeleton */}
          <Card>
            <CardHeader>
              <CardTitle>{t('users.detail.transaction_history')}</CardTitle>
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
          <p className="text-muted-foreground">
            {t('users.detail.customer_not_found')}
          </p>
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
            {t('users.detail.back')}
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
            <CardTitle>{t('users.detail.user_information')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-8">
              {/* Avatar Section */}
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={userData.avatarUrl}
                    alt={userData.fullName || userData.email}
                  />
                  <AvatarFallback className="text-lg font-semibold">
                    {(userData.fullName || userData.email)
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* User Details Grid */}
              <div className="flex-1 grid grid-cols-1 gap-6 md:grid-cols-3">
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
                <div>
                  <p className="text-sm text-muted-foreground">
                    Wallet Balance
                  </p>
                  <p className="text-base font-medium">
                    {walletData ? formatTrizilium(walletData.balance) : 0}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements Card */}
        <Card>
          <CardHeader>
            <CardTitle>
              Thành tựu ({achievementsData?.page.totalElements || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {achievementsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-28 w-full" />
                ))}
              </div>
            ) : achievementsData && achievementsData.content.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {achievementsData.content.map((achievement) => (
                  <TooltipProvider key={achievement.achievementId}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                          {achievement.achievementImageUrl ? (
                            <img
                              src={achievement.achievementImageUrl}
                              alt={achievement.achievementName}
                              className="w-16 h-16 object-contain rounded-full hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="text-4xl">🏆</div>
                          )}
                          <p className="text-xs text-center line-clamp-2 font-medium">
                            {achievement.achievementName}
                          </p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="space-y-1">
                          <p className="font-semibold">
                            {achievement.achievementName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {achievement.achievementDescription}
                          </p>
                          {achievement.bookTitle && (
                            <p className="text-xs text-muted-foreground">
                              Sách: {achievement.bookTitle}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Đạt được:{' '}
                            {new Date(
                              achievement.earnedAt,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            ) : (
              <div className="text-center text-sm text-muted-foreground py-8">
                Chưa có thành tựu nào được đạt được.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Subscription Card */}
        {activeSubscriptionLoading ? (
          <Card className="border-2 border-primary">
            <CardHeader>
              <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : activeSubscription ? (
          <Card className="border-2 border-primary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{activeSubscription.packageName}</CardTitle>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsCancelDialogOpen(true)}
                  disabled={isCancelingSubscription}
                >
                  {isCancelingSubscription
                    ? t('users.detail.cancel_dialog.canceling')
                    : t('users.detail.cancel_subscription')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="text-base font-semibold">
                    {new Date(
                      activeSubscription.startDate,
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p className="text-base font-semibold">
                    {new Date(activeSubscription.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Auto Renewal</p>
                  <Badge
                    variant={
                      activeSubscription.autoRenew ? 'default' : 'secondary'
                    }
                    className="mt-1"
                  >
                    {activeSubscription.autoRenew ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className="mt-1 bg-green-600 hover:bg-green-600/90">
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-muted">
            <CardHeader>
              <CardTitle>{t('users.detail.active_subscription')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('users.detail.no_active_subscription')}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Subscription History Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t('users.detail.subscription_history')}</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminSubscriptionsTable
              table={subscriptionTable}
              isLoading={subscriptionsLoading}
              totalRowCount={subscriptionsTotalRowCount}
              t={t}
              pageSize={subscriptionPagination.pageSize}
              columnsLength={createSubscriptionsColumns(() => {}).length}
            />
          </CardContent>
        </Card>

        {/* Transactions Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t('users.detail.transaction_history')}</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionsTable
              table={table}
              isLoading={transactionsLoading}
              totalRowCount={totalRowCount}
              t={tWallet}
              pageSize={pagination.pageSize}
              columnsLength={transactionColumns.length}
              filters={transactionFilters}
              fromDate={fromDate}
              toDate={toDate}
              onFromDateChange={setFromDate}
              onToDateChange={setToDate}
            />
          </CardContent>
        </Card>

        {/* Cancel Subscription Dialog */}
        <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('users.detail.cancel_dialog.title')}</DialogTitle>
              <DialogDescription>
                {t('users.detail.cancel_dialog.description')}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCancelDialogOpen(false)}
                disabled={isCancelingSubscription}
              >
                {t('common.cancel')}
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancelSubscription}
                disabled={isCancelingSubscription}
              >
                {isCancelingSubscription
                  ? t('users.detail.cancel_dialog.canceling')
                  : t('users.detail.cancel_dialog.confirm')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminUserDetailPage;
