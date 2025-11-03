import { createFileRoute, redirect, Outlet } from '@tanstack/react-router';

import { Role } from '@/features/auth/types';

export const Route = createFileRoute('/_auth/admin')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.hasRole(Role.ADMIN)) {
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
