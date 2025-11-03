import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import { Role } from '@/features/auth/types';

export const Route = createFileRoute('/(app)')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
    if (context.auth.hasRole(Role.ADMIN)) {
      throw redirect({
        to: '/admin',
        search: {
          redirect: location.href,
        },
      });
    }
  },

  component: () => <Outlet />,
});
