import { flexRender, type Table } from '@tanstack/react-table';

import { DataTablePagination } from '@/components/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import type { Subscription } from '../types';
import type { DataTimestamp } from '@/types';
import type { TFunction } from 'i18next';

type SubscriptionWithTimestamp = Subscription & DataTimestamp;

interface SubscriptionsTableProps {
  table: Table<SubscriptionWithTimestamp>;
  isLoading: boolean;
  totalRowCount: number;
  t: TFunction<'pages.subscription', undefined>;
  pageSize: number;
  columnsLength: number;
  onAutoRenewalToggle?: (subscription: Subscription) => void;
}

export const SubscriptionsTable: React.FC<SubscriptionsTableProps> = ({
  table,
  isLoading,
  totalRowCount,
  t,
  pageSize,
  columnsLength,
}) => {
  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="border rounded-md overflow-hidden">
          <UITable>
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
              {Array.from({ length: pageSize }).map((_, idx) => (
                <TableRow key={idx}>
                  {Array.from({ length: columnsLength }).map(
                    (_: unknown, cellIdx: number) => (
                      <TableCell key={cellIdx}>
                        <Skeleton className="h-8 w-full" />
                      </TableCell>
                    ),
                  )}
                </TableRow>
              ))}
            </TableBody>
          </UITable>
        </div>
      ) : totalRowCount === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">
            {t('subscription_history.no_subscriptions')}
          </p>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <UITable>
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
                    {t('subscription_history.no_results')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </UITable>
        </div>
      )}

      {/* Pagination Controls */}
      <DataTablePagination table={table} />
    </div>
  );
};
