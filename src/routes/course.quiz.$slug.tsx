import { createFileRoute } from '@tanstack/react-router';

import CourseQuizPage from '@/pages/main/customer/course/quiz-course';

export const Route = createFileRoute('/course/quiz/$slug')({
  component: CourseQuizPage,
});
