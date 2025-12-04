import { createFileRoute } from '@tanstack/react-router';

import ForumPage from '@/pages/main/public/forum';

export const Route = createFileRoute('/forum')({
  component: ForumPage,
});
