import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/books/me')({
  component: RouteComponent,
});
