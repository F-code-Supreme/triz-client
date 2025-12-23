import type { DataTimestamp } from '@/types';

// Review Status enum
export type ReviewStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'REVIEWED'
  | 'APPROVED'
  | 'COMMENTED';

// Root Review (Review Request) - what the user creates
export interface RootReview {
  id: string;
  problemId: string;
  problemTitle: string;
  creatorId: string;
  creatorAvatarUrl: string | null;
  creatorFullName: string;
  content: string;
  averageRating: number | null;
  status: ReviewStatus;
}

// Child Review - what experts/users create in response to root reviews
export interface ChildReview {
  id: string;
  parentProblemReviewId: string;
  parentId?: string | null; // For nested replies (reply to review)
  creatorId: string;
  creatorAvatarUrl: string | null;
  creatorFullName: string;
  content: string;
  stepNumber: number | null;
  rating: number | null;
  status?: ReviewStatus;
}

// Combined type with timestamps
export type RootReviewWithTimestamp = RootReview & DataTimestamp;
export type ChildReviewWithTimestamp = ChildReview & DataTimestamp;
