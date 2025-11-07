import CourseDetail from '@/pages/main/course/detail';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/course/detail')({
  component: CourseDetail,
});
