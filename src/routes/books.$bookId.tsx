import { createFileRoute } from '@tanstack/react-router';
import { lazy } from 'react';

import { Loadable } from '@/components/loadable';
const BookDetailPage = Loadable(
  lazy(() => import('@/pages/main/books/detail')),
);

export const Route = createFileRoute('/books/$bookId')({
  component: BookDetailPage,
});
