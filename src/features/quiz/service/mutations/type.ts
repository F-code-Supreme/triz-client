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
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  questions: QuizQuestion[];
}

export interface SubmitQuizAttemptPayload {
  attemptId: string;
  answers: Array<{
    questionId: string;
    selectedOptionIds: string[];
  }>;
}
