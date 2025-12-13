import { createFileRoute } from '@tanstack/react-router';

import ModeratorReportsManagementPage from '@/pages/main/moderator/reports';

export const Route = createFileRoute('/moderator/reports')({
  component: ModeratorReportsManagementPage,
});
