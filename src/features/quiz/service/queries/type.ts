import type { QuizQuestion } from '../mutations/type';
import type { PaginatedResponse } from '@/types';

export interface Quiz {
  id: string;
  title: string;
  description: string;
  imageSource: string;
  durationInMinutes: number;
  createdAt: string;
  updatedAt: string;
  moduleId: string;
  moduleName: string;
  userId: string | null;
  questions: QuizQuestion[];
}

export type GetQuizzByModulesResponse = PaginatedResponse<Quiz>;

export interface QuizGetAnswersAttempt {
  id: string;
  score: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'TIMED_OUT';
  startTime: string;
  completedAt: string | null;
  quizId: string;
  userId: string;
  answers: {
    answerId: string;
    optionId: string;
    optionContent: string;
    isCorrect: boolean;
    quizAttemptId: string;
    questionId: string;
    questionContent: string;
    questionType: 'MULTIPLE_CHOICE' | 'SINGLE_CHOICE';
  }[];
}
