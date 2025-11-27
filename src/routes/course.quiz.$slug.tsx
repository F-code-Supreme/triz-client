import CourseQuizPage from '@/pages/main/customer/course/quiz-course';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/course/quiz/$slug')({
  component: CourseQuizPage,
});
