import { createFileRoute } from '@tanstack/react-router';

import AdminDashboardPage from '@/pages/main/admin/dashboard';

export const Route = createFileRoute('/admin/')({
  component: AdminDashboardPage,
});
