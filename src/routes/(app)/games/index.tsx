import { createFileRoute } from '@tanstack/react-router';

import GamesIndexPage from '@/pages/main/customer/games';

export const Route = createFileRoute('/(app)/games/')({
  component: GamesIndexPage,
});
