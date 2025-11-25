export interface CreateAssignmentPayload {
  title: string;
  description?: string;
  durationInMinutes: number;
  maxAttempts?: number;
}
