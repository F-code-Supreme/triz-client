import { createFileRoute } from '@tanstack/react-router';
import AdminQuizzesPage from '@/pages/main/admin/quizzes';

export const Route = createFileRoute('/admin/quizzes')({
  component: AdminQuizzesPage,
});
