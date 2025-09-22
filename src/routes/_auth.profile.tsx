import { createFileRoute } from '@tanstack/react-router';

import ProfilePage from '@/pages/main/profile';

export const Route = createFileRoute('/_auth/profile')({
  component: ProfilePage,
});
