import { createFileRoute } from '@tanstack/react-router';

import CoursePage from '@/pages/main/customer/course/my-course';

export const Route = createFileRoute('/(app)/course/my-course')({
  component: CoursePage,
});
