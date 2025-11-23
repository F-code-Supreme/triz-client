import CourseLearnPage from '@/pages/main/course/learn';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/course/learn/$slug')({
  component: CourseLearnPage,
});
