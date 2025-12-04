import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table';
import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { DataTablePagination } from '@/components/data-table';
import { Button } from '@/components/ui/button';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { createAdminSubscriptionsColumns } from '@/features/subscription/components/admin-subscriptions-columns';
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
  const columns = useMemo(
    () => createAdminSubscriptionsColumns(handleAutoRenewalToggle),
    [handleAutoRenewalToggle],
  );

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
    <AdminLayout meta={{ title: 'Subscriptions' }}>
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
        <div className="space-y-4">
          {isLoading ? (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {Array.from({ length: pagination.pageSize }).map(
                    (_: unknown, cellIdx: number) => (
                      <TableRow key={cellIdx}>
                        {columns.map((_: unknown, idx: number) => (
                          <TableCell key={idx}>
                            <Skeleton className="h-8 w-full" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">
                {t('subscriptions.no_subscriptions')}
              </p>
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        {t('subscriptions.no_results')}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination Controls */}
          <DataTablePagination table={table} />
        </div>

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
