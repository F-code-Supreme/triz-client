import { Clock, BookOpen, Play, Loader2, History } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import useAuth from '@/features/auth/hooks/use-auth';
import {
  useGetQuizByIdMutation,
  useGetQuizzesMutation,
  useStartQuizAttemptMutation,
} from '@/features/quiz/service/mutations';
import { QuizLayout } from '@/layouts/quiz-layout';
import { Route } from '@/routes/(app)/quiz';
import { formatDate } from '@/utils';

const QuizListPage = () => {
  const { data, isLoading } = useGetQuizzesMutation();
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingQuizId, setPendingQuizId] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const navigate = Route.useNavigate();
  const { user } = useAuth();

  // const data = allQuizzes?.content;

  const startQuizAttemptMutation = useStartQuizAttemptMutation();

  const handleStartQuiz = (quizId: string) => {
    if (!user?.id) {
      toast.error('Vui lòng đăng nhập để bắt đầu làm quiz');
      return;
    }

    setPendingQuizId(quizId);
    setConfirmOpen(true);
  };

  const handleConfirmStart = async () => {
    if (!pendingQuizId || !user?.id) return;

    setIsStarting(true);

    try {
      const attemptResponse = await startQuizAttemptMutation.mutateAsync({
        quizId: pendingQuizId,
      });

      toast.success('Bài quiz đã được bắt đầu!');

      setConfirmOpen(false);

      const attemptId = (attemptResponse as any)?.id;
      navigate({
        to: `/quiz/${pendingQuizId}`,
        search: attemptId ? { attemptId } : {},
      });
    } catch (error: any) {
      console.error('Error starting quiz attempt:', error);
      toast.error(
        error?.response?.data?.message ||
          'Có lỗi xảy ra khi bắt đầu quiz. Vui lòng thử lại.',
      );
    } finally {
      setIsStarting(false);
    }
  };

  const quizzes = data?.content || [];
  const featured = quizzes[0] ?? null;

  const { data: quizDetail, isLoading: isLoadingDetail } =
    useGetQuizByIdMutation(selectedQuizId ? selectedQuizId : featured?.id);

  const featuredData = quizDetail;

  if (quizzes.length === 0) {
    return (
      <QuizLayout meta={{ title: 'Quiz' }} showheader={true}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-muted-foreground">
            Hiện tại chưa có bài ôn tập nào được tạo. Vui lòng quay lại sau.
          </div>
        </div>
      </QuizLayout>
    );
  }

  return (
    <QuizLayout meta={{ title: 'Quiz' }} showheader={true}>
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Skeleton */}
          <div className="lg:col-span-4">
            <div className="fixed">
              <Card className="min-h-[600px] min-w-[420px] shadow-xl border-0 max-w-md mx-auto">
                <div className="relative p-4 sm:p-6 lg:p-8 pb-4 rounded-t-xl">
                  <div className="flex items-start gap-3 sm:gap-4 mt-2">
                    <Skeleton className="w-20 h-28 sm:w-24 sm:h-32 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-4 w-4/6" />
                    </div>
                  </div>
                </div>

                <CardContent className="p-4 sm:p-6 space-y-6">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>

                  <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>

                  <div className="pt-48">
                    <Skeleton className="h-12 w-full rounded-lg" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Skeleton */}
          <div className="lg:col-span-8">
            <div className="space-y-4 lg:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-9 w-32 rounded-lg" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card
                    key={i}
                    className="overflow-hidden border-0 shadow-md animate-pulse"
                  >
                    <Skeleton className="h-24 sm:h-28 lg:h-32 w-full" />
                    <CardContent className="p-3 sm:p-4 space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <div className="flex items-center justify-between pt-2">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-7 w-16 rounded" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left */}
          <div className="lg:col-span-4 min-h-full">
            <div className="fixed">
              {isLoadingDetail ? (
                <Card className="min-h-[600px] min-w-[420px] shadow-xl border-0 max-w-md mx-auto">
                  <div className="relative p-4 sm:p-6 lg:p-8 pb-4 rounded-t-xl">
                    <div className="flex items-start gap-3 sm:gap-4 mt-2">
                      <Skeleton className="w-20 h-28 sm:w-24 sm:h-32 rounded-lg flex-shrink-0" />
                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/6" />
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4 sm:p-6 space-y-6">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                    </div>

                    <div className="flex items-center gap-3">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>

                    <div className="pt-48">
                      <Skeleton className="h-12 w-full rounded-lg" />
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="min-h-[600px] min-w-[420px] shadow-xl border-0 dark:from-amber-950/50 dark:via-orange-950/50 dark:to-rose-950/50 max-w-md mx-auto flex flex-col">
                  <div className="relative p-4 sm:p-6 lg:p-8 pb-4 rounded-t-xl dark:from-amber-900/40 dark:to-orange-900/40">
                    <div className="flex items-start gap-3 sm:gap-4 mt-2">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-28 sm:w-24 sm:h-32 relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-lg shadow-xl transform rotate-3">
                            <div className="absolute inset-1.5 bg-white rounded-md flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-sm font-bold text-blue-600 mb-1">
                                  TRIZ
                                </div>
                                <div className="text-[10px] text-slate-600 leading-tight">
                                  Fundamentals
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 pt-1">
                        <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight mb-2">
                          {featuredData?.title}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                          {featuredData?.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4 sm:p-6 flex flex-col flex-1">
                    <div className="space-y-3 sm:space-y-4 flex-1">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium text-sm">
                            {featuredData?.questions.length} Questions
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground text-sm">
                            {featuredData?.durationInMinutes || '—'} minutes
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white font-semibold text-sm">
                            {(featuredData?.createdBy || 'T').slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">
                            {featuredData?.createdBy || 'TRIZ Academy'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {featured?.updatedAt
                              ? formatDate(
                                  new Date(featured?.updatedAt as string),
                                )
                              : formatDate(new Date())}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto pt-4">
                      <Button
                        onClick={() =>
                          handleStartQuiz(selectedQuizId ?? featured?.id)
                        }
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-sm sm:text-base font-medium py-2 sm:py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                        disabled={!user?.id || !featured?.id || isStarting}
                      >
                        {!user?.id ? (
                          'Đăng nhập để bắt đầu'
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Start Quiz
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Right */}
          <div className="lg:col-span-8">
            <div className="space-y-4 lg:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                    All Quiz Sets
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground mt-1">
                    Choose a topic to start learning
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="self-start sm:self-auto"
                  onClick={() => navigate({ to: '/quiz/history' })}
                >
                  <History className="w-4 h-4 mr-2" />
                  History Quiz
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {quizzes.map((quiz: any) => {
                  const title = quiz.title || quiz.name || 'Untitled Quiz';
                  const description =
                    quiz.description ||
                    quiz.summary ||
                    'No description available.';
                  // const cardCount =
                  //   quiz.questions?.length ?? quiz.cardCount ?? 0;
                  const duration = quiz.durationInMinutes || '—';
                  const gradientClass =
                    'from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900';

                  return (
                    <Card
                      key={quiz.id}
                      className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                      onClick={() => setSelectedQuizId(quiz.id)}
                      tabIndex={0}
                      role="button"
                      aria-pressed={selectedQuizId === quiz.id}
                    >
                      <div
                        className={`h-24 sm:h-28 lg:h-32 bg-gradient-to-br ${gradientClass} p-3 sm:p-4 flex flex-col justify-between relative overflow-hidden`}
                      >
                        <div className="flex items-center justify-between">
                          <div
                            className={`text-[10px] sm:text-xs text-slate-600 dark:text-slate-400`}
                          >
                            {duration} minutes
                          </div>
                        </div>

                        <div>
                          <h3
                            className={`text-sm sm:text-base lg:text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight`}
                          >
                            {title}
                          </h3>
                        </div>

                        <div className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 lg:-bottom-4 lg:-right-4 w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-slate-200/30 dark:bg-slate-700/30 rounded-full"></div>
                        <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 lg:-bottom-8 lg:-right-8 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-slate-200/20 dark:bg-slate-700/20 rounded-full"></div>
                      </div>

                      <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex gap-1 sm:gap-2">
                            <div className="text-xs text-muted-foreground">
                              {quiz?.createdAt
                                ? formatDate(
                                    new Date(quiz?.createdAt as string),
                                  )
                                : formatDate(new Date())}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <Sheet open={confirmOpen} onOpenChange={setConfirmOpen}>
        <SheetContent side="top" className="max-w-md mx-auto">
          <SheetHeader>
            <SheetTitle>Bắt đầu làm bài Quiz?</SheetTitle>
            <SheetDescription>
              {isStarting
                ? 'Đang khởi tạo phiên làm bài, vui lòng đợi...'
                : 'Bạn có chắc chắn muốn bắt đầu làm bài quiz này? Sau khi bắt đầu, thời gian sẽ được tính và bạn cần hoàn thành trong thời gian quy định.'}
            </SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={isStarting}
            >
              Huỷ
            </Button>
            <Button
              onClick={handleConfirmStart}
              className="bg-blue-600 text-white"
              disabled={isStarting}
            >
              {isStarting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang bắt đầu...
                </>
              ) : (
                'Xác nhận bắt đầu'
              )}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </QuizLayout>
  );
};

export default QuizListPage;
