import { createFileRoute } from '@tanstack/react-router';

import MergingGamePage from '@/pages/main/customer/games/merging';

export const Route = createFileRoute('/(app)/games/merging-game')({
  component: MergingGamePage,
});
