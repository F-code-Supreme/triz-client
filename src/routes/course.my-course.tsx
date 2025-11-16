import { createFileRoute } from '@tanstack/react-router';

import CoursePage from '@/pages/main/course/my-course';

export const Route = createFileRoute('/course/my-course')({
  component: CoursePage,
});
