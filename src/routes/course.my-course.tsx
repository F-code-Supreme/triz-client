import CoursePage from '@/pages/main/course/my-course';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/course/my-course')({
  component: CoursePage,
});
