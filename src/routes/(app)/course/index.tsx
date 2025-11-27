import { createFileRoute } from '@tanstack/react-router';

import AllCoursePage from '@/pages/main/customer/course';

export const Route = createFileRoute('/(app)/course/')({
  component: AllCoursePage,
});
