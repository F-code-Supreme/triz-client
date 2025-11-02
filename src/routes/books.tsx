import { createFileRoute } from '@tanstack/react-router';
import { lazy } from 'react';

import { Loadable } from '@/components/loadable';

const BookLibraryPage = Loadable(lazy(() => import('@/pages/main/books')));

export const Route = createFileRoute('/books')({
  component: BookLibraryPage,
});
