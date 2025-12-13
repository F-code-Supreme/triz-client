import { createFileRoute } from '@tanstack/react-router';

import GamesIndexPage from '@/pages/main/public/game';

export const Route = createFileRoute('/games')({
  component: GamesIndexPage,
});
