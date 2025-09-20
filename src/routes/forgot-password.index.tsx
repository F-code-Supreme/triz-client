import { createFileRoute, redirect } from '@tanstack/react-router';
import z from 'zod';

import { STRING_EMPTY } from '@/constants';
import ForgotPasswordPage from '@/pages/main/forgot-password';

export const Route = createFileRoute('/forgot-password/')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(STRING_EMPTY),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect });
    }
  },
  component: ForgotPasswordPage,
});
