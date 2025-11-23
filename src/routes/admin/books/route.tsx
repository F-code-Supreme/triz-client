import { createFileRoute } from '@tanstack/react-router';

import AdminBooksManagementPage from '@/pages/main/admin/books';

export const Route = createFileRoute('/admin/books')({
  component: AdminBooksManagementPage,
});
