import { createFileRoute } from '@tanstack/react-router';

import ModeratorDashboardPage from '@/pages/main/moderator/dashboard';

export const Route = createFileRoute('/moderator/dashboard')({
  component: ModeratorDashboardPage,
});
