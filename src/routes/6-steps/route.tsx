import { createFileRoute } from '@tanstack/react-router';

import SixStepsPage from '@/pages/main/customer/6-steps';

export const Route = createFileRoute('/6-steps')({
  component: SixStepsPage,
});
