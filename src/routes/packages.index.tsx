import { createFileRoute } from '@tanstack/react-router';

import PackagesPricingPage from '@/pages/main/public/packages';

export const Route = createFileRoute('/packages/')({
  component: PackagesPricingPage,
});
