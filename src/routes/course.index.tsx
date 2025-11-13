import AllCoursePage from '@/pages/main/course';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/course/')({
  component: AllCoursePage,
});
