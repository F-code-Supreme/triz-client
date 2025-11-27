import CourseOverviewPage from '@/pages/main/customer/course/overview';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/course/$slug')({
  component: CourseOverviewPage,
});
