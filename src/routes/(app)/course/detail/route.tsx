import { createFileRoute } from '@tanstack/react-router';

import CourseDetail from '@/pages/main/customer/course/detail';

export const Route = createFileRoute('/(app)/course/detail')({
  component: CourseDetail,
});
