import { createFileRoute } from '@tanstack/react-router';

import SegmentationGamePage from '@/pages/main/customer/games/segmentation';

export const Route = createFileRoute('/(app)/games/segmentation-game')({
  component: SegmentationGamePage,
});
