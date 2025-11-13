import { createFileRoute } from '@tanstack/react-router';

import SubscriptionPage from '@/pages/main/customer/subscription';

export const Route = createFileRoute('/(app)/subscription')({
  component: SubscriptionPage,
});
