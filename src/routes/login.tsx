import { createFileRoute } from '@tanstack/react-router';

import { LoginPage } from '@/pages/main/login/main';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});
