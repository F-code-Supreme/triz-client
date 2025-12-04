import { createFileRoute } from '@tanstack/react-router';

import ExpertDashboardPage from '@/pages/main/expert/dashboard';

export const Route = createFileRoute('/expert/dashboard')({
  component: ExpertDashboardPage,
});
