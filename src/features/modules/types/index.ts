import { PaginatedResponse } from '@/types';

interface Order {
  subsetId: string;
  type: 'lesson' | 'assignment';
}

export interface Module {
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
  orders: Order[];
  isCompleted?: boolean;
}

// export interface ModuleResponseData {
//   content: Module[];
// }

export type ModuleResponseData = PaginatedResponse<Module>;
