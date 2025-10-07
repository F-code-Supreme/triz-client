import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import ChatInterface from '@/features/chat-triz/components/chat-interface';
import ConversationSidebar from '@/features/conversation/components/conversation-sidebar';
import { useConversationsQueryStore } from '@/features/conversation/store/use-conversations-query-store';
import { useMediaQuery } from '@/hooks';
import { ChatLayout } from '@/layouts/chat-layout';

import type { Conversation } from '@/features/conversation/types';
import type { ImperativePanelHandle } from 'react-resizable-panels';

const ChatTrizPage = () => {
  const panelRef = useRef<ImperativePanelHandle>(null);
  const { t } = useTranslation('pages.chat_triz');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { activeConversationId, setActiveConversationId } =
    useConversationsQueryStore();

  const handleConversationSelect = (conversation: Conversation) => {
    setActiveConversationId(conversation.id);
    // Close mobile menu after selection
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleNewChat = () => {
    setActiveConversationId(null);
    // Close mobile menu after creating new chat
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
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
      {/* Mobile Sidebar Sheet */}
      {isMobile && (
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Conversations</SheetTitle>
              <SheetDescription>Your chat history</SheetDescription>
            </SheetHeader>
            <ConversationSidebar
              selectedConversationId={activeConversationId ?? undefined}
              onConversationSelect={handleConversationSelect}
              onNewChat={handleNewChat}
              isCollapsed={false}
              onCollapsedChange={() => {}}
            />
          </SheetContent>
        </Sheet>
      )}

      {/* Desktop Sidebar */}
      {!isMobile ? (
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
            <ChatInterface
              onMobileMenuClick={() => setIsMobileMenuOpen(true)}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <ChatInterface onMobileMenuClick={() => setIsMobileMenuOpen(true)} />
      )}
    </ChatLayout>
  );
};

export default ChatTrizPage;
