import { createFileRoute } from '@tanstack/react-router';

import CourseDetail from '@/pages/main/course/detail';

export const Route = createFileRoute('/course/detail')({
  component: CourseDetail,
});
