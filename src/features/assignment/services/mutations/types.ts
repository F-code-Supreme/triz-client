export interface CreateAssignmentPayload {
  title?: string;
  description?: string;
  durationInMinutes: number;
  maxAttempts?: number;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface ExpertReviewPayload {
  passed: boolean;
  comment?: string;
}
