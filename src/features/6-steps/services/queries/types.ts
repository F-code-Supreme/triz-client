import type { Principle, Problem } from '../../types';
import type { DataTimestamp, PaginatedResponse } from '@/types';

export interface IGetPrinciplesLookupDataItem {
  priority: number;
  principle: Principle;
}

export type IGetPrinciplesLookupDataResponse = IGetPrinciplesLookupDataItem[];

export type IGetJournalsByUserDataResponse = PaginatedResponse<
  Problem & DataTimestamp
>;

export type IGetJournalByIdDataResponse = Problem & DataTimestamp;

// Idea Assessment Request Types
export interface IdeaAssessmentRequest {
  id: string;
  userId: string;
  userFullName: string;
  userEmail: string;
  journalId: string;
  journalTitle: string;
  ideaStatement: string;
  principleUsed?: {
    id: number;
    name: string;
  };
  howItAddresses?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'IN_REVIEW';
  expertComment?: string | null;
  expertRating?: number | null;
  requestedAt: string;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type IdeaAssessmentRequestsResponse =
  PaginatedResponse<IdeaAssessmentRequest>;
