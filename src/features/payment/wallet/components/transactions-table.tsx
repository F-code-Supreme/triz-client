import { flexRender, type Table } from '@tanstack/react-table';

import { DataTablePagination, DataTableToolbar } from '@/components/data-table';
import { DateRangeFilter } from '@/components/data-table/date-range-filter';
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { transactionsColumns } from './transactions-columns';

import type { Transaction } from '@/features/payment/transaction/types';
import type { DataTimestamp } from '@/types';

type TransactionWithTimestamp = Transaction & DataTimestamp;

interface TransactionsTableProps {
  table: Table<TransactionWithTimestamp>;
  isLoading: boolean;
  totalRowCount: number;
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

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  table,
  isLoading,
  filters = [],
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
}) => (
  <div className="space-y-4">
    <div className="flex flex-col sm:flex-row gap-2 items-center">
      <DataTableToolbar
        table={table}
        searchPlaceholder="Search transactions..."
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
                  {transactionsColumns.map((_, cellIdx) => (
                    <TableCell key={cellIdx}>
                      <div className="h-8 bg-muted animate-pulse rounded w-full"></div>
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
        <p className="text-muted-foreground">No transactions found</p>
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
                  colSpan={transactionsColumns.length}
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

    {/* Pagination Controls - Show only when not loading and have data */}
    <DataTablePagination table={table} />
  </div>
);
