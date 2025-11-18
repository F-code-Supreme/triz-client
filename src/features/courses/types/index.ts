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
  price?: number;
  dealPrice?: number | null;
  slug?: string;
  thumbnailUrl?: string | null;
  // keep old field for backward-compatibility
  thumbnail?: string | null;
  learnerCount?: number;
  status?: CourseStatus;
  orders?: Order[];
  createdAt?: string;
  updatedAt?: string;
}

interface CourseModule {
  id: string;
  name: string;
  durationInMinutes: number;
  level: string;
  lessonCount: number;
}

export interface CourseDetailResponse extends Course {
  modules?: CourseModule[];
  totalModules?: number;
  totalLessons?: number;
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
    status: string;
    createdAt: string;
    updatedAt: string;
    moduleId: string;
    moduleName: string;
    userId: string;
  }[];
}
