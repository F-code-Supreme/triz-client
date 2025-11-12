import { createFileRoute } from '@tanstack/react-router';

import AdminCustomersPage from '@/pages/main/admin/users';

export const Route = createFileRoute('/admin/users/')({
  component: AdminCustomersPage,
});
