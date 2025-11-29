import { createFileRoute } from '@tanstack/react-router';

import MemoryCardPage from '@/pages/main/customer/games/memory-card';

export const Route = createFileRoute('/(app)/games/memory-card')({
  component: MemoryCardPage,
});
