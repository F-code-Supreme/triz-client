import { createFileRoute } from '@tanstack/react-router';

import AdminSystemConfigPage from '@/pages/main/admin/system-config';

export const Route = createFileRoute('/admin/system-config/')({
  component: AdminSystemConfigPage,
});
