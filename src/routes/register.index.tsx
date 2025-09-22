import { createFileRoute, redirect } from '@tanstack/react-router';
import z from 'zod';

import { STRING_EMPTY } from '@/constants';
import RegisterPage from '@/pages/main/register';

export const Route = createFileRoute('/register/')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(STRING_EMPTY),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect });
    }
  },
  component: RegisterPage,
});
