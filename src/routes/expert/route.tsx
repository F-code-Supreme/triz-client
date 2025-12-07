import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import z from 'zod';

import { Role } from '@/features/auth/types';

export const Route = createFileRoute('/expert')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated || !context.auth.hasRole(Role.EXPERT)) {
      throw redirect({
        to: '/unauthorized',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: () => <Outlet />,
});
