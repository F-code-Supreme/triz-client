export enum LessonType {
  VIDEO = 'VIDEO',
  TEXT = 'TEXT',
  QUIZ = 'QUIZ',
  ASSIGNMENT = 'ASSIGNMENT',
  DISCUSSION = 'DISCUSSION',
}

export interface CourseLesson {
  id: string;
  title: string;
  type: LessonType;
  duration: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  description?: string;
  videoUrl?: string;
  content?: string;
  resources?: {
    id: string;
    title: string;
    type: string;
    url: string;
    size?: number;
  }[];
}

export interface CourseWeek {
  id: string;
  order: number;
  title: string;
  isUnlocked: boolean;
  completedLessons: number;
  totalLessons: number;
  lessons: CourseLesson[];
}
// Filters for course listing
export interface CourseFilters {
  search?: string;
  status?: string;
  category?: string;
  level?: string;
  sortBy?: 'title' | 'progress' | 'lastAccessed' | 'enrolledAt';
  sortOrder?: 'asc' | 'desc';
}
import type { Module } from '@/features/modules/types';

export interface Order {
  moduleId: string;
  type: string;
}

export type CourseLevel = 'STARTER' | 'INTERMEDIATE' | 'ADVANCED' | string;

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

export interface ModuleResponse {
  id: string;
  name: string;
  durationInMinutes: number;
  level: string;
  createdAt: string;
  updatedAt: string;
  courseId: string;
  lessonCount: number;
  quizCount: number;
  assignmentCount: number;
  orders: Order[];
}

export interface AssignmentResponse {
  content: {
    id: string;
    title: string;
    description: string;
    durationInMinutes: number;
    maxAttempts: number;
    criteria: string[];
    status: string;
    createdAt: string;
    updatedAt: string;
    moduleId: string;
    moduleName: string;
    userId: string;
  }[];
}

export interface BaseContentItem {
  id: string;
  type: 'lesson' | 'assignment' | 'quiz';
  order: number;
  title: string;
  isCompleted?: boolean;
}

export interface LessonContentItem extends BaseContentItem {
  type: 'lesson';
  lessonData: {
    id: string;
    durationInMinutes: number;
    name: string;
    videoUrl?: string;
    content?: string;
    createdAt: string;
    updatedAt: string;
    moduleId: string;
    moduleName: string;
  };
}

export interface AssignmentContentItem extends BaseContentItem {
  type: 'assignment';
  assignmentData: {
    id: string;
    title: string;
    description: string;
    durationInMinutes: number;
    maxAttempts: number;
    criteria: string[];
    status: string;
    createdAt: string;
    updatedAt: string;
    moduleId: string;
    moduleName: string;
  };
}

export interface QuizContentItem extends BaseContentItem {
  type: 'quiz';
  quizData: {
    id: string;
    title: string;
    description: string;
    imageSource?: string;
    durationInMinutes: number;
    createdAt: string;
    updatedAt: string;
    moduleId: string;
    moduleName: string;
  };
}

export type ModuleContentItem =
  | LessonContentItem
  | AssignmentContentItem
  | QuizContentItem;

export interface EnhancedModule {
  id: string;
  name: string;
  durationInMinutes: number;
  level: 'EASY' | 'MEDIUM' | 'HARD';
  totalItems: number;
  contents: ModuleContentItem[];
  order: number;
  isCompleted?: boolean;
}

export interface CourseContentState {
  modules: EnhancedModule[];
  currentItemId: string | null;
  currentModuleId: string | null;
  currentItem: ModuleContentItem | null;
}

export interface CourseDetailResponse extends Course {
  modules: Module[];
  totalModules?: number;
  totalLessons?: number;
}
