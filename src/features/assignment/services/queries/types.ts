import type { PaginatedResponse } from '@/types';

export interface Assignment {
  id: string;
  title: string;
  description: string;
  durationInMinutes: number;
  maxAttempts: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  moduleId: string;
  moduleName: string;
  userId: string;
}

export type AssignmentResponse = PaginatedResponse<Assignment>;
