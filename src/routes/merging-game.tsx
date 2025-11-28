import { createFileRoute } from '@tanstack/react-router';

import MergingGamePage from '@/pages/main/game/merging';

export const Route = createFileRoute('/merging-game')({
  component: MergingGamePage,
});
