export type UpdateQuizPayload = {
  title: string;
  description: string;
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
export type CreateQuizPayload = {
  title: string;
  description: string;
  durationInMinutes: number;
  questions: Array<{
    content: string;
    questionType: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';
    options: Array<{
      content: string;
      isCorrect: boolean;
    }>;
  }>;
};

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

export interface QuizPage {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface GetQuizzesResponse {
  content: Quiz[];
  page: QuizPage;
}

export interface GetQuizByIdResponse {
  id: string;
  title: string;
  description: string;
  durationInMinutes: string;
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

export type GetAdminQuizzesResponse = {
  content: {
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
  }[];
};

export interface RemainingTimeResponse {
  remainingTimeInSeconds: number;
}
