import { createFileRoute } from '@tanstack/react-router';

import CreateCoursePage from '@/pages/main/admin/courses/create';

export const Route = createFileRoute('/admin/courses/create')({
  component: CreateCoursePage,
});
