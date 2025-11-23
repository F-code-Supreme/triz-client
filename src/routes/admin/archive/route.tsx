import { createFileRoute } from '@tanstack/react-router';

import AdminArchivePage from '@/pages/main/admin/archive';

export const Route = createFileRoute('/admin/archive')({
  component: AdminArchivePage,
});
