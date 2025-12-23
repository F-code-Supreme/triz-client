import { useNavigate } from '@tanstack/react-router';
import {
  getCoreRowModel,
  useReactTable,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table';
import { AlertCircle, ArrowRight, X } from 'lucide-react';
import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import useAuth from '@/features/auth/hooks/use-auth';
import {
  useCreateSubscriptionsColumns,
  SubscriptionsTable,
} from '@/features/subscription/components';
import {
  useEditUserAutoRenewalMutation,
  useCancelSubscriptionMutation,
} from '@/features/subscription/services/mutations';
import {
  useGetActiveSubscriptionByUserQuery,
  useGetSubscriptionsByUserQuery,
} from '@/features/subscription/services/queries';
import { DefaultLayout } from '@/layouts/default-layout';
import { formatDate, formatNumber } from '@/utils';

import type { Subscription } from '@/features/subscription/types';

// eslint-disable-next-line sonarjs/cognitive-complexity
const SubscriptionPage = () => {
  const { t } = useTranslation('pages.subscription');
  const navigate = useNavigate();
  const { user } = useAuth();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [showAutoRenewalDialog, setShowAutoRenewalDialog] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null);

  const { data: subscriptionsData, isLoading } = useGetSubscriptionsByUserQuery(
    pagination,
    sorting,
    user?.id,
  );
  const { data: activeSubscription, isLoading: activeSubscriptionLoading } =
    useGetActiveSubscriptionByUserQuery(user?.id);
  const { mutate: editAutoRenewal, isPending: isUpdating } =
    useEditUserAutoRenewalMutation();
  const { mutate: cancelSubscription, isPending: isCancelingSubscription } =
    useCancelSubscriptionMutation();

  // Get subscriptions from response
  const subscriptions = useMemo(
    () => subscriptionsData?.content || [],
    [subscriptionsData],
  );

  const pageInfo = useMemo(() => subscriptionsData?.page, [subscriptionsData]);
  const totalRowCount = pageInfo?.totalElements ?? 0;

  // Define callback for auto renewal toggle
  const handleAutoRenewalToggle = useCallback((subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setShowAutoRenewalDialog(true);
  }, []);

  // Create columns with callback for auto renewal toggle
  const columns = useCreateSubscriptionsColumns(handleAutoRenewalToggle);

  // Create table instance with manual pagination
  const table = useReactTable({
    data: subscriptions,
    columns,
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

  const handleCancelSubscription = () => {
    if (!user || !activeSubscription) return;

    cancelSubscription(
      { userId: user.id, subscriptionId: activeSubscription.id },
      {
        onSuccess: () => {
          setIsCancelDialogOpen(false);
          toast.success(t('cancel_dialog.success'));
        },
        onError: (error) => {
          toast.error((error as Error).message || t('cancel_dialog.error'));
        },
      },
    );
  };

  const confirmAutoRenewalChange = () => {
    if (!selectedSubscription) return;

    editAutoRenewal(
      {
        subscriptionId: selectedSubscription.id,
        userId: user?.id || '',
        autoRenew: !selectedSubscription.autoRenew,
      },
      {
        onSuccess: () => {
          setShowAutoRenewalDialog(false);
          setSelectedSubscription(null);
        },
      },
    );
  };

  return (
    <DefaultLayout meta={{ title: t('page_meta_title') }}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
            <p className="text-muted-foreground mt-2">{t('description')}</p>
          </div>
          <Button
            variant="secondary"
            onClick={() => navigate({ to: '/refund' })}
            className="gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            {t('request_refund')}
          </Button>
        </div>

        {/* Active Subscription Card */}
        {activeSubscriptionLoading ? (
          <Card className="border-2 border-primary">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-96" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-8 w-32 mb-2" />
                    <Skeleton className="h-2 w-full" />
                    <Skeleton className="h-3 w-24 mt-1" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>

                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i}>
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : activeSubscription ? (
          <Card className="border-2 border-primary">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-2xl">
                    {activeSubscription.packageName}
                  </CardTitle>
                  <CardDescription>
                    {t('active_subscription.active_until')}{' '}
                    {formatDate(new Date(activeSubscription.endDate))}
                  </CardDescription>
                </div>
                <Badge className="bg-green-600 hover:bg-green-600/90">
                  {t('active_subscription.status_active')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Subscription Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t('active_subscription.daily_token_allowance')}
                    </p>
                    <p className="text-2xl font-bold mt-2">
                      {formatNumber(activeSubscription.tokensPerDayRemaining)} /{' '}
                      {formatNumber(activeSubscription.packageChatTokenPerDay)}
                    </p>
                    <Progress
                      value={
                        (activeSubscription.tokensPerDayRemaining /
                          activeSubscription.packageChatTokenPerDay) *
                        100
                      }
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.round(
                        (activeSubscription.tokensPerDayRemaining /
                          activeSubscription.packageChatTokenPerDay) *
                          100,
                      )}
                      % {t('active_subscription.remaining')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t('active_subscription.duration')}
                    </p>
                    <p className="text-lg font-semibold mt-1">
                      {Math.ceil(
                        (new Date(activeSubscription.endDate).getTime() -
                          new Date(activeSubscription.startDate).getTime()) /
                          (1000 * 60 * 60 * 24),
                      )}{' '}
                      {t('active_subscription.days')}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t('active_subscription.start_date')}
                    </p>
                    <p className="text-lg font-semibold mt-1">
                      {formatDate(new Date(activeSubscription.startDate))}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t('active_subscription.end_date')}
                    </p>
                    <p className="text-lg font-semibold mt-1">
                      {formatDate(new Date(activeSubscription.endDate))}
                    </p>
                  </div>
                </div>
              </div>

              {/* Auto Renewal Section */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="space-y-1">
                      <p className="font-semibold">
                        {t('active_subscription.auto_renewal')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activeSubscription.autoRenew
                          ? t('active_subscription.auto_renew_enabled_desc')
                          : t('active_subscription.auto_renew_disabled_desc')}
                      </p>
                    </div>
                    <Switch
                      checked={activeSubscription.autoRenew}
                      onCheckedChange={() =>
                        handleAutoRenewalToggle(activeSubscription)
                      }
                      disabled={isUpdating}
                    />
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => setIsCancelDialogOpen(true)}
                    disabled={isCancelingSubscription}
                    title={t('active_subscription.cancel_subscription')}
                  >
                    <X className="h-4 w-4" />
                    {t('active_subscription.cancel_subscription')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {t('active_subscription.no_active_visit_packages')}{' '}
              <a href="/packages" className="underline font-semibold">
                {t('active_subscription.packages_page')}
              </a>{' '}
              {t('active_subscription.to_get_started')}
            </AlertDescription>
          </Alert>
        )}

        {/* Subscription History */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {t('subscription_history.title')}
          </h2>
          <SubscriptionsTable
            table={table}
            isLoading={isLoading}
            totalRowCount={totalRowCount}
            t={t}
            pageSize={pagination.pageSize}
            columnsLength={columns.length}
            onAutoRenewalToggle={handleAutoRenewalToggle}
          />
        </div>
      </div>

      {/* Auto Renewal Confirmation Dialog */}
      <Dialog
        open={showAutoRenewalDialog}
        onOpenChange={setShowAutoRenewalDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedSubscription?.autoRenew
                ? t('auto_renewal_dialog.title_disable')
                : t('auto_renewal_dialog.title_enable')}
            </DialogTitle>
            <DialogDescription>
              {selectedSubscription?.autoRenew
                ? t('auto_renewal_dialog.disable_description')
                : t('auto_renewal_dialog.enable_description')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAutoRenewalDialog(false)}
              disabled={isUpdating}
            >
              {t('auto_renewal_dialog.cancel')}
            </Button>
            <Button
              onClick={confirmAutoRenewalChange}
              disabled={isUpdating}
              variant={
                selectedSubscription?.autoRenew ? 'destructive' : 'default'
              }
            >
              {isUpdating
                ? t('auto_renewal_dialog.updating')
                : t('auto_renewal_dialog.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Subscription Confirmation Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('cancel_dialog.title')}</DialogTitle>
            <DialogDescription>
              {t('cancel_dialog.description')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCancelDialogOpen(false)}
              disabled={isCancelingSubscription}
            >
              {t('cancel_dialog.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelSubscription}
              disabled={isCancelingSubscription}
            >
              {isCancelingSubscription
                ? t('cancel_dialog.canceling')
                : t('cancel_dialog.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DefaultLayout>
  );
};

export default SubscriptionPage;
