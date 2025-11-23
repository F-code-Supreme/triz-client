import type { Module } from '@/features/modules/types';

export interface Order {
  id: string;
  type: string;
}

export type CourseLevel =
  | 'STARTER'
  | 'BEGINNER'
  | 'INTERMEDIATE'
  | 'ADVANCED'
  | string;

export type CourseStatus = 'ACTIVE' | 'INACTIVE' | string;

export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription?: string | null;
  durationInMinutes?: number;
  level?: CourseLevel;
  price: number;
  dealPrice: number;
  slug?: string;
  thumbnailUrl: string;
  // keep old field for backward-compatibility
  thumbnail?: string | null;
  learnerCount?: number;
  totalModules?: number;
  totalLessons?: number;
  status?: CourseStatus;
  orders?: Order[];
  createdAt?: string;
  updatedAt?: string;
  modules?: Module[];
}
