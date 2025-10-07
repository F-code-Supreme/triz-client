import { createFileRoute } from '@tanstack/react-router';

import ChatTrizPage from '@/pages/main/chat-triz';

export const Route = createFileRoute('/chat-triz')({
  component: ChatTrizPage,
});
