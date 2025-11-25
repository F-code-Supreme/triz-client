export interface Lesson {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  videoUrl: string | null;
  type: 'VIDEO' | 'ARTICLE' | 'QUIZ' | string;
  status: 'ACTIVE' | 'INACTIVE' | string;
  createdAt: string;
  updatedAt: string;
  moduleName: string;
}
