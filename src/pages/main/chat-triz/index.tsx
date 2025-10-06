import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import ChatInterface from '@/features/chat-triz/components/chat-interface';
import ConversationSidebar from '@/features/conversation/components/conversation-sidebar';
import { useConversationsQueryStore } from '@/features/conversation/store/use-conversations-query-store';
import { ChatLayout } from '@/layouts/chat-layout';

import type { Conversation } from '@/features/conversation/types';
import type { ImperativePanelHandle } from 'react-resizable-panels';

const ChatTrizPage = () => {
  const panelRef = useRef<ImperativePanelHandle>(null);
  const { t } = useTranslation('pages.chat_triz');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { activeConversationId, setActiveConversationId } =
    useConversationsQueryStore();

  const handleConversationSelect = (conversation: Conversation) => {
    setActiveConversationId(conversation.id);
  };

  const handleNewChat = () => {
    setActiveConversationId(null);
  };

  const handleCollapsedChange = (collapsed: boolean) => {
    if (collapsed) {
      panelRef.current?.collapse();
    } else {
      panelRef.current?.expand();
    }
  };

  return (
    <ChatLayout meta={{ title: t('page_meta_title') }}>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={20}
          minSize={10}
          maxSize={30}
          collapsible={true}
          collapsedSize={4}
          onCollapse={() => setIsCollapsed(true)}
          onExpand={() => setIsCollapsed(false)}
          ref={panelRef}
        >
          <ConversationSidebar
            selectedConversationId={activeConversationId ?? undefined}
            onConversationSelect={handleConversationSelect}
            onNewChat={handleNewChat}
            isCollapsed={isCollapsed}
            onCollapsedChange={handleCollapsedChange}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <ChatInterface />
        </ResizablePanel>
      </ResizablePanelGroup>
    </ChatLayout>
  );
};

export default ChatTrizPage;
