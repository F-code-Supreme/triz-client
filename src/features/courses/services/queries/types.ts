import type { PaginatedResponse } from '@/types';

interface Order {
  id: string;
  type: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  durationInMinutes: number;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'; // có thể mở rộng nếu cần
  price: number;
  dealPrice: number;
  slug: string;
  thumbnailUrl: string;
  learnerCount: number;
  status: 'ACTIVE' | 'INACTIVE';
  orders: Order[];
  createdAt?: string;
  updatedAt?: string;
}

export type CourseResponse = PaginatedResponse<Course>;
