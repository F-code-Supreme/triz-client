import { createFileRoute } from '@tanstack/react-router';

import CourseLearnPage from '@/pages/main/customer/course/learn';

export const Route = createFileRoute('/course/learn/$slug')({
  component: CourseLearnPage,
});
