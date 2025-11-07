import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { useMemo, useState } from 'react';

import { DataTablePagination, DataTableToolbar } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Table,
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
  transactions: Transaction[];
  isLoading: boolean;
  filters?: Array<{
    columnId: string;
    title: string;
    options: Array<{ label: string; value: string }>;
  }>;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  isLoading,
  filters = [],
}) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [dateRange, setDateRange] = useState<{
    from?: Date;
    to?: Date;
  }>({});

  const transactionsWithTimestamp = transactions as TransactionWithTimestamp[];

  // Memoize filtered transactions to prevent infinite re-renders
  const filteredTransactions = useMemo(() => {
    return transactionsWithTimestamp.filter((transaction) => {
      // Apply date range filter
      if (dateRange.from || dateRange.to) {
        const transactionDate = new Date(transaction.createdAt);

        if (dateRange.from && transactionDate < dateRange.from) {
          return false;
        }

        if (dateRange.to) {
          const toDate = new Date(dateRange.to);
          toDate.setHours(23, 59, 59, 999);
          if (transactionDate > toDate) {
            return false;
          }
        }
      }

      return true;
    });
  }, [transactionsWithTimestamp, dateRange]);

  const table = useReactTable({
    data: filteredTransactions,
    columns: transactionsColumns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleClearDateRange = () => {
    setDateRange({});
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 items-center">
        <DataTableToolbar
          table={table}
          searchPlaceholder="Search transactions..."
          searchKey="orderCode"
          filters={filters}
        />

        {/* Date Range Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto gap-2"
            >
              <Calendar className="h-4 w-4" />
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, 'MMM dd')} -{' '}
                    {format(dateRange.to, 'MMM dd')}
                  </>
                ) : (
                  format(dateRange.from, 'MMM dd, yyyy')
                )
              ) : (
                'Pick a date'
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-4 space-y-4">
              <div>
                <label className="text-sm font-medium">From Date</label>
                <input
                  type="date"
                  value={
                    dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : ''
                  }
                  onChange={(e) => {
                    setDateRange({
                      ...dateRange,
                      from: e.target.value
                        ? new Date(e.target.value)
                        : undefined,
                    });
                  }}
                  className="w-full px-2 py-1 border border-input rounded-md mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">To Date</label>
                <input
                  type="date"
                  value={dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : ''}
                  onChange={(e) => {
                    setDateRange({
                      ...dateRange,
                      to: e.target.value ? new Date(e.target.value) : undefined,
                    });
                  }}
                  className="w-full px-2 py-1 border border-input rounded-md mt-1"
                />
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={handleClearDateRange}
                className="w-full"
              >
                Clear Date Range
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="space-y-2 text-center">
            <div className="h-8 bg-muted animate-pulse rounded w-48"></div>
            <p className="text-muted-foreground">Loading transactions...</p>
          </div>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">No transactions found</p>
        </div>
      ) : (
        <>
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
                      colSpan={transactionsColumns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <DataTablePagination table={table} />
        </>
      )}
    </div>
  );
};
