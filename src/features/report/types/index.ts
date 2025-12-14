import type { PaginatedResponse } from '@/types';

export enum ReportReason {
  OTHER = 'OTHER',
  ADULT_CONTENT = 'ADULT_CONTENT',
  HARASSMENT = 'HARASSMENT',
  HATE_SPEECH = 'HATE_SPEECH',
  SPAM = 'SPAM',
  VIOLENCE = 'VIOLENCE',
  COPYRIGHT_VIOLATION = 'COPYRIGHT_VIOLATION',
  INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT',
  FALSE_INFORMATION = 'FALSE_INFORMATION',
}
export enum ReportStatus {
  PENDING = 'PENDING',
  IN_REVIEW = 'IN_REVIEW',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
  DISMISSED = 'DISMISSED',
}
export interface Report {
  id: string;
  forumPostId: string;
  forumPostTitle: string;

  reporterId: string;
  reporterName: string;

  reason: ReportReason;
  description: string;

  status: ReportStatus;

  reviewedById: string | null;
  reviewedByName: string | null;
  reviewNote: string | null;
  reviewedAt: string | null;

  createdAt: string;
  updatedAt: string;
}
export type ReportResponse = PaginatedResponse<Report>;
