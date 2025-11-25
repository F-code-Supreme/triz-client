import type { PaginatedResponse } from '@/types';

interface Assignment {
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

export interface AssignmentSubmission {
  id: string;
  title: string;
  submissionContent: string;
  attemptNumber: number;
  isAiPassed: boolean;
  isExpertPassed: boolean;
  expertComment: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  gradedAt: string | null;
  createdAt: string;
  updatedAt: string;
  assignmentId: string;
  userId: string;
}

export interface SubmitAssignmentPayload {
  title: string;
  submissionContent: string;
  assignmentId: string;
  userId: string;
}

export type AssignmentResponse = PaginatedResponse<Assignment>;
export type AssignmentSubmissionHistoryResponse =
  PaginatedResponse<AssignmentSubmission>;
