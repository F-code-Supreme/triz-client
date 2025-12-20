import { Link, useSearch } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import useAuth from '@/features/auth/hooks/use-auth';
import {
  useAutoSaveQuizAnswerMutation,
  useGetQuizAttemptRemainingTimeQuery,
  useStartQuizAttemptMutation,
  useSubmitQuizAttemptMutation,
} from '@/features/quiz/service/mutations';
import {
  useGetQuizAttemptInProgressQuery,
  useGetQuizzByModulesQuery,
} from '@/features/quiz/service/queries';
import { cn } from '@/lib/utils';
import { formatDateHour } from '@/utils/date/date';

// eslint-disable-next-line sonarjs/cognitive-complexity
const CourseQuizPage = () => {
  const search = useSearch({ from: `/(app)/course/quiz/$slug` });
  const { quizId, moduleId } = search as { quizId: string; moduleId: string };
  const { user } = useAuth();

  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizResults, setQuizResults] = useState<any>(null);
  const [hasInProgressAttempt, setHasInProgressAttempt] = useState(false);

  const { data: quizDataArray, isLoading } =
    useGetQuizzByModulesQuery(moduleId);
  const quizData = quizDataArray?.content?.find((quiz) => quiz.id === quizId);
  const startQuizAttemptMutation = useStartQuizAttemptMutation();
  const submitQuizAttemptMutation = useSubmitQuizAttemptMutation();
  const autoSaveQuizAnswerMutation = useAutoSaveQuizAnswerMutation();
  const { data: inProgressAttempt } = useGetQuizAttemptInProgressQuery();
  const { data: timeRemainingData } = useGetQuizAttemptRemainingTimeQuery(
    attemptId || '',
  );

  useEffect(() => {
    if (quizData?.durationInMinutes && !hasInProgressAttempt) {
      setTimeRemaining(quizData.durationInMinutes * 60);
    }
  }, [quizData, hasInProgressAttempt]);

  useEffect(() => {
    if (inProgressAttempt && quizData) {
      if (
        inProgressAttempt.status === 'IN_PROGRESS' &&
        inProgressAttempt.quizId === quizData.id
      ) {
        setHasInProgressAttempt(true);
        setAttemptId(inProgressAttempt.id);

        const restoredAnswers: Record<string, string[]> = {};
        inProgressAttempt.answers?.forEach((answer) => {
          if (!restoredAnswers[answer.questionId]) {
            restoredAnswers[answer.questionId] = [];
          }
          restoredAnswers[answer.questionId].push(answer.optionId);
        });
        setAnswers(restoredAnswers);
      } else if (inProgressAttempt === null) {
        setHasInProgressAttempt(false);
        setAttemptId(null);
      }
    }
  }, [inProgressAttempt, quizData]);

  useEffect(() => {
    if (
      timeRemainingData?.remainingSeconds &&
      hasInProgressAttempt &&
      attemptId
    ) {
      setTimeRemaining(timeRemainingData.remainingSeconds);
    }
  }, [timeRemainingData, hasInProgressAttempt, attemptId]);

  useEffect(() => {
    if (timeRemaining > 0 && !isSubmitted) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeRemaining, isSubmitted]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleConfirmStart = async () => {
    if (!quizData?.id || !user?.id) return;

    setIsStarting(true);

    try {
      // If there's an in-progress attempt, just continue with it
      if (hasInProgressAttempt && attemptId) {
        toast.success('Tiếp tục làm bài quiz!');
        setConfirmOpen(false);
        setQuizStarted(true);
        // Nếu có timeRemainingData thì set lại thời gian
        if (typeof timeRemainingData?.remainingSeconds === 'number') {
          setTimeRemaining(timeRemainingData.remainingSeconds);
        }
      } else {
        // Start a new quiz attempt
        const attemptResponse = await startQuizAttemptMutation.mutateAsync({
          quizId: quizData.id,
          // userId: user.id,
        });

        toast.success('Bài quiz đã được bắt đầu!');

        setConfirmOpen(false);
        setQuizStarted(true);

        const newAttemptId = (attemptResponse as any)?.id;
        setAttemptId(newAttemptId);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          'Có lỗi xảy ra khi bắt đầu quiz. Vui lòng thử lại.',
      );
    } finally {
      setIsStarting(false);
    }
  };

  const handleAnswerChange = (
    questionId: string,
    optionId: string,
    isMultiple: boolean,
  ) => {
    setAnswers((prev) => {
      let newAnswers: Record<string, string[]>;
      if (isMultiple) {
        const currentAnswers = prev[questionId] || [];
        const updatedAnswers = currentAnswers.includes(optionId)
          ? currentAnswers.filter((id) => id !== optionId)
          : [...currentAnswers, optionId];
        newAnswers = { ...prev, [questionId]: updatedAnswers };
      } else {
        newAnswers = { ...prev, [questionId]: [optionId] };
      }

      // Auto-save the answer
      if (attemptId) {
        autoSaveQuizAnswerMutation.mutate(
          {
            attemptId,
            questionId,
            selectedOptionIds: newAnswers[questionId],
          },
          {
            onError: (error: any) => {
              console.error('Error auto-saving answer:', error);
              toast.error('Không thể lưu câu trả lời. Vui lòng thử lại.');
            },
          },
        );
      }

      return newAnswers;
    });
  };

  const handleSubmitQuiz = async () => {
    if (!attemptId || isSubmitted) return;

    try {
      const formattedAnswers = Object.entries(answers).map(
        ([questionId, selectedOptions]) => ({
          questionId,
          selectedOptionIds: selectedOptions,
        }),
      );

      const result = await submitQuizAttemptMutation.mutateAsync({
        attemptId,
        answers: formattedAnswers,
      });

      toast.success('Nộp bài thành công!');
      setQuizResults(result);
      setIsSubmitted(true);
      setShowResults(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.');
    }
  };

  const isQuestionAnswered = (questionId: string) => {
    return answers[questionId] && answers[questionId].length > 0;
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!isLoading && !quizData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-2">Quiz not found</p>
          <p className="text-sm text-muted-foreground mb-4">
            Module ID: {moduleId}
          </p>
          <Button onClick={() => window.history.back()} className="mt-4">
            Quay lại khóa học
          </Button>
        </div>
      </div>
    );
  }

  if (
    !isLoading &&
    quizData &&
    (!quizData.questions || quizData.questions.length === 0)
  ) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">{quizData.title}</h2>
          <p className="text-muted-foreground mb-4">
            No questions available yet
          </p>
          <Button onClick={() => window.history.back()} className="mt-4">
            Quay lại khoá học
          </Button>
        </div>
      </div>
    );
  }

  if (!quizData || !quizData.questions || quizData.questions.length === 0) {
    return null;
  }

  const answeredCount = Object.keys(answers).length;

  if (!quizStarted && confirmOpen) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {hasInProgressAttempt ? 'Tiếp tục Quiz' : 'Bắt đầu Quiz'}:{' '}
                {quizData?.title}
              </AlertDialogTitle>
              <AlertDialogDescription>
                <div className="space-y-3 pt-4">
                  {hasInProgressAttempt && (
                    <div className="flex items-center gap-2 text-orange-600 font-semibold">
                      <AlertCircle className="w-4 h-4" />
                      <span>Bạn có bài làm đang dở dang</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Thời gian: {quizData?.durationInMinutes} phút</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>
                      Số câu hỏi: {quizData?.questions?.length || 0} câu
                    </span>
                  </div>
                  <p className="text-sm pt-2">
                    {hasInProgressAttempt
                      ? 'Bạn có muốn tiếp tục làm bài quiz không?'
                      : 'Bạn đã sẵn sàng bắt đầu làm quiz chưa?'}
                  </p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => window.history.back()}
                disabled={isStarting}
              >
                Hủy
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmStart}
                disabled={isStarting}
              >
                {isStarting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {hasInProgressAttempt ? 'Đang tải...' : 'Đang bắt đầu...'}
                  </>
                ) : hasInProgressAttempt ? (
                  'Tiếp tục làm bài'
                ) : (
                  'Bắt đầu'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  if (showResults && quizResults) {
    const score = quizResults.score || 0;

    return (
      <div className="min-h-screen bg-background">
        <div className="bg-card border-b px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <Link to="/course/my-course">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại khóa học của tôi
              </Button>
            </Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div
              className={cn(
                'w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center',
                score >= quizResults.passingScore
                  ? 'bg-green-100'
                  : 'bg-red-100',
              )}
            >
              {score >= quizResults.passingScore ? (
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              ) : (
                <XCircle className="w-12 h-12 text-red-600" />
              )}
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {score >= quizResults.passingScore ? 'Đạt' : 'Không đạt'}
            </h1>
            <p className="text-5xl font-bold text-primary mb-2">
              {Math.round(score)}%
            </p>
            <p className="text-muted-foreground">
              Thời gian hoàn thành:{' '}
              {formatDateHour(new Date(quizResults.completedAt))}
            </p>
          </motion.div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Đánh giá câu trả lời</h2>
            {quizResults.answers?.map((answer: any, index: number) => {
              const question = quizData?.questions.find(
                (q) => q.id === answer.questionId,
              );
              if (!question) return null;

              const correctOptions = question.options.filter(
                (opt) => opt.isCorrect,
              );
              const isCorrect = correctOptions.some(
                (opt) => opt.id === answer.optionId,
              );

              return (
                <Card
                  key={answer.id}
                  className={cn(
                    isCorrect ? 'border-green-500' : 'border-red-500',
                  )}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div
                        className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                          isCorrect ? 'bg-green-100' : 'bg-red-100',
                        )}
                      >
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">Câu {index + 1}</h3>
                        <p className="text-foreground">
                          {answer.questionContent}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 ml-11">
                      {question.options.map((option: any) => {
                        const isSelected = answer.optionId === option.id;
                        const isCorrectOption = option.isCorrect;

                        return (
                          <div
                            key={option.id}
                            className={cn(
                              'p-3 rounded-lg border',
                              isCorrectOption && 'bg-green-50 border-green-500',
                              isSelected &&
                                !isCorrectOption &&
                                'bg-red-50 border-red-500',
                              !isSelected && !isCorrectOption && 'bg-muted/30',
                            )}
                          >
                            <div className="flex items-center gap-2">
                              {isCorrectOption && (
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              )}
                              {isSelected && !isCorrectOption && (
                                <XCircle className="w-4 h-4 text-red-600" />
                              )}
                              <span>{option.content}</span>
                              {isSelected && (
                                <span className="ml-auto text-xs text-muted-foreground">
                                  Câu trả lời của bạn
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex gap-4 mt-8">
            <Button onClick={() => window.location.reload()} className="flex-1">
              Làm lại bài quiz
            </Button>
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="flex-1"
            >
              Quay lại khóa học
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b px-6 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-lg font-semibold">{quizData.title}</h1>
                <p className="text-sm text-muted-foreground">
                  {answeredCount} / {quizData.questions.length} câu
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4" />
                <span
                  className={cn(
                    'font-mono font-semibold',
                    timeRemaining < 300 && 'text-red-600',
                  )}
                >
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All Questions */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {quizData.questions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">
                          {question.content}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {question.questionType === 'MULTIPLE_CHOICE'
                            ? 'Chọn nhiều đáp án'
                            : 'Chọn một đáp án'}
                        </p>
                      </div>
                      {isQuestionAnswered(question.id) && (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                  </div>

                  {question.questionType === 'SINGLE_CHOICE' ? (
                    <RadioGroup
                      value={answers[question.id]?.[0] || ''}
                      onValueChange={(value) =>
                        handleAnswerChange(question.id, value, false)
                      }
                    >
                      <div className="space-y-2">
                        {question.options.map((option) => (
                          <div
                            key={option.id}
                            className={cn(
                              'flex items-center space-x-3 p-3 rounded-lg border-2 transition-all cursor-pointer hover:bg-accent',
                              answers[question.id]?.[0] === option.id &&
                                'border-primary bg-primary/5',
                            )}
                          >
                            <RadioGroupItem value={option.id} id={option.id} />
                            <Label
                              htmlFor={option.id}
                              className="flex-1 cursor-pointer"
                            >
                              {option.content}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  ) : (
                    <div className="space-y-2">
                      {question.options.map((option) => (
                        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                        <div
                          key={option.id}
                          className={cn(
                            'flex items-center space-x-3 p-3 rounded-lg border-2 transition-all cursor-pointer hover:bg-accent',
                            answers[question.id]?.includes(option.id) &&
                              'border-primary bg-primary/5',
                          )}
                          onClick={() =>
                            handleAnswerChange(question.id, option.id, true)
                          }
                        >
                          <Checkbox
                            id={option.id}
                            checked={answers[question.id]?.includes(option.id)}
                            onCheckedChange={() =>
                              handleAnswerChange(question.id, option.id, true)
                            }
                          />
                          <Label
                            htmlFor={option.id}
                            className="flex-1 cursor-pointer"
                          >
                            {option.content}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Submit Button at bottom */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleSubmitQuiz}
            disabled={answeredCount !== quizData.questions.length}
            size="lg"
          >
            {answeredCount === quizData.questions.length
              ? 'Nộp bài'
              : `Câu hỏi đã trả lời (${answeredCount}/${quizData.questions.length})`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseQuizPage;
