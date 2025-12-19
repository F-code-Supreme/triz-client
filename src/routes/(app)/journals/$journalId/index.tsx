import { createFileRoute } from '@tanstack/react-router';

import JournalDetailPage from '@/pages/main/customer/journals/detail';

export const Route = createFileRoute('/(app)/journals/$journalId/')({
  component: JournalDetailPage,
});
