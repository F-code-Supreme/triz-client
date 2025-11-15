export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorAvatar?: string;
  thumbnail: string;
  category: string;
  level: CourseLevel;
  duration: number; // in hours
  totalLessons: number;
  progress: number; // 0-100
  status: CourseStatus;
  rating: number;
  totalStudents: number;
  price: number;
  originalPrice?: number;
  isEnrolled: boolean;
  enrolledAt?: string;
  lastAccessedAt?: string;
  completedAt?: string;
  weeks: CourseWeek[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseWeek {
  id: string;
  title: string;
  description?: string;
  order: number;
  lessons: CourseLesson[];
  isUnlocked: boolean;
  completedLessons: number;
  totalLessons: number;
}

export interface CourseLesson {
  id: string;
  title: string;
  description?: string;
  type: LessonType;
  duration: number; // in minutes
  order: number;
  isCompleted: boolean;
  isUnlocked: boolean;
  videoUrl?: string;
  content?: string;
  resources?: LessonResource[];
}

export interface LessonResource {
  id: string;
  title: string;
  type: ResourceType;
  url: string;
  size?: number;
}

export enum CourseLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export enum CourseStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  PAUSED = 'PAUSED',
}

export enum LessonType {
  VIDEO = 'VIDEO',
  TEXT = 'TEXT',
  QUIZ = 'QUIZ',
  ASSIGNMENT = 'ASSIGNMENT',
  DISCUSSION = 'DISCUSSION',
}

export enum ResourceType {
  PDF = 'PDF',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  DOCUMENT = 'DOCUMENT',
  LINK = 'LINK',
}

export interface CourseFilters {
  search?: string;
  status?: CourseStatus;
  category?: string;
  level?: CourseLevel;
  sortBy?: 'title' | 'progress' | 'lastAccessed' | 'enrolledAt';
  sortOrder?: 'asc' | 'desc';
}

export interface CourseProgress {
  courseId: string;
  completedLessons: number;
  totalLessons: number;
  percentage: number;
  lastLessonId?: string;
  timeSpent: number; // in minutes
}
