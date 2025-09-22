import { createFileRoute, redirect } from '@tanstack/react-router';

import { Role } from '@/features/auth/types';
import AdminDashboardPage from '@/pages/main/admin/dashboard';

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
  component: AdminDashboardPage,
});
