import { flexRender, type Table as ReactTable } from '@tanstack/react-table';

import { DataTablePagination, DataTableToolbar } from '@/components/data-table';
import { DateRangeFilter } from '@/components/data-table/date-range-filter';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import type { Transaction } from '@/features/payment/transaction/types';
import type { DataTimestamp } from '@/types';
import type { TFunction } from 'i18next';

interface AdminTransactionsTableProps {
  table: ReactTable<Transaction & DataTimestamp>;
  isLoading: boolean;
  totalRowCount: number;
  t: TFunction<'pages.admin', undefined>;
  pageSize: number;
  columnsLength: number;
  filters?: Array<{
    columnId: string;
    title: string;
    options: Array<{ label: string; value: string }>;
  }>;
  fromDate?: Date;
  toDate?: Date;
  onFromDateChange?: (date?: Date) => void;
  onToDateChange?: (date?: Date) => void;
}

export const AdminTransactionsTable = ({
  table,
  isLoading,
  totalRowCount,
  t,
  pageSize,
  columnsLength,
  filters = [],
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
}: AdminTransactionsTableProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <DataTableToolbar
          table={table}
          searchPlaceholder={t('transactions.search_placeholder')}
          searchKey="orderCode"
          filters={filters}
        />
        {onFromDateChange && onToDateChange && (
          <DateRangeFilter
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={onFromDateChange}
            onToDateChange={onToDateChange}
          />
        )}
      </div>

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
                (_: unknown, idx: number) => (
                  <TableRow key={idx}>
                    {Array.from({ length: columnsLength }).map(
                      (_: unknown, cellIdx: number) => (
                        <TableCell key={cellIdx}>
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
            {t('transactions.no_transactions')}
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
                    {t('transactions.no_results')}
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
