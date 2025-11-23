<<<<<<< HEAD
import MyCoursePage from '@/pages/main/course/my-course';
=======
>>>>>>> 784ebaa3390456145844ed682cea81b750ff0f66
import { createFileRoute } from '@tanstack/react-router';

import CoursePage from '@/pages/main/course/my-course';

export const Route = createFileRoute('/course/my-course')({
  component: MyCoursePage,
});
