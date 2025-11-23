import CourseDetail from '@/pages/main/course/overview';
import { createFileRoute } from '@tanstack/react-router';

import CourseDetail from '@/pages/main/course/detail';

export const Route = createFileRoute('/admin/course/$courseId/')({
  component: CourseDetail,
});
