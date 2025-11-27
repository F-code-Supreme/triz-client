import { createFileRoute } from '@tanstack/react-router';

import LearnTrizPage from '@/pages/main/public/learn-triz';

export const Route = createFileRoute('/learn-triz')({
  component: LearnTrizPage,
});
