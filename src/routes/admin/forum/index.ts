import { createFileRoute } from '@tanstack/react-router';

import AdminForumPostManage from '@/pages/main/admin/forum';

export const Route = createFileRoute('/admin/forum/')({
  component: AdminForumPostManage,
});
