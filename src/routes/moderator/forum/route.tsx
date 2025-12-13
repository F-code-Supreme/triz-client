import { createFileRoute } from '@tanstack/react-router';

import ModeratorForumManagementPage from '@/pages/main/moderator/forum';

export const Route = createFileRoute('/moderator/forum')({
  component: ModeratorForumManagementPage,
});
