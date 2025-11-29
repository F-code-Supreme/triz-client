import { createFileRoute } from '@tanstack/react-router';

import PreliminaryGamePage from '@/pages/main/customer/games/preliminary';

export const Route = createFileRoute('/(app)/games/preliminary-game')({
  component: PreliminaryGamePage,
});
