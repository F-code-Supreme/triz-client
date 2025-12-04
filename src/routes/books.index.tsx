import { createFileRoute } from '@tanstack/react-router';

import BookLibraryPage from '@/pages/main/public/books';

export const Route = createFileRoute('/books/')({
  component: BookLibraryPage,
});
