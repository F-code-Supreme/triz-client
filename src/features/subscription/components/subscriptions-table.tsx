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

import { subscriptionsColumns } from './subscriptions-columns';

import type { Subscription } from '../types';
import type { DataTimestamp } from '@/types';

type SubscriptionWithTimestamp = Subscription & DataTimestamp;

interface SubscriptionsTableProps {
  table: Table<SubscriptionWithTimestamp>;
  isLoading: boolean;
  totalRowCount: number;
  onAutoRenewalToggle?: (subscription: Subscription) => void;
}

export const SubscriptionsTable: React.FC<SubscriptionsTableProps> = ({
  table,
  isLoading,
}) => (
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
            {Array.from({ length: table.getState().pagination.pageSize }).map(
              (_, idx) => (
                <TableRow key={idx}>
                  {subscriptionsColumns.map((_, cellIdx) => (
                    <TableCell key={cellIdx}>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ),
            )}
          </TableBody>
        </UITable>
      </div>
    ) : table.getRowModel().rows?.length === 0 ? (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">No subscriptions found</p>
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
                  colSpan={subscriptionsColumns.length}
                  className="h-24 text-center"
                >
                  No results.
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
