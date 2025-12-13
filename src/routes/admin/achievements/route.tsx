import { createFileRoute } from '@tanstack/react-router';

import AdminManageAchievementPage from '@/pages/main/admin/achievements';

export const Route = createFileRoute('/admin/achievements')({
  component: AdminManageAchievementPage,
});
