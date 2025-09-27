import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import ChatInterface from '@/features/chat-triz/components/chat-interface';
import ConversationList from '@/features/chat-triz/components/conversation-list';
import { ChatLayout } from '@/layouts/chat-layout';

import type { Conversation } from '@/features/chat-triz/types';

const ChatTrizPage = () => {
  const { t } = useTranslation('pages.chat_triz');
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  // Handle conversation selection
  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    // TODO: Load messages for the selected conversation
    // You can implement this by creating another query hook for messages
  };
  return (
    <ChatLayout meta={{ title: t('page_meta_title') }}>
      <div className="flex gap-4 h-full bg-background">
        <div className="w-60 flex-shrink-0">
          <ConversationList
            selectedConversationId={selectedConversation?.id}
            onConversationSelect={handleConversationSelect}
          />
        </div>
        <ChatInterface />
      </div>
    </ChatLayout>
  );
};

export default ChatTrizPage;
