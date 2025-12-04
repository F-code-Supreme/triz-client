import { createFileRoute } from '@tanstack/react-router';

import EditCoursePage from '@/pages/main/admin/courses/edit';

export const Route = createFileRoute('/admin/courses/edit/$courseId')({
  component: EditCoursePage,
});
