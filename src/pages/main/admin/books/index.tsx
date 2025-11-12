import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';

import { DataTablePagination, DataTableToolbar } from '@/components/data-table';
import { Button } from '@/components/ui/button';
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
import { booksColumns } from '@/features/book/components/books-columns';
import { BooksFormDialog } from '@/features/book/components/books-form-dialog';
import { bookStatuses } from '@/features/book/data/data';
import {
  useGetAllBooksAdminQuery,
  useGetAllDeletedBooksAdminQuery,
} from '@/features/book/services/queries';
import { AdminLayout } from '@/layouts/admin-layout';

const AdminBooksManagementPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
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

  const { data: booksData, isLoading: isLoadingBooks } =
    useGetAllBooksAdminQuery();
  const { data: deletedBooksData, isLoading: isLoadingDeleted } =
    useGetAllDeletedBooksAdminQuery();

  const books = useMemo(() => {
    const currentData = showDeleted ? deletedBooksData : booksData;
    return currentData?.content || [];
  }, [booksData, deletedBooksData, showDeleted]);

  const table = useReactTable({
    data: books,
    columns: booksColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting as never,
    onColumnFiltersChange: setColumnFilters as never,
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

  const isLoading = showDeleted ? isLoadingDeleted : isLoadingBooks;

  return (
    <AdminLayout meta={{ title: 'Books Management' }}>
      <div className="flex flex-col gap-8 p-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Books</h1>
          <p className="text-muted-foreground mt-2">
            Manage all books in the system. Create, edit, or delete books.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <Select
              value={showDeleted ? 'deleted' : 'active'}
              onValueChange={(v) => setShowDeleted(v === 'deleted')}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active Books</SelectItem>
                <SelectItem value="deleted">Deleted Books</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Book
            </Button>
          </div>

          <DataTableToolbar
            table={table}
            searchPlaceholder="Search by title, author..."
            searchKey="title"
            filters={[
              {
                columnId: 'status',
                title: 'Status',
                options: bookStatuses,
              },
            ]}
          />

          {isLoading ? (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
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
                      {booksColumns.map((_, cellIdx) => (
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
                {showDeleted
                  ? 'No deleted books found'
                  : 'No books found. Create your first book!'}
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
                          colSpan={booksColumns.length}
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

      <BooksFormDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </AdminLayout>
  );
};

export default AdminBooksManagementPage;
