import type { Enrollment } from '../mutations/types';
import type { Course } from '@/features/courses/types';
import type { PaginatedResponse } from '@/types';

export type CourseResponse = PaginatedResponse<Course>;
export type CourseEnrollResponse = PaginatedResponse<Enrollment>;
