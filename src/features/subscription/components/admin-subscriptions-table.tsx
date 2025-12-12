import { flexRender, type Table as ReactTable } from '@tanstack/react-table';

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

import type { Subscription } from '@/features/subscription/types';
import type { DataTimestamp } from '@/types';
import type { TFunction } from 'i18next';

interface AdminSubscriptionsTableProps {
  table: ReactTable<Subscription & DataTimestamp>;
  isLoading: boolean;
  totalRowCount: number;
  t: TFunction<'pages.admin', undefined>;
  pageSize: number;
  columnsLength: number;
}

export const AdminSubscriptionsTable = ({
  table,
  isLoading,
  totalRowCount,
  t,
  pageSize,
  columnsLength,
}: AdminSubscriptionsTableProps) => {
  return (
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
              {Array.from({ length: pageSize }).map(
                (_: unknown, cellIdx: number) => (
                  <TableRow key={cellIdx}>
                    {Array.from({ length: columnsLength }).map(
                      (_: unknown, idx: number) => (
                        <TableCell key={idx}>
                          <Skeleton className="h-8 w-full" />
                        </TableCell>
                      ),
                    )}
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
        </div>
      ) : totalRowCount === 0 ? (
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
                    colSpan={columnsLength}
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
  );
};
