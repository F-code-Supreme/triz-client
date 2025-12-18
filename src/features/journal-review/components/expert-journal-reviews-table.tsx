import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';

import { DataTablePagination, DataTableToolbar } from '@/components/data-table';
import { AsyncSelect } from '@/components/ui/async-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useSearchRootReviewsQuery } from '@/features/journal-review/services/queries';
import { useSearchAllUsersQuery } from '@/features/user/services/queries';

import { expertJournalReviewsColumns } from './expert-journal-reviews-columns';
import { getReviewFilters } from './review-filters';

import type { SearchRootReviewsPayload } from '../services/queries/types';
import type { ReviewStatus } from '../types';
import type { IUser } from '@/features/user/types';
import type { ColumnFiltersState } from '@tanstack/react-table';

export const ExpertJournalReviewsTable = () => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<
    Array<{
      id: string;
      desc: boolean;
    }>
  >([]);
  const [columnFilters, setColumnFilters] = useState<
    Array<{
      id: string;
      value: unknown;
    }>
  >([]);
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({});
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [creatorId, setCreatorId] = useState<string>('');
  const [userSearchQuery, setUserSearchQuery] = useState<string>('');
  const [userSearchKey, setUserSearchKey] = useState<'email' | 'fullName'>(
    'email',
  );

  // Fetch users for creator filter with backend filtering
  const userFilters = useMemo(() => {
    if (!userSearchQuery) return [];
    return [
      {
        id: userSearchKey,
        value: userSearchQuery,
      },
    ] as ColumnFiltersState;
  }, [userSearchQuery, userSearchKey]);

  const { data: usersData } = useSearchAllUsersQuery(
    { pageIndex: 0, pageSize: 50 },
    [],
    userFilters,
  );

  const users = useMemo(() => usersData?.content || [], [usersData]);

  // Build search payload from filters
  const searchPayload: SearchRootReviewsPayload = useMemo(() => {
    const statusFilter = columnFilters.find((filter) => filter.id === 'status')
      ?.value as ReviewStatus[] | undefined;

    return {
      creatorId: creatorId || undefined,
      statuses: statusFilter,
      page: pagination.pageIndex,
      size: pagination.pageSize,
    };
  }, [columnFilters, pagination, creatorId]);

  const { data: reviewsData, isLoading } = useSearchRootReviewsQuery(
    searchPayload,
    pagination,
    sorting,
  );

  const reviews = useMemo(() => {
    return reviewsData?.content || [];
  }, [reviewsData]);

  const totalPages = useMemo(() => {
    return reviewsData?.page?.totalPages || 0;
  }, [reviewsData]);

  const reviewFilters = useMemo(() => getReviewFilters(), []);

  // Fetcher for AsyncSelect - trigger backend search
  const fetchUsers = async (query?: string) => {
    setUserSearchQuery(query || '');
    return users;
  };

  const table = useReactTable({
    data: reviews,
    columns: expertJournalReviewsColumns,
    pageCount: totalPages,
    manualPagination: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium whitespace-nowrap">
            Người tạo:
          </label>
          <Select
            value={userSearchKey}
            onValueChange={(value: 'email' | 'fullName') => {
              setUserSearchKey(value);
              setUserSearchQuery(''); // Reset search when changing key
            }}
          >
            <SelectTrigger className="h-10 w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="fullName">Họ tên</SelectItem>
            </SelectContent>
          </Select>
          <AsyncSelect<IUser>
            fetcher={fetchUsers}
            preload={false}
            renderOption={(user) => (
              <div className="flex flex-col">
                <span className="font-medium">
                  {user.fullName || user.email}
                </span>
                <span className="text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
            )}
            getOptionValue={(user) => user.id}
            getDisplayValue={(user) => (
              <span className="truncate">{user.fullName || user.email}</span>
            )}
            label="Tìm người dùng"
            placeholder="Chọn người yêu cầu..."
            value={creatorId}
            onChange={setCreatorId}
            width="300px"
            clearable={true}
          />
        </div>

        <div className="flex-1">
          <DataTableToolbar table={table} filters={reviewFilters} />
        </div>
      </div>

      {isLoading ? (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tiêu đề vấn đề</TableHead>
                <TableHead>Người yêu cầu</TableHead>
                <TableHead>Nội dung yêu cầu</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Đánh giá TB</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-[200px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[150px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[250px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[60px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[120px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[40px]" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <>
          <div className="rounded-md border">
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
                      colSpan={expertJournalReviewsColumns.length}
                      className="h-24 text-center"
                    >
                      Không có kết quả.
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
