import { createFileRoute } from '@tanstack/react-router';
import { lazy } from 'react';

import { Loadable } from '@/components/loadable';

const AdminBooksManagementPage = Loadable(
  lazy(() => import('@/pages/main/admin/books')),
);

export const Route = createFileRoute('/admin/books')({
  component: AdminBooksManagementPage,
});
