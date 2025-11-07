import { createFileRoute } from '@tanstack/react-router';

import AdminManagePackagePage from '../../../pages/main/admin/packages';

export const Route = createFileRoute('/admin/packages')({
  component: AdminManagePackagePage,
});
