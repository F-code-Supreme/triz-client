import { createFileRoute } from '@tanstack/react-router';

import AdminManageCoursePage from '@/pages/main/admin/courses';

export const Route = createFileRoute('/admin/courses/')({
  component: AdminManageCoursePage,
});
