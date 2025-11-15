import { createFileRoute } from '@tanstack/react-router';

import AdminCustomerDetailPage from '@/pages/main/admin/users/detail';

export const Route = createFileRoute('/admin/users/$userId')({
  component: AdminCustomerDetailPage,
});
