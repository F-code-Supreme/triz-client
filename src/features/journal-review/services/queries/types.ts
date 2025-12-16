import type {
  ChildReviewWithTimestamp,
  RootReviewWithTimestamp,
} from '../../types';
import type { PaginatedResponse, Response } from '@/types';

// Response types for API calls
export type GetRootReviewsByProblemResponse = Response<
  PaginatedResponse<RootReviewWithTimestamp>
>;

export type GetRootReviewsByUserResponse = Response<
  PaginatedResponse<RootReviewWithTimestamp>
>;

export type GetChildReviewsByRootResponse = Response<
  PaginatedResponse<ChildReviewWithTimestamp>
>;

export type GetReviewByIdResponse = Response<ChildReviewWithTimestamp>;

// Search payload for root reviews
export interface SearchRootReviewsPayload {
  creatorId?: string;
  statuses?: string[];
}

export type SearchRootReviewsResponse = Response<
  PaginatedResponse<RootReviewWithTimestamp>
>;

// Search payload for child reviews (placeholder for future implementation)
export interface SearchChildReviewsPayload {
  stepNumber?: number;
  // Add more fields as needed
}
