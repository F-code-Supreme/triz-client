import type {
  ChildReviewWithTimestamp,
  ReviewStatus,
  RootReviewWithTimestamp,
} from '../../types';
import type { PaginatedResponse } from '@/types';

// Response types for API calls
export type GetRootReviewsByProblemResponse =
  PaginatedResponse<RootReviewWithTimestamp>;

export type GetRootReviewsByUserResponse =
  PaginatedResponse<RootReviewWithTimestamp>;

export type GetChildReviewsByRootResponse =
  PaginatedResponse<ChildReviewWithTimestamp>;

export type GetReviewByIdResponse = RootReviewWithTimestamp & {
  childReviews?: ChildReviewWithTimestamp[];
};

// Search payload for root reviews
export interface SearchRootReviewsPayload {
  creatorId?: string;
  statuses?: ReviewStatus[];
}

export type SearchRootReviewsResponse =
  PaginatedResponse<RootReviewWithTimestamp>;

// Search payload for child reviews
export interface SearchChildReviewsPayload {
  stepNumber?: number | null;
  // Add more fields as needed
}

export type SearchChildReviewsResponse =
  PaginatedResponse<ChildReviewWithTimestamp>;
