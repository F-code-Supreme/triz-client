import { createFileRoute } from '@tanstack/react-router';

import CustomerBookLibraryPage from '@/pages/main/customer/books';

export const Route = createFileRoute('/(app)/books/me')({
  component: CustomerBookLibraryPage,
});
