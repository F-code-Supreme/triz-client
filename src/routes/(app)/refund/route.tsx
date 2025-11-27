import { createFileRoute } from '@tanstack/react-router';

import RefundPage from '@/pages/main/customer/refund';

export const Route = createFileRoute('/(app)/refund')({
  component: RefundPage,
});
