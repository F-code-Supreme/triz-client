import type { CourseLevel } from '@/features/courses/types';

export interface CreateCoursePayload {
  title: string;
  description: string;
  shortDescription: string;
  durationInMinutes: number;
  level: CourseLevel;
  price: number;
  dealPrice: number;
  thumbnailUrl: string;
}
