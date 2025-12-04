import { createFileRoute } from '@tanstack/react-router';

import JournalsPage from '@/pages/main/customer/journals';

export const Route = createFileRoute('/(app)/journals/')({
  component: JournalsPage,
});
