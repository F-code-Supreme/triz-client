import { useParams, useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import {
  Clock,
  BookOpen,
  Save,
  Send,
  Loader2,
  Trophy,
  CheckCircle,
  // RotateCcw,
  Home,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useGetQuizByIdMutation,
  useAutoSaveQuizAnswerMutation,
  useSubmitQuizAttemptMutation,
} from '@/features/quiz/service/mutations';
import { QuizLayout } from '@/layouts/quiz-layout';
import { cn } from '@/lib/utils';
import { formatDate } from '@/utils';

const QuizResults = ({
  results,
  onClose,
  // onRetry,
}: {
  results: any;
  onClose: () => void;
  // onRetry: () => void;
}) => {
  const formatTime = (dateString: string) => {
    return formatDate(new Date(dateString), 'DD/MM/YYYY HH:mm');
  };

  const calculateDuration = (startTime: string, completedAt: string) => {
    const start = new Date(startTime);
    const end = new Date(completedAt);
    const durationMs = end.getTime() - start.getTime();
    const minutes = Math.floor(durationMs / (1000 * 60));
    const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
    return `${minutes} phút ${seconds} giây`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <Card className="bg-white dark:bg-slate-900">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8 text-slate-700 dark:text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white">
              Hoàn thành Quiz!
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300">
              Chúc mừng bạn đã hoàn thành bài quiz
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Score Display */}
            <div className="text-center p-6 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="text-4xl font-bold text-slate-800 dark:text-white mb-2">
                {results.score.toFixed(2)}
              </div>
              <p className="text-muted-foreground">Điểm số của bạn</p>
            </div>

            {/* Time Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg bg-white dark:bg-slate-900">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-slate-700 dark:text-white" />
                  <span className="font-medium">Thời gian làm bài</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {calculateDuration(results.startTime, results.completedAt)}
                </p>
              </div>

              <div className="p-4 border rounded-lg bg-white dark:bg-slate-900">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-slate-700 dark:text-white" />
                  <span className="font-medium">Hoàn thành lúc</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatTime(results.completedAt)}
                </p>
              </div>
            </div>

            {/* Answer Summary */}
            <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800">
              <h3 className="font-medium mb-3 text-slate-800 dark:text-white">
                Tóm tắt kết quả
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tổng số câu hỏi:</span>
                  <span className="font-medium">
                    {results.answers?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Số câu đã trả lời:</span>
                  <span className="font-medium text-slate-800 dark:text-white">
                    {results.answers?.length || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 gap-2 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white"
              >
                <Home className="w-4 h-4" />
                Thoát
              </Button>
              {/* <Button
                onClick={onRetry}
                className="flex-1 gap-2 bg-slate-800 hover:bg-slate-900 text-white"
              >
                <RotateCcw className="w-4 h-4" />
                Làm lại
              </Button> */}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

const QuizSkeleton = () => (
  <QuizLayout meta={{ title: 'Đang tải quiz...' }}>
    <div className="container mx-auto">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-6 sm:mb-8"
      >
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-2">
          <Skeleton className="h-8 w-32" />
        </div>
      </motion.div>

      <div className="xl:hidden mb-6">
        <Card className="shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="h-9 w-24" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-2 w-full mb-3" />
            <div className="text-center">
              <Skeleton className="h-4 w-20 mx-auto" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-7 gap-6 max-w-7xl mx-auto">
        <div className="hidden xl:block xl:col-span-2">
          <Card className="sticky top-6 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-8 w-24 mb-4" />
              <Skeleton className="h-2 w-full mb-4" />

              <div className="grid grid-cols-7 gap-2 mb-4">
                {Array.from({ length: 28 }, (_, index) => (
                  <Skeleton key={index} className="h-9 w-8" />
                ))}
              </div>

              <div className="space-y-2 mt-4 pt-4 border-t">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-5">
          <Card className="shadow-xl border-0">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6">
                <Skeleton className="h-8 w-32" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>

              <Skeleton className="h-16 w-full mb-6" />

              <div className="space-y-4">
                {Array.from({ length: 4 }, (_, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 border rounded-lg"
                  >
                    <Skeleton className="h-7 w-7 rounded-full flex-shrink-0" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </QuizLayout>
);

// eslint-disable-next-line sonarjs/cognitive-complexity
const QuizDetail = () => {
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const quizId = params.quizId ?? '';

  const { data, isLoading } = useGetQuizByIdMutation(quizId);
  const autoSaveAnswerMutation = useAutoSaveQuizAnswerMutation();
  const submitQuizAttemptMutation = useSubmitQuizAttemptMutation();

  const urlParams = new URLSearchParams(window.location.search);
  const attemptIdFromUrl = urlParams.get('attemptId');
  const attemptIdFromStorage = localStorage.getItem(`quiz-attempt-${quizId}`);

  const quizData = data || {
    id: '',
    title: '',
    duration: 0,
    questions: [],
    totalQuestions: 0,
  };

  const totalQuestions = quizData.questions.length;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [quizResults, setQuizResults] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);

  const attemptId = attemptIdFromUrl || attemptIdFromStorage || '';

  const [timeRemaining, setTimeRemaining] = useState(28 * 60 + 20);

  useEffect(() => {
    if (attemptId && quizId) {
      localStorage.setItem(`quiz-attempt-${quizId}`, attemptId);
    }
  }, [attemptId, quizId]);

  useEffect(() => {
    if (timeRemaining <= 0 || isSubmitted) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeRemaining, isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m:${secs.toString().padStart(2, '0')}s`;
  };

  const currentQuestion = quizData.questions[currentQuestionIndex] || {
    id: '',
    question: '',
    options: [],
  };
  const progressPercentage =
    ((currentQuestionIndex + 1) / (totalQuestions || 1)) * 100;

  const handleAnswerSelect = async (questionId: string, answerId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));

    if (attemptId) {
      try {
        await autoSaveAnswerMutation.mutateAsync({
          attemptId,
          questionId,
          selectedOptionIds: [answerId],
        });
      } catch (error) {
        console.error('Error auto-saving answer:', error);
        toast.error('Không thể tự động lưu đáp án. Vui lòng thử lại.');
      }
    }
  };

  const handleQuestionNavigation = async (questionIndex: number) => {
    if (questionIndex < 0 || questionIndex >= totalQuestions || isTransitioning)
      return;

    setIsTransitioning(true);

    await new Promise((resolve) => setTimeout(resolve, 150));

    setCurrentQuestionIndex(questionIndex);
    setIsTransitioning(false);
  };

  const handleSubmit = async () => {
    if (!attemptId || isSubmitted || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const answers = Object.entries(selectedAnswers).map(
        ([questionId, answerId]) => ({
          questionId,
          selectedOptionIds: [answerId],
        }),
      );

      const result = await submitQuizAttemptMutation.mutateAsync({
        attemptId,
        answers,
      });

      toast.success('Nộp bài thành công!');
      setIsSubmitted(true);
      setQuizResults(result);
      setShowResults(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = async () => {
    if (!attemptId) return;

    setIsSaving(true);
    try {
      const savePromises = Object.entries(selectedAnswers).map(
        ([questionId, answerId]) =>
          autoSaveAnswerMutation.mutateAsync({
            attemptId,
            questionId,
            selectedOptionIds: [answerId],
          }),
      );

      await Promise.all(savePromises);

      toast.success('Đã lưu bài làm thành công!');
    } catch (error) {
      console.error('Error saving progress:', error);
      toast.error('Có lỗi xảy ra khi lưu bài làm. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

  const getQuestionStatus = (index: number) => {
    const questionId = quizData.questions[index]?.id;
    if (selectedAnswers[questionId]) return 'answered';
    if (index === currentQuestionIndex) return 'current';
    return 'unanswered';
  };

  const handleCloseResults = () => {
    setShowResults(false);
    navigate({ to: '/quiz' });
  };

  // const handleRetryQuiz = () => {
  //   localStorage.removeItem(`quiz-attempt-${quizId}`);
  //   setShowResults(false);
  //   navigate({ to: `/quiz/${quizId}` });
  // };

  if (isLoading) {
    return <QuizSkeleton />;
  }
  if (!attemptId) {
    return (
      <QuizLayout meta={{ title: 'Quiz không tồn tại' }}>
        <div className="container mx-auto flex items-center justify-center min-h-[400px]">
          <Card className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">
              Không tìm thấy phiên làm bài
            </h2>
            <p className="text-muted-foreground mb-4">
              Vui lòng bắt đầu làm quiz từ trang danh sách quiz.
            </p>
            <Button onClick={() => navigate({ to: '/quiz' })}>
              Quay về danh sách Quiz
            </Button>
          </Card>
        </div>
      </QuizLayout>
    );
  }

  return (
    <QuizLayout
      meta={{
        title: `${quizData.title} `,
      }}
    >
      {showResults && quizResults && (
        <QuizResults
          results={quizResults}
          onClose={handleCloseResults}
          // onRetry={handleRetryQuiz}
        />
      )}
      <div className=" dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto ">
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-6 sm:mb-8"
          >
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-2">
              <Badge variant="outline" className="text-lg px-3 py-1">
                {quizData.title}
              </Badge>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="xl:hidden mb-6"
          >
            <Card className="shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        Mở danh sách
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="top" className="max-w-lg w-full p-4">
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 text-center">
                        Danh sách câu hỏi
                      </h3>
                      <div className="grid grid-cols-4 gap-2 mb-4">
                        {Array.from({ length: totalQuestions }, (_, index) => {
                          const status = getQuestionStatus(index);
                          return (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className={cn(
                                'h-10 w-10 min-w-0 p-0 text-xs font-medium transition-all duration-200',
                                status === 'current' &&
                                  'bg-blue-600 text-white border-blue-600 shadow-md',
                                status === 'answered' &&
                                  'bg-green-600 text-white border-green-600',
                                status === 'unanswered' &&
                                  'hover:bg-slate-100 dark:hover:bg-slate-800',
                              )}
                              onClick={() => handleQuestionNavigation(index)}
                            >
                              {String(index + 1).padStart(2, '0')}
                            </Button>
                          );
                        })}
                      </div>
                      <div className="flex items-center justify-center gap-4 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-sm bg-blue-600"></div>
                          <span className="text-muted-foreground">
                            Đang làm
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-sm bg-green-600"></div>
                          <span className="text-muted-foreground">Đã làm</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-sm border border-slate-300 dark:border-slate-600"></div>
                          <span className="text-muted-foreground">
                            Chưa làm
                          </span>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Thời gian còn lại
                    </span>
                  </div>

                  <motion.div
                    className={cn(
                      'text-lg font-bold',
                      timeRemaining < 300 ? 'text-red-600' : 'text-blue-600',
                    )}
                    animate={timeRemaining < 300 ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {formatTime(timeRemaining)}
                  </motion.div>
                </div>
                <Progress value={progressPercentage} className="mb-3" />
                <div className="text-center text-sm text-muted-foreground">
                  Câu {currentQuestionIndex + 1}/{totalQuestions}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-7 gap-6 max-w-7xl mx-auto">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="hidden xl:block xl:col-span-2"
            >
              <Card className="sticky top-6 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Thời gian còn lại
                    </span>
                  </div>

                  <motion.div
                    className={cn(
                      'text-2xl font-bold mb-4',
                      timeRemaining < 300 ? 'text-red-600' : 'text-blue-600',
                    )}
                    animate={timeRemaining < 300 ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {formatTime(timeRemaining)}
                  </motion.div>

                  <Progress value={progressPercentage} className="mb-4" />

                  <div className="grid grid-cols-7 gap-2  overflow-y-auto max-h-56">
                    {Array.from({ length: totalQuestions }, (_, index) => {
                      const status = getQuestionStatus(index);
                      return (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className={cn(
                            'h-9 w-8 min-w-0 p-0 text-xs font-medium transition-all duration-200',
                            status === 'current' &&
                              'bg-blue-600 text-white border-blue-600 shadow-md',
                            status === 'answered' &&
                              'bg-green-600 text-white border-green-600',
                            status === 'unanswered' &&
                              'hover:bg-slate-100 dark:hover:bg-slate-800',
                          )}
                          onClick={() => handleQuestionNavigation(index)}
                        >
                          {String(index + 1).padStart(2, '0')}
                        </Button>
                      );
                    })}
                  </div>

                  <div className="hidden sm:flex flex-col gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 rounded-lg px-2 py-3">
                    <div className="flex items-center gap-2 justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          currentQuestionIndex > 0 &&
                          handleQuestionNavigation(currentQuestionIndex - 1)
                        }
                        disabled={currentQuestionIndex === 0}
                        className="min-w-[90px]"
                      >
                        Câu trước
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          handleQuestionNavigation(currentQuestionIndex + 1)
                        }
                        className="min-w-[110px] bg-blue-900 text-white hover:bg-blue-800"
                        disabled={currentQuestionIndex === totalQuestions - 1}
                      >
                        Câu tiếp theo
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSave}
                      className="gap-2 w-full"
                      disabled={isSaving || isSubmitting}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Đang lưu...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Lưu bài làm
                        </>
                      )}
                    </Button>

                    <Button
                      size="sm"
                      onClick={handleSubmit}
                      className="min-w-[110px] gap-2 bg-green-600 text-white hover:bg-green-700"
                      disabled={isSubmitted || isSubmitting || isSaving}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Đang nộp...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Nộp bài
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="xl:col-span-5"
            >
              <Card className="shadow-xl border-0">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6">
                    <Badge
                      variant="outline"
                      className="text-base sm:text-lg px-3 sm:px-4 py-1.5 sm:py-2 w-fit"
                    >
                      Câu số {currentQuestionIndex + 1}/{totalQuestions}
                    </Badge>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <BookOpen className="h-4 w-4" />
                      <span className="text-sm">TRIZ</span>
                    </div>
                  </div>

                  {isTransitioning ? (
                    <motion.div
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 0.6 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Skeleton className="h-16 w-full mb-6" />
                      <div className="space-y-4">
                        {Array.from({ length: 4 }, (_, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-4 border rounded-lg"
                          >
                            <Skeleton className="h-7 w-7 rounded-full flex-shrink-0" />
                            <Skeleton className="h-12 w-full" />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={currentQuestion.id}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-800 dark:text-white mb-6 sm:mb-8 leading-relaxed">
                        {currentQuestion.content}
                      </h2>

                      <div className="space-y-3 sm:space-y-4">
                        {(currentQuestion.options || []).map(
                          (option, index) => {
                            const label = String.fromCharCode(65 + index);
                            const isSelected =
                              selectedAnswers[currentQuestion.id] === option.id;
                            return (
                              <motion.div
                                key={option.id}
                                initial={{ x: 10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className={cn(
                                  'relative p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md active:scale-[0.98]',
                                  isSelected
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50',
                                )}
                                onClick={() =>
                                  handleAnswerSelect(
                                    currentQuestion.id,
                                    option.id,
                                  )
                                }
                              >
                                <div className="flex items-start gap-2 sm:gap-3">
                                  <div
                                    className={cn(
                                      'flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center text-xs font-semibold transition-all duration-200',
                                      isSelected
                                        ? 'border-blue-500 bg-blue-500 text-white shadow-md'
                                        : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400',
                                    )}
                                  >
                                    {label}
                                  </div>
                                  <div className="flex-1 text-slate-700 dark:text-slate-300 leading-relaxed text-xs sm:text-sm">
                                    {option.content}
                                  </div>
                                  {isSelected && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-500 flex items-center justify-center shadow-md"
                                    >
                                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white" />
                                    </motion.div>
                                  )}
                                </div>
                              </motion.div>
                            );
                          },
                        )}
                      </div>

                      {/* Mobile Navigation */}
                      <div className="sm:hidden mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 space-y-4">
                        <div className="flex items-center justify-between gap-3">
                          <Button
                            variant="ghost"
                            onClick={() =>
                              currentQuestionIndex > 0 &&
                              handleQuestionNavigation(currentQuestionIndex - 1)
                            }
                            disabled={currentQuestionIndex === 0}
                            className="flex-1"
                          >
                            Câu trước
                          </Button>

                          {currentQuestionIndex < totalQuestions - 1 ? (
                            <Button
                              onClick={() =>
                                handleQuestionNavigation(
                                  currentQuestionIndex + 1,
                                )
                              }
                              className="flex-1"
                            >
                              Câu tiếp theo
                            </Button>
                          ) : (
                            <Button
                              onClick={handleSubmit}
                              className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                              disabled={isSubmitting || isSaving}
                            >
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Đang nộp...
                                </>
                              ) : (
                                <>
                                  <Send className="h-4 w-4" />
                                  Nộp bài
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          onClick={handleSave}
                          className="w-full gap-2"
                          disabled={isSaving || isSubmitting}
                        >
                          {isSaving ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Đang lưu...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4" />
                              Lưu bài làm
                            </>
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </QuizLayout>
  );
};

export default QuizDetail;
