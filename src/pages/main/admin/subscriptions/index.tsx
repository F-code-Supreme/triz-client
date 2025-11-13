import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table';
import { useState, useMemo } from 'react';

import { DataTablePagination } from '@/components/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { adminSubscriptionsColumns } from '@/features/subscription/components/admin-subscriptions-columns';
import { useGetSubscriptionsQuery } from '@/features/subscription/services/queries';
import { AdminLayout } from '@/layouts/admin-layout';

const AdminSubscriptionsPage = () => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  // Fetch subscriptions with pagination and sorting
  const { data: subscriptionsData, isLoading } = useGetSubscriptionsQuery(
    pagination,
    sorting,
  );

  // Get subscriptions from response
  const subscriptions = useMemo(
    () => subscriptionsData?.content || [],
    [subscriptionsData],
  );

  const pageInfo = useMemo(() => subscriptionsData?.page, [subscriptionsData]);
  const totalRowCount = pageInfo?.totalElements ?? 0;

  // Create table instance with manual pagination
  const table = useReactTable({
    data: subscriptions,
    columns: adminSubscriptionsColumns,
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
          <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
          <p className="text-muted-foreground mt-2">
            View and manage all user subscriptions
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
                  {Array.from({ length: pagination.pageSize }).map((_, idx) => (
                    <TableRow key={idx}>
                      {adminSubscriptionsColumns.map((_, cellIdx) => (
                        <TableCell key={cellIdx}>
                          <Skeleton className="h-8 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">No subscriptions found</p>
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
                        colSpan={adminSubscriptionsColumns.length}
                        className="h-24 text-center"
                      >
                        No results.
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
      </div>
    </AdminLayout>
  );
};

export default AdminSubscriptionsPage;
