import { createFileRoute } from '@tanstack/react-router';

import CourseOverviewPage from '@/pages/main/customer/course/overview';

export const Route = createFileRoute('/course/$slug')({
  component: CourseOverviewPage,
});
