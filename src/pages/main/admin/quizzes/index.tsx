import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination';
import { AdminLayout } from '@/layouts/admin-layout';
import {
  useGetAdminQuizzesQuery,
  useDeleteQuizByIdMutation,
  useGetQuizByIdMutationAdmin,
} from '@/features/quiz/service/mutations';
import { useState } from 'react';
import CreateQuizDialog from './create-quiz';
import DetailQuizDialog from './detail-quiz';

const PAGE_SIZE = 8;

const AdminQuizzesPage = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useGetAdminQuizzesQuery();
  const [open, setOpen] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const deleteQuizMutation = useDeleteQuizByIdMutation();
  const { data: selectedQuizData } = useGetQuizByIdMutationAdmin(
    selectedQuizId || '',
  );

  const quizzes = data?.content || [];
  const total = quizzes.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const pagedQuizzes = quizzes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDeleteQuiz = async (quizId: string) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await deleteQuizMutation.mutateAsync(quizId);
        if (typeof refetch === 'function') refetch();
      } catch (error) {
        console.error('Failed to delete quiz:', error);
      }
    }
  };

  const handleViewDetail = (quizId: string) => {
    setSelectedQuizId(quizId);
    setDetailOpen(true);
  };

  return (
    <AdminLayout meta={{ title: 'Manage Quizzes' }}>
      <div className="space-y-6 p-4 flex flex-col min-h-full">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Manage Quizzes
              </h1>
              <p className="text-muted-foreground">
                Manage quizzes offered on the platform. You can add, edit, or
                remove quizzes as needed.
              </p>
            </div>
            <Button variant="default" size="lg" onClick={() => setOpen(true)}>
              <span className="mr-2">+</span> Create Quiz
            </Button>
          </div>

          <CreateQuizDialog
            open={open}
            setOpen={setOpen}
            onSuccess={() => refetch?.()}
          />

          <DetailQuizDialog
            open={detailOpen}
            setOpen={setDetailOpen}
            selectedQuizData={selectedQuizData}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4 flex-1">
            {isLoading ? (
              Array.from({ length: PAGE_SIZE }).map((_, idx) => (
                <Card key={idx} className="animate-pulse h-[220px]" />
              ))
            ) : isError ? (
              <div className="col-span-4 text-center text-destructive">
                Error loading quizzes.
              </div>
            ) : pagedQuizzes.length === 0 ? (
              <div className="col-span-4 text-center text-muted-foreground">
                No quizzes found.
              </div>
            ) : (
              pagedQuizzes.map((quiz) => (
                <Card key={quiz.id}>
                  {quiz.imageSource ? (
                    <img
                      src={quiz.imageSource}
                      alt={quiz.title}
                      className="h-32 w-full object-cover"
                    />
                  ) : (
                    <div className="h-32 w-full bg-muted flex items-center justify-center text-muted-foreground text-lg">
                      No Image
                    </div>
                  )}
                  <CardHeader className="py-2 px-4 flex-1">
                    <div className="flex flex-row items-center justify-between">
                      <CardTitle className="text-base line-clamp-1">
                        {quiz.title}
                      </CardTitle>

                      <div className="text-xs text-muted-foreground">
                        {quiz.questions.length} questions
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {quiz.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 space-y-2">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleViewDetail(quiz.id)}
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteQuiz(quiz.id)}
                        disabled={deleteQuizMutation.status === 'pending'}
                      >
                        {deleteQuizMutation.status === 'pending'
                          ? '...'
                          : 'Delete'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {totalPages > 1 && (
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  size="default"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  aria-disabled={page === 1}
                  tabIndex={page === 1 ? -1 : 0}
                  className="cursor-pointer"
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <PaginationItem key={idx}>
                  <PaginationLink
                    size="default"
                    isActive={page === idx + 1}
                    onClick={() => setPage(idx + 1)}
                    className="cursor-pointer"
                  >
                    {idx + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  size="default"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  aria-disabled={page === totalPages}
                  tabIndex={page === totalPages ? -1 : 0}
                  className="cursor-pointer"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminQuizzesPage;
