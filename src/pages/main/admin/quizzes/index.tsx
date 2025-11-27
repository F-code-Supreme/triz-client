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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { createQuizColumns } from '@/features/quiz/components/quiz-columns';
import { QuizFormDialog } from '@/features/quiz/components/quiz-form-dialog';
import { quizStatuses } from '@/features/quiz/data/data';
import {
  useGetAdminQuizzesQuery,
  useDeleteQuizByIdMutation,
  useGetQuizByIdMutationAdmin,
} from '@/features/quiz/service/mutations';
import { AdminLayout } from '@/layouts/admin-layout';

import CreateQuizDialog from './create-quiz';
import DetailQuizDialog from './detail-quiz';

const AdminQuizzesPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
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

  const { data, isLoading, refetch } = useGetAdminQuizzesQuery();
  const deleteQuizMutation = useDeleteQuizByIdMutation();
  const { data: selectedQuizData } = useGetQuizByIdMutationAdmin(
    selectedQuizId || '',
  );

  const quizzes = useMemo(() => {
    return data?.content || [];
  }, [data]);

  const handleDeleteQuiz = async (quiz: any) => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await deleteQuizMutation.mutateAsync(quiz.id);
        if (typeof refetch === 'function') refetch();
      } catch (error) {
        console.error('Failed to delete quiz:', error);
      }
    }
  };

  const handleEditQuiz = (quiz: any) => {
    setSelectedQuiz(quiz);
    setIsEditOpen(true);
  };

  const handleViewDetail = (quiz: any) => {
    setSelectedQuizId(quiz.id);
    setDetailOpen(true);
  };

  const columns = createQuizColumns({
    onEdit: handleEditQuiz,
    onDelete: handleDeleteQuiz,
    onViewDetail: handleViewDetail,
  });

  const table = useReactTable({
    data: quizzes,
    columns,
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

  return (
    <AdminLayout meta={{ title: 'Manage Quizzes' }}>
      <div className="flex flex-col gap-8 p-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quizzes</h1>
            <p className="text-muted-foreground mt-2">
              Manage all quizzes in the system.
            </p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Quiz
          </Button>
        </div>

        <div className="space-y-4">
          <DataTableToolbar
            table={table}
            searchPlaceholder="Search by title, description..."
            searchKey="title"
            filters={[
              {
                columnId: 'questionType',
                title: 'Type',
                options: quizStatuses,
              },
            ]}
          />

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">Loading quizzes...</p>
            </div>
          ) : quizzes.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">
                No quizzes found. Create your first quiz!
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
                          colSpan={columns.length}
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

      <QuizFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={() => refetch?.()}
      />

      <QuizFormDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        quiz={selectedQuiz}
        onSuccess={() => refetch?.()}
      />

      <CreateQuizDialog
        open={false}
        setOpen={() => {}}
        onSuccess={() => refetch?.()}
      />

      <DetailQuizDialog
        open={detailOpen}
        setOpen={setDetailOpen}
        selectedQuizData={selectedQuizData}
      />
    </AdminLayout>
  );
};

export default AdminQuizzesPage;
