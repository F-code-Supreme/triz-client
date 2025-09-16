import { createFileRoute, redirect } from '@tanstack/react-router';
import { lazy } from 'react';

import { Loadable } from '@/components/loadable';

const RegisterPage = Loadable(lazy(() => import('@/pages/main/register')));

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
