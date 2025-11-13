import type { PaginatedResponse } from '@/types';

interface Module {
  id: string;
  name: string;
  durationInMinutes: number;
  level: 'EASY' | 'MEDIUM' | 'HARD';
  createdAt: string;
  updatedAt: string;
  courseId: string;
  lessonCount: number;
  quizCount: number;
  assignmentCount: number;
}

export type ModuleResponse = PaginatedResponse<Module>;
