import { createFileRoute } from '@tanstack/react-router';
import { lazy } from 'react';

import { Loadable } from '@/components/loadable';

const CustomerBookLibraryPage = Loadable(
  lazy(() => import('@/pages/main/customer/books')),
);

export const Route = createFileRoute('/_auth/books/me')({
  component: CustomerBookLibraryPage,
});
