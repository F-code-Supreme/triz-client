import { createFileRoute } from '@tanstack/react-router';

import SixStepsPage from '@/pages/main/customer/6-steps';

export const Route = createFileRoute('/(app)/6-steps/workflow/')({
  component: SixStepsPage,
});
