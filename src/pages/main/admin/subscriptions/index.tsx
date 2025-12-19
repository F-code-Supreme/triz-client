import {
  getCoreRowModel,
  useReactTable,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table';
import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  useCreateAdminSubscriptionsColumns,
  AdminSubscriptionsTable,
} from '@/features/subscription/components';
import { useEditAutoRenewalMutation } from '@/features/subscription/services/mutations';
import { useGetSubscriptionsQuery } from '@/features/subscription/services/queries';
import { AdminLayout } from '@/layouts/admin-layout';

import type { Subscription } from '@/features/subscription/types';
import type { DataTimestamp } from '@/types';

const AdminSubscriptionsPage = () => {
  const { t } = useTranslation('pages.admin');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedSubscription, setSelectedSubscription] = useState<
    (Subscription & DataTimestamp) | null
  >(null);
  const [isAutoRenewalDialogOpen, setIsAutoRenewalDialogOpen] = useState(false);

  // Fetch subscriptions with pagination and sorting
  const { data: subscriptionsData, isLoading } = useGetSubscriptionsQuery(
    pagination,
    sorting,
  );

  // Mutations
  const { mutate: editAutoRenewal, isPending: isEditingAutoRenewal } =
    useEditAutoRenewalMutation();

  // Get subscriptions from response
  const subscriptions = useMemo(
    () => subscriptionsData?.content || [],
    [subscriptionsData],
  );

  const pageInfo = useMemo(() => subscriptionsData?.page, [subscriptionsData]);
  const totalRowCount = pageInfo?.totalElements ?? 0;

  // Handle auto-renewal toggle
  const handleAutoRenewalToggle = useCallback(
    (subscription: Subscription & DataTimestamp) => {
      setSelectedSubscription(subscription);
      setIsAutoRenewalDialogOpen(true);
    },
    [],
  );

  const confirmAutoRenewalToggle = useCallback(() => {
    if (selectedSubscription) {
      editAutoRenewal(
        {
          subscriptionId: selectedSubscription.id,
          autoRenew: !selectedSubscription.autoRenew,
        },
        {
          onSuccess: () => {
            setIsAutoRenewalDialogOpen(false);
            setSelectedSubscription(null);
          },
        },
      );
    }
  }, [selectedSubscription, editAutoRenewal]);

  // Create columns with auto-renewal callback
  const columns = useCreateAdminSubscriptionsColumns(handleAutoRenewalToggle);

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

  return (
    <AdminLayout meta={{ title: t('subscriptions.title') }}>
      <div className="flex flex-col gap-8 p-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('subscriptions.title')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('subscriptions.description')}
          </p>
        </div>

        {/* Subscriptions Table */}
        <AdminSubscriptionsTable
          table={table}
          isLoading={isLoading}
          totalRowCount={totalRowCount}
          t={t}
          pageSize={pagination.pageSize}
          columnsLength={columns.length}
        />

        {/* Auto Renewal Toggle Dialog */}
        <Dialog
          open={isAutoRenewalDialogOpen}
          onOpenChange={setIsAutoRenewalDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {t('subscriptions.auto_renewal.dialog_title')}
              </DialogTitle>
              <DialogDescription>
                {selectedSubscription?.autoRenew
                  ? t('subscriptions.auto_renewal.dialog_description_disable')
                  : t('subscriptions.auto_renewal.dialog_description_enable')}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAutoRenewalDialogOpen(false)}
              >
                {t('subscriptions.auto_renewal.cancel')}
              </Button>
              <Button
                type="button"
                onClick={confirmAutoRenewalToggle}
                disabled={isEditingAutoRenewal}
              >
                {isEditingAutoRenewal
                  ? t('subscriptions.auto_renewal.saving')
                  : t('subscriptions.auto_renewal.confirm')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminSubscriptionsPage;
