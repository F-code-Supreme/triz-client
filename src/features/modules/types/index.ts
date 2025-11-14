interface Order {
  id: string;
  type: 'lesson' | 'assignment';
}

export interface Module {
  id: string;
  name: string;
  durationInMinutes: number;
  level: 'EASY' | 'MEDIUM' | 'HARD';
  createdAt: string;
  updatedAt: string;
  courseId: string;
  lessonCount: number;
  quizCount: number;
  assignmentCount: number;
  orders: Order[];
}
