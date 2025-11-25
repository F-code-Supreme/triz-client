import { QuizQuestion } from '../mutations/type';

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

export type getQuizzByModulesResponse = Quiz[];
