import { createFileRoute } from '@tanstack/react-router';

import AllCoursePage from '@/pages/main/course';

export const Route = createFileRoute('/course/')({
  component: AllCoursePage,
});
