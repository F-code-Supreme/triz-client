import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
import { getUserFilters } from '@/features/user/components/user-filters';
import { useAdminUsersColumns } from '@/features/user/components/users-columns';
import { UsersFormDialog } from '@/features/user/components/users-form-dialog';
import { useSearchAllUsersQuery } from '@/features/user/services/queries';
import { AdminLayout } from '@/layouts/admin-layout';

const AdminUsersPage = () => {
  const { t } = useTranslation('pages.admin');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: usersData, isLoading } = useSearchAllUsersQuery(
    pagination,
    sorting,
    columnFilters,
  );

  const users = useMemo(() => usersData?.content || [], [usersData]);
  const totalRowCount = usersData?.page?.totalElements ?? 0;

  // Get translated filters
  const userFilters = useMemo(() => getUserFilters(t), [t]);

  const usersColumns = useAdminUsersColumns();

  const table = useReactTable({
    data: users,
    columns: usersColumns,
    state: {
      pagination,
      sorting,
      columnFilters,
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
    <AdminLayout meta={{ title: t('users.title') }}>
      <div className="flex flex-col gap-8 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t('users.title')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('users.description')}
            </p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t('users.new_user')}
          </Button>
        </div>

        <div className="space-y-4">
          <DataTableToolbar
            table={table}
            searchPlaceholder={t('users.search_placeholder')}
            searchKeys={[
              { value: 'email', label: t('users.form.email') },
              { value: 'fullName', label: t('users.form.full_name') },
            ]}
            filters={userFilters}
          />

          {isLoading ? (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('users.form.avatar')}</TableHead>
                    <TableHead>{t('users.form.email')}</TableHead>
                    <TableHead>{t('users.form.full_name')}</TableHead>
                    <TableHead>{t('users.form.role')}</TableHead>
                    <TableHead>{t('users.form.status')}</TableHead>
                    <TableHead>{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 10 }).map((_, idx) => (
                    <TableRow key={idx}>
                      {usersColumns.map((_, cellIdx) => (
                        <TableCell key={cellIdx}>
                          <Skeleton className="h-8 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : users.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">{t('users.no_users')}</p>
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
                        <TableRow key={row.id}>
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
                          colSpan={usersColumns.length}
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
      </div>

      <UsersFormDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </AdminLayout>
  );
};

export default AdminUsersPage;
