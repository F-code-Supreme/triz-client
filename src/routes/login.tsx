import { createFileRoute, redirect } from '@tanstack/react-router';

import LoginPage from '@/pages/main/login';

export const Route = createFileRoute('/login')({
  validateSearch: (search) => ({
    redirect: (search.redirect as string) || '/',
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect });
    }
  },
  component: LoginPage,
});
