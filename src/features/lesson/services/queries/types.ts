import type { Lesson } from '@/features/lesson/types';
import type { PaginatedResponse } from '@/types';

export interface LessonProgressResponse {
  lessonId: string;
  userId: string;
  isCompleted: boolean;
  startedAt: string | null;
  completedAt: string | null;
  lastAccessedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  inProgress: boolean;
}

export type LessonResponse = PaginatedResponse<Lesson>;
