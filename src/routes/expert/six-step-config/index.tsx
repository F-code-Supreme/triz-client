import { createFileRoute } from '@tanstack/react-router';

import ExpertSixStepConfigPage from '@/pages/main/expert/six-step-config';

export const Route = createFileRoute('/expert/six-step-config/')({
  component: ExpertSixStepConfigPage,
});
