import { createFileRoute } from '@tanstack/react-router';

import AdminSubscriptionsPage from '@/pages/main/admin/subscriptions';

export const Route = createFileRoute('/admin/subscriptions')({
  component: AdminSubscriptionsPage,
});
