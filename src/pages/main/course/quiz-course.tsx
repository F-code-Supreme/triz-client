import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useGetQuizzByModulesQuery } from '@/features/quiz/service/queries';
import { useSearch } from '@tanstack/react-router';

function CourseQuizPage() {
  const search = useSearch({ from: `/course/quiz/$slug` });
  const { id: moduleId } = search as { id: string };
  const navigate = useNavigate();

  const { data: quizData, isLoading } = useGetQuizzByModulesQuery(moduleId);

  console.log('quizData', moduleId);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (quizData?.durationInMinutes) {
      setTimeRemaining(quizData.durationInMinutes * 60);
    }
  }, [quizData]);

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

  const handleAnswerChange = (
    questionId: string,
    optionId: string,
    isMultiple: boolean,
  ) => {
    setAnswers((prev) => {
      if (isMultiple) {
        const currentAnswers = prev[questionId] || [];
        const newAnswers = currentAnswers.includes(optionId)
          ? currentAnswers.filter((id) => id !== optionId)
          : [...currentAnswers, optionId];
        return { ...prev, [questionId]: newAnswers };
      } else {
        return { ...prev, [questionId]: [optionId] };
      }
    });
  };

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
    setShowResults(true);
  };

  const calculateScore = () => {
    if (!quizData?.questions) return { correct: 0, total: 0, percentage: 0 };

    let correct = 0;
    quizData.questions.forEach((question) => {
      const userAnswers = answers[question.id] || [];
      const correctAnswers = question.options
        .filter((opt) => opt.isCorrect)
        .map((opt) => opt.id);

      const isCorrect =
        userAnswers.length === correctAnswers.length &&
        userAnswers.every((ans) => correctAnswers.includes(ans));

      if (isCorrect) correct++;
    });

    return {
      correct,
      total: quizData.questions.length,
      percentage: Math.round((correct / quizData.questions.length) * 100),
    };
  };

  const isQuestionAnswered = (questionId: string) => {
    return answers[questionId] && answers[questionId].length > 0;
  };

  // const isOptionCorrect = (questionId: string, optionId: string) => {
  //   const question = quizData?.questions.find((q) => q.id === questionId);
  //   return (
  //     question?.options.find((opt) => opt.id === optionId)?.isCorrect || false
  //   );
  // };

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

  if (!quizData || !quizData.questions || quizData.questions.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {!quizData ? 'Quiz not found' : 'No questions available'}
          </p>
          <Button
            onClick={() => navigate({ to: '/course/my-course' })}
            className="mt-4"
          >
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const progress =
    ((currentQuestionIndex + 1) / quizData.questions.length) * 100;
  const score = calculateScore();

  // Results view
  if (showResults) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-card border-b px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <Link to="/course/my-course">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Course
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
                score.percentage >= 80
                  ? 'bg-green-100'
                  : score.percentage >= 60
                    ? 'bg-yellow-100'
                    : 'bg-red-100',
              )}
            >
              {score.percentage >= 80 ? (
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              ) : (
                <XCircle className="w-12 h-12 text-red-600" />
              )}
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {score.percentage >= 80
                ? 'Great Job!'
                : score.percentage >= 60
                  ? 'Good Effort!'
                  : 'Keep Practicing!'}
            </h1>
            <p className="text-5xl font-bold text-primary mb-2">
              {score.percentage}%
            </p>
            <p className="text-muted-foreground">
              You got {score.correct} out of {score.total} questions correct
            </p>
          </motion.div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Review Your Answers</h2>
            {quizData.questions.map((question, index) => {
              const userAnswers = answers[question.id] || [];
              const correctAnswers = question.options
                .filter((opt) => opt.isCorrect)
                .map((opt) => opt.id);
              const isCorrect =
                userAnswers.length === correctAnswers.length &&
                userAnswers.every((ans) => correctAnswers.includes(ans));

              return (
                <Card
                  key={question.id}
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
                        <h3 className="font-semibold mb-1">
                          Question {index + 1} of {quizData.questions.length}
                        </h3>
                        <p className="text-foreground">{question.content}</p>
                      </div>
                    </div>

                    <div className="space-y-2 ml-11">
                      {question.options.map((option) => {
                        const isSelected = userAnswers.includes(option.id);
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
              Retake Quiz
            </Button>
            <Button
              onClick={() => navigate({ to: '/course/my-course' })}
              variant="outline"
              className="flex-1"
            >
              Back to Course
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz taking view
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b px-6 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <Link to="/course/my-course">
                <Button variant="ghost" size="sm" disabled={isSubmitted}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Exit Quiz
                </Button>
              </Link>
              <h1 className="text-lg font-semibold">{quizData.title}</h1>
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

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Question {currentQuestionIndex + 1} of{' '}
                {quizData.questions.length}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent className="p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-2">
                      {currentQuestion.content}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {currentQuestion.questionType === 'MULTIPLE_CHOICE'
                        ? 'Select all that apply'
                        : 'Select one answer'}
                    </p>
                  </div>

                  {currentQuestion.questionType === 'SINGLE_CHOICE' ? (
                    <RadioGroup
                      value={answers[currentQuestion.id]?.[0] || ''}
                      onValueChange={(value) =>
                        handleAnswerChange(currentQuestion.id, value, false)
                      }
                    >
                      <div className="space-y-3">
                        {currentQuestion.options.map((option) => (
                          <div
                            key={option.id}
                            className={cn(
                              'flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:bg-accent',
                              answers[currentQuestion.id]?.[0] === option.id &&
                                'border-primary bg-primary/5',
                            )}
                          >
                            <RadioGroupItem value={option.id} id={option.id} />
                            <Label
                              htmlFor={option.id}
                              className="flex-1 cursor-pointer text-base"
                            >
                              {option.content}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  ) : (
                    <div className="space-y-3">
                      {currentQuestion.options.map((option) => (
                        <div
                          key={option.id}
                          className={cn(
                            'flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:bg-accent',
                            answers[currentQuestion.id]?.includes(option.id) &&
                              'border-primary bg-primary/5',
                          )}
                          onClick={() =>
                            handleAnswerChange(
                              currentQuestion.id,
                              option.id,
                              true,
                            )
                          }
                        >
                          <Checkbox
                            id={option.id}
                            checked={answers[currentQuestion.id]?.includes(
                              option.id,
                            )}
                            onCheckedChange={() =>
                              handleAnswerChange(
                                currentQuestion.id,
                                option.id,
                                true,
                              )
                            }
                          />
                          <Label
                            htmlFor={option.id}
                            className="flex-1 cursor-pointer text-base"
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
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="bg-card border-t px-6 py-4 sticky bottom-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() =>
              setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
            }
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {quizData.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={cn(
                  'w-8 h-8 rounded-full text-xs font-medium transition-all',
                  index === currentQuestionIndex
                    ? 'bg-primary text-primary-foreground'
                    : isQuestionAnswered(quizData.questions[index].id)
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground',
                )}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestionIndex === quizData.questions.length - 1 ? (
            <Button
              onClick={handleSubmitQuiz}
              disabled={
                Object.keys(answers).length !== quizData.questions.length
              }
            >
              Submit Quiz
            </Button>
          ) : (
            <Button
              onClick={() =>
                setCurrentQuestionIndex((prev) =>
                  Math.min(quizData.questions.length - 1, prev + 1),
                )
              }
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseQuizPage;
