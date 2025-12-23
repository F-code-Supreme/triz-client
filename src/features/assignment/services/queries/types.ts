/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { AssignmentSubmissionStatus } from '../../types';
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

// Base interface cho các trường chung
export interface AssignmentSubmissionBase {
  id: string;
  title: string;
  submissionContent: string;
  attemptNumber: number;
  isAiPassed: boolean | null;
  isExpertPassed: boolean | null;
  expertComment: string | null;
  status: AssignmentSubmissionStatus;
  gradedAt: string | null;
  createdAt: string;
  updatedAt: string;
  assignmentId: string;
  userId: string;
}

export interface AssignmentSubmission extends AssignmentSubmissionBase {}

export interface AssignmentSubmissionExpertReview extends AssignmentSubmissionBase {}

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

export interface AssignmentHistoryResponse extends AssignmentSubmissionBase {
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
