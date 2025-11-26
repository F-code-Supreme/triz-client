import { createFileRoute } from '@tanstack/react-router';

import AdminAssignmentsManagementPage from '@/pages/main/admin/assignment';

export const Route = createFileRoute('/admin/assignment')({
  component: AdminAssignmentsManagementPage,
});
