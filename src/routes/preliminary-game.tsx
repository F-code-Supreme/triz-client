import { createFileRoute } from '@tanstack/react-router';

import PreliminaryGamePage from '@/pages/main/game/preliminary';

export const Route = createFileRoute('/preliminary-game')({
  component: PreliminaryGamePage,
});
