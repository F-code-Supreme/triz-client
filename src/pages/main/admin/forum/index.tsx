import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';

import { DataTablePagination, DataTableToolbar } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
// tooltip not needed here; dialog extracted to CreatePostDialog
import CreatePostDialog from '@/features/forum/components/create-post-dialog';
import { forumpostsColumns } from '@/features/forum/components/forum-posts-columns';
import { useGetForumPostsByAdminQuery } from '@/features/forum/services/queries';
import { AdminLayout } from '@/layouts/admin-layout';

import type { FilterOption } from '@/components/data-table';
import type {
  ColumnFiltersState,
  PaginationState,
} from '@tanstack/react-table';

const AdminForumPostManage = () => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [sorting, setSorting] = useState<
    Array<{
      id: string;
      desc: boolean;
    }>
  >([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Build filters with date range
  const filters = useMemo(() => {
    // Remove existing fromDate and toDate filters
    const f = columnFilters.filter(
      (filter) => filter.id !== 'fromDate' && filter.id !== 'toDate',
    );

    return f;
  }, [columnFilters]);
  const forumPostFilters: FilterOption[] = [
    {
      columnId: 'status',
      title: 'Status',
      options: [
        { label: 'Công khai', value: 'ACTIVE' },
        { label: 'Chưa công khai', value: 'INACTIVE' },
      ],
    },
  ];

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: forumpostsData, isLoading } = useGetForumPostsByAdminQuery(
    pagination,
    sorting,
    filters,
  );
  const totalRowCount = forumpostsData?.page?.totalElements ?? 0;
  const forumPosts = useMemo(() => {
    const currentData = forumpostsData;
    return currentData?.content || [];
  }, [forumpostsData]);

  const table = useReactTable({
    data: forumPosts,
    columns: forumpostsColumns,
    state: {
      columnFilters,
      pagination,
      sorting,
    },
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    rowCount: totalRowCount,
  });

  // dialog handled by `CreatePostDialog`

  return (
    <AdminLayout meta={{ title: 'Forum Management' }}>
      <div className="flex flex-col gap-8 p-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Quản lý bài viết diễn đàn
            </h1>
            <p className="text-muted-foreground mt-2">
              Xem và quản lý tất cả bài viết trong diễn đàn tại đây.
            </p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm bài viết mới
          </Button>
        </div>

        <div className="space-y-4">
          <DataTableToolbar
            table={table}
            searchPlaceholder="Tìm theo tiêu đề..."
            searchKey="title"
            filters={forumPostFilters}
          />

          {isLoading ? (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 10 }).map((_, idx) => (
                    <TableRow key={idx}>
                      {forumpostsColumns.map((_, cellIdx) => (
                        <TableCell key={cellIdx}>
                          <Skeleton className="h-8 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : forumPosts.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">
                Không có bài viết nào trong diễn đàn
              </p>
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
                          colSpan={forumpostsColumns.length}
                          className="h-24 text-center"
                        >
                          Không có bài viết nào trong diễn đàn
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

        <CreatePostDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      </div>
    </AdminLayout>
  );
};

export default AdminForumPostManage;
