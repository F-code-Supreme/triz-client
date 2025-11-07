import { createFileRoute } from '@tanstack/react-router';

import WalletPage from '@/pages/main/customer/wallet';

export const Route = createFileRoute('/(app)/wallet')({
  component: WalletPage,
});
