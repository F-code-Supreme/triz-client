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
