export interface CreateAssignmentPayload {
  title: string;
  description?: string;
  durationInMinutes: number;
  maxAttempts?: number;
}

export interface ExpertReviewPayload {
  passed: boolean;
  comment?: string;
}
