import { createFileRoute } from '@tanstack/react-router';

import ExpertAssignmentsManagementPage from '@/pages/main/expert/assignment';

export const Route = createFileRoute('/expert/assignment')({
  component: ExpertAssignmentsManagementPage,
});
