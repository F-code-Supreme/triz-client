import { createFileRoute, redirect } from '@tanstack/react-router';
import z from 'zod';

import { STRING_EMPTY } from '@/constants';
import LoginPage from '@/pages/main/login';

export const Route = createFileRoute('/login')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(STRING_EMPTY),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || '/' });
    }
  },
  component: LoginPage,
});
