import { createFileRoute } from '@tanstack/react-router';

import NewPasswordPage from '@/pages/main/forgot-password/new-password';

export const Route = createFileRoute('/forgot-password/new-password')({
  component: NewPasswordPage,
});
