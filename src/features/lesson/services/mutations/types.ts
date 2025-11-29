export interface CreateLessonPayload {
  title: string;
  description: string;
  content?: string;
  videoUrl?: string;
  type: 'TEXT' | 'VIDEO';
}
