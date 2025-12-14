import { createFileRoute } from '@tanstack/react-router';

import SixStepsIntroductionPage from '@/pages/main/public/6-steps/introduction';

export const Route = createFileRoute('/6-steps')({
  component: SixStepsIntroductionPage,
});
