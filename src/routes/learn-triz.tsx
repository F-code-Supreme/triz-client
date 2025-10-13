import { createFileRoute } from '@tanstack/react-router';

import LearnTrizPage from '@/pages/main/learn-triz';

export const Route = createFileRoute('/learn-triz')({
  component: LearnTrizPage,
});
