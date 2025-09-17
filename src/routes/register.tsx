import { createFileRoute, redirect } from '@tanstack/react-router';

import RegisterPage from '@/pages/main/register';

export const Route = createFileRoute('/register')({
  validateSearch: (search) => ({
    redirect: (search.redirect as string) || '/',
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect });
    }
  },
  component: RegisterPage,
});
