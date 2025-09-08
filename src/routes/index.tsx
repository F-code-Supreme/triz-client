import { createFileRoute } from '@tanstack/react-router';

import { HomePage } from '@/pages/main/home';

export const Route = createFileRoute('/')({
  component: HomePage,
});
