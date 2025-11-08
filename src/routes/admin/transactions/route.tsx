import { createFileRoute } from '@tanstack/react-router';

import AdminTransactionsPage from '@/pages/main/admin/transactions';

export const Route = createFileRoute('/admin/transactions')({
  component: AdminTransactionsPage,
});
