import type { CourseLevel } from '@/features/courses/types';

export interface CreateCoursePayload {
  title: string;
  description: string;
  level: CourseLevel;
  price: number;
  dealPrice: number;
  thumbnailUrl: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  userName: string | null;
  courseId: string;
  courseTitle: string;
  status: string;
  lessonsTotal: number;
  lessonsCompleted: number;
  percentCompleted: number;
  enrolledAt: string;
  updatedAt: string;
}
