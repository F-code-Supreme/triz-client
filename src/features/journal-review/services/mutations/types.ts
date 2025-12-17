import type {
  ChildReviewWithTimestamp,
  ReviewStatus,
  RootReviewWithTimestamp,
} from '../../types';

// Payload types for mutations

// Create Root Review (Review Request)
export interface CreateRootReviewPayload {
  problemId: string;
  content: string;
}

export type CreateRootReviewResponse = RootReviewWithTimestamp;

// Create Child Review
export interface CreateChildReviewPayload {
  problemReviewId: string;
  content: string;
  stepNumber?: number;
  rating?: number;
}

export type CreateChildReviewResponse = ChildReviewWithTimestamp;

// Patch/Update Review
export interface PatchReviewPayload {
  userId: string;
  problemReviewId: string;
  content?: string;
  stepNumber?: number;
  rating?: number;
  status?: ReviewStatus;
}

export type PatchReviewResponse = ChildReviewWithTimestamp;

// Delete Review
export interface DeleteReviewPayload {
  userId: string;
  problemReviewId: string;
}
