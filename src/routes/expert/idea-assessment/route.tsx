import { createFileRoute } from '@tanstack/react-router';

import ExpertIdeaAssessmentPage from '@/pages/main/expert/idea-assessment';

export const Route = createFileRoute('/expert/idea-assessment')({
  component: ExpertIdeaAssessmentPage,
});
