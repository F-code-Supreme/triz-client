import { createFileRoute } from '@tanstack/react-router';

import UnauthorizedPage from '@/pages/global/unauthorized';

export const Route = createFileRoute('/unauthorized')({
  validateSearch: (search) => ({
    redirect: (search.redirect as string) || '/',
  }),
  component: UnauthorizedPage,
});
