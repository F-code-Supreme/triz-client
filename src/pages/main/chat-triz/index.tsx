import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import ChatInterface from '@/features/chat-triz/components/chat-interface';
import ConversationList from '@/features/conversation/components/conversation-list';
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

  return (
    <ChatLayout meta={{ title: t('page_meta_title') }}>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={20}
          minSize={15}
          maxSize={30}
          collapsible={true}
          collapsedSize={4}
          onCollapse={() => setIsCollapsed(true)}
          onExpand={() => setIsCollapsed(false)}
          ref={panelRef}
        >
          <ConversationList
            selectedConversationId={activeConversationId ?? undefined}
            onConversationSelect={handleConversationSelect}
            onNewChat={handleNewChat}
            isCollapsed={isCollapsed}
            toggleCollapse={() =>
              isCollapsed
                ? panelRef.current?.expand()
                : panelRef.current?.collapse()
            }
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
