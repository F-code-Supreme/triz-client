import { createFileRoute } from '@tanstack/react-router';

import SegmentationGamePage from '@/pages/main/game/segmentation';

export const Route = createFileRoute('/segmentation-game')({
  component: SegmentationGamePage,
});
