import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DataTablePagination, DataTableToolbar } from '@/components/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { assignmentsColumns } from '@/features/assignment/components/assignments-columns';
import {
  // useGetAssignmentsQuery,
  useGetAssignmentsQueryExpert,
} from '@/features/assignment/services/queries';
import { AdminLayout } from '@/layouts/admin-layout';

const AdminAssignmentsManagementPage = () => {
  const { t } = useTranslation('pages.admin');
  const [globalFilter, setGlobalFilter] = useState('');
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

  // const { data: assignmentsData, isLoading } = useGetAssignmentsQuery();
  const { data: assignmentsData, isLoading } = useGetAssignmentsQueryExpert();

  const books = useMemo(() => {
    const currentData = assignmentsData;
    return currentData?.content || [];
  }, [assignmentsData]);

  const table = useReactTable({
    data: books,
    columns: assignmentsColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  return (
    <AdminLayout meta={{ title: 'Books Management' }}>
      <div className="flex flex-col gap-8 p-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t('assignments.title')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('assignments.description')}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <DataTableToolbar
            table={table}
            searchPlaceholder={t('assignments.search_placeholder')}
            searchKey="title"
            filters={[
              {
                columnId: 'status',
                title: 'Status',
                options: [
                  {
                    label: 'Chờ AI đánh giá',
                    value: 'AI_PENDING',
                  },
                  {
                    label: 'Đã đánh giá',
                    value: 'APPROVED',
                  },
                  {
                    label: 'Chờ duyệt',
                    value: 'PENDING',
                  },
                  {
                    label: 'Từ chối',
                    value: 'REJECTED',
                  },
                ],
              },
            ]}
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
                      {assignmentsColumns.map((_, cellIdx) => (
                        <TableCell key={cellIdx}>
                          <Skeleton className="h-8 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : books.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">
                {t('assignments.no_assignments')}
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
                          colSpan={assignmentsColumns.length}
                          className="h-24 text-center"
                        >
                          {t('assignments.no_results')}
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
      </div>
    </AdminLayout>
  );
};

export default AdminAssignmentsManagementPage;
