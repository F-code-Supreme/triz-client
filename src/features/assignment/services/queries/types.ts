import type { PaginatedResponse } from '@/types';

export interface Assignment {
  id: string;
  title: string;
  description: string;
  durationInMinutes: number;
  criteria: string[];
  maxAttempts: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  moduleId: string;
  moduleName: string;
  userId: string;
}

export interface AssignmentSubmissionExpertReview {
  id: string;
  title: string;
  submissionContent: string;
  attemptNumber: number;
  isAiPassed: boolean | null;
  isExpertPassed: boolean | null;
  expertComment: string | null;
  status: 'AI_PENDING' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPERT_PENDING';
  gradedAt: string | null;
  createdAt: string;
  updatedAt: string;
  assignmentId: string;
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
  status:
    | 'PENDING'
    | 'APPROVED'
    | 'REJECTED'
    | 'AI_PENDING'
    | 'EXPERT_PENDING'
    | 'AI_REJECTED';
  gradedAt: string | null;
  createdAt: string;
  updatedAt: string;
  assignmentId: string;
  userId: string;
}

export interface AssignmentHistoryAiAnalysis {
  areasForDevelopment: string;
  areasForDevelopmentList: string[];
  assessmentSummary: string;
  criteriaAnalysis: string;
  gradedAt: string;
  isPassed: boolean;
  overallAnalysis: string;
  reasoning: string;
  strengths: string;
  strengthsList: string[];
  suggestedFocus: string;
}

export interface AssignmentHistoryResponse extends AssignmentSubmission {
  aiAnalysis?: AssignmentHistoryAiAnalysis;
}

export interface SubmitAssignmentPayload {
  title: string;
  submissionContent: string;
  assignmentId: string;
  userId: string;
}

export type AssignmentResponse = PaginatedResponse<Assignment>;

export type AssignmentSubmissionExpertReviewResponse =
  PaginatedResponse<AssignmentSubmissionExpertReview>;
export type AssignmentSubmissionHistoryResponse =
  PaginatedResponse<AssignmentHistoryResponse>;
