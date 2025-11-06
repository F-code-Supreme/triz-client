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

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { booksColumns } from '@/features/book/components/books-columns';
import {
  useGetAllBooksAdminQuery,
  useGetAllDeletedBooksAdminQuery,
} from '@/features/book/services/queries';
import { AdminLayout } from '@/layouts/admin-layout';

import { BooksFormDialog } from '@/features/book/components/books-form-dialog';

const AdminBooksManagementPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
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
    let filtered = currentData?.content || [];

    if (statusFilter !== 'all') {
      filtered = filtered.filter((book) => book.status === statusFilter);
    }

    return filtered;
  }, [booksData, deletedBooksData, showDeleted, statusFilter]);

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
      <div className="space-y-6 p-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Books</h1>
          <p className="text-muted-foreground">
            Manage all books in the system. Create, edit, or delete books.
          </p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle>Books List</CardTitle>
            </div>
            <div className="flex gap-2">
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
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex gap-4 flex-col sm:flex-row">
              <Input
                placeholder="Search by title, author..."
                value={globalFilter ?? ''}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="max-w-xs"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="UNPUBLISHED">Unpublished</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-muted-foreground">Loading books...</p>
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

                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Page {table.getState().pagination.pageIndex + 1} of{' '}
                    {table.getPageCount()}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <BooksFormDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </AdminLayout>
  );
};

export default AdminBooksManagementPage;
