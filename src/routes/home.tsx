import { createFileRoute } from '@tanstack/react-router';

import HomePage from '@/pages/main/public/home';

export const Route = createFileRoute('/home')({
  component: HomePage,
});
