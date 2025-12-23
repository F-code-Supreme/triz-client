import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { DataTablePagination } from '@/components/data-table';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
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
import {
  useGetAdminQuizzesQuery,
  useDeleteQuizByIdMutation,
  useGetQuizByIdMutationAdmin,
} from '@/features/quiz/service/mutations';
import { AdminLayout } from '@/layouts/admin-layout';

import DetailQuizDialog from '../../../../features/quiz/components/quiz-detail-dialog';

const AdminQuizzesPage = () => {
  const { t } = useTranslation('pages.admin');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingQuiz, setDeletingQuiz] = useState<any>(null);
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

  const quizzes = data?.content || [];

  const handleDeleteQuiz = (quiz: any) => {
    setDeletingQuiz(quiz);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingQuiz) return;
    try {
      await deleteQuizMutation.mutateAsync(deletingQuiz.id);
      setDeleteDialogOpen(false);
      setDeletingQuiz(null);
      toast.success('Xóa bài kiểm tra thành công!');

      refetch();
    } catch (error) {
      console.error('Failed to delete quiz:', error);
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
    t,
  });

  const table = useReactTable({
    data: quizzes,
    columns,
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
    <AdminLayout meta={{ title: t('quizzes.title') }}>
      <div className="flex flex-col gap-8 p-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t('quizzes.title')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('quizzes.description')}
            </p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t('quizzes.new_quiz')}
          </Button>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">{t('quizzes.loading')}</p>
            </div>
          ) : quizzes.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">{t('quizzes.no_quizzes')}</p>
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
                          {t('quizzes.no_results')}
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

      <DetailQuizDialog
        open={detailOpen}
        setOpen={setDetailOpen}
        selectedQuizData={selectedQuizData}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('quizzes.delete_title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('quizzes.delete_message')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteQuizMutation.isPending}>
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteConfirm}
              disabled={deleteQuizMutation.isPending}
            >
              {deleteQuizMutation.isPending
                ? t('common.loading')
                : t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminQuizzesPage;
