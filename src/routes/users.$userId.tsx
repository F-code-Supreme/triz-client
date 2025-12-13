import { createFileRoute } from '@tanstack/react-router';

import PublicProfilePage from '@/pages/main/public/profile';

export const Route = createFileRoute('/users/$userId')({
  component: PublicProfilePage,
});
