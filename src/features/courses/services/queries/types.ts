import type { Course } from '@/features/courses/types';
import type { PaginatedResponse } from '@/types';
import { Enrollment } from '../mutations/types';

export type CourseResponse = PaginatedResponse<Course>;
export type CourseEnrollResponse = PaginatedResponse<Enrollment>;
