import { PaginatedResponse } from '@/types';

export type UpdateQuizPayload = {
  title: string;
  description: string;
  moduleId: string;
  questions: Array<{
    content: string;
    questionType: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';
    options: Array<{
      content: string;
      isCorrect: boolean;
    }>;
  }>;
};

export type UpdateQuizResponse = {
  title: string;
  description: string;
  questions: Array<{
    content: string;
    questionType: string;
    options: Array<{
      content: string;
      isCorrect: boolean;
    }>;
  }>;
};
export interface CreateQuizPayload {
  title: string;
  description: string;
  durationInMinutes: number;
  moduleId: string | null;
  questions: Array<{
    content: string;
    questionType: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';
    options: Array<{
      content: string;
      isCorrect: boolean;
    }>;
  }>;
}

export interface CreateQuizGeneralPayload extends CreateQuizPayload {
  imageSource?: string | null;
}

export type CreateQuizResponse = {
  id: string;
  title: string;
  description: string;
  durationInMinutes: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  questions: Array<{
    id: string;
    content: string;
    questionType: string;
    createdAt: string;
    updatedAt: string;
    quizId: string;
    options: Array<{
      id: string;
      content: string;
      isCorrect: boolean;
      createdAt: string;
      updatedAt: string;
      questionId: string;
    }>;
  }>;
};
export interface AutoSaveQuizAnswerPayload {
  attemptId: string;
  questionId: string;
  selectedOptionIds: string[];
}
export interface QuizOption {
  id: string;
  content: string;
  isCorrect: boolean;
  createdAt: string;
  updatedAt: string;
  questionId: string;
}

export interface QuizQuestion {
  id: string;
  content: string;
  questionType: string;
  createdAt: string;
  updatedAt: string;
  quizId: string;
  options: QuizOption[];
}
export interface QuizOption {
  id: string;
  content: string;
  isCorrect: boolean;
  createdAt: string;
  updatedAt: string;
  questionId: string;
}

export interface QuizQuestion {
  id: string;
  content: string;
  questionType: string;
  createdAt: string;
  updatedAt: string;
  quizId: string;
  options: QuizOption[];
}
export interface QuizOption {
  id: string;
  content: string;
  isCorrect: boolean;
  createdAt: string;
  updatedAt: string;
  questionId: string;
}

export interface QuizQuestion {
  id: string;
  content: string;
  questionType: string;
  createdAt: string;
  updatedAt: string;
  quizId: string;
  options: QuizOption[];
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  questions: QuizQuestion[];
}

export type GetQuizzesResponse = PaginatedResponse<Quiz>;

export interface GetQuizByIdResponse {
  id: string;
  title: string;
  description: string;
  durationInMinutes: string;
  moduleId?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  questions: QuizQuestion[];
}

export interface SubmitQuizAttemptPayload {
  attemptId: string;
  answers: {
    questionId: string;
    selectedOptionIds: string[];
  }[];
}

export interface QuizAttemptAnswer {
  id: string;
  optionId: string;
  quizAttemptId: string;
  questionId: string;
  questionContent: string;
  optionContent: string;
}

export interface QuizAttempt {
  id: string;
  score: number;
  startTime: string | null;
  completedAt: string | null;
  quizId: string;
  userId: string;
  answers: QuizAttemptAnswer[];
}

export interface GetUserQuizAttemptsResponse {
  content: QuizAttempt[];
}

export type GetAdminQuizzes = {
  id: string;
  title: string;
  description: string;
  imageSource: string | null;
  durationInMinutes: number | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  questions: {
    id: string;
    content: string;
    questionType: string;
    createdAt: string;
    updatedAt: string;
    quizId: string;
    options: {
      id: string;
      content: string;
      isCorrect: boolean;
      createdAt: string;
      updatedAt: string;
      questionId: string;
    }[];
  }[];
};

export type GetAdminQuizzesResponse = PaginatedResponse<GetAdminQuizzes>;

export interface RemainingTimeResponse {
  remainingSeconds: number;
  remainingMinutes?: number;
  expirationTime?: string;
  status?: 'IN_PROGRESS' | 'COMPLETED' | 'TIMED_OUT';
}

export type CreateQuizGeneralResponse = {
  id: string;
  title: string;
  description: string;
  imageSource: string | null;
  durationInMinutes: number;
  createdAt: string;
  updatedAt: string;
  moduleId: string | null;
  moduleName: string | null;
  userId: string | null;
  questions: QuizQuestion[];
};
