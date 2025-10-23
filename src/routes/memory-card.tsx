import { createFileRoute } from '@tanstack/react-router';

import MemoryCardPage from '@/pages/main/memory-card';

export const Route = createFileRoute('/memory-card')({
  component: MemoryCardPage,
});
