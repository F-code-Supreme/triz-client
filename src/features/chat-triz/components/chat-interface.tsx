import {
  MicIcon,
  // PaperclipIcon,
  RotateCcwIcon,
  CopyIcon,
  CheckIcon,
  Menu,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

import { AudioRecorderWithVisualizer } from '@/components/ui/audio-recorder-with-visualizer';
import { useAudioRecorderStore } from '@/components/ui/audio-recorder-with-visualizer/store/use-audio-recorder-store';
import { Button } from '@/components/ui/button';
import { Action, Actions } from '@/components/ui/shadcn-io/ai/actions';
import {
  ConversationContent,
  ConversationScrollButton,
  Conversation,
} from '@/components/ui/shadcn-io/ai/conversation';
import { Loader } from '@/components/ui/shadcn-io/ai/loader';
import {
  Message,
  MessageAvatar,
  MessageContent,
} from '@/components/ui/shadcn-io/ai/message';
import {
  PromptInput,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from '@/components/ui/shadcn-io/ai/prompt-input';
import { Response } from '@/components/ui/shadcn-io/ai/response';
import { STRING_EMPTY } from '@/constants';
import useAuth from '@/features/auth/hooks/use-auth';
import { useGetMeQuery } from '@/features/auth/services/queries';
import { useChatMutation } from '@/features/chat-triz/services/mutations';
import { useGetConversationQuery } from '@/features/conversation/services/queries';
import { useConversationsQueryStore } from '@/features/conversation/store/use-conversations-query-store';
import { useGetActiveSubscriptionByUserQuery } from '@/features/subscription/services/queries';

type ChatMessage = {
  id: string;
  content: string | null;
  role: 'USER' | 'ASSISTANT' | null;
  createdAt: string | null;
  parentId: string | null;
  isStreaming?: boolean;
};

const convertRoleToLowerCase = (
  role: 'USER' | 'ASSISTANT' | null,
): 'user' | 'assistant' | 'system' => {
  if (role === 'USER') return 'user';
  if (role === 'ASSISTANT') return 'assistant';
  return 'system';
};

interface ChatInterfaceProps {
  onMobileMenuClick?: () => void;
}

const ChatInterface = ({ onMobileMenuClick }: ChatInterfaceProps) => {
  const { activeConversationId, setActiveConversationId } =
    useConversationsQueryStore();

  const { user } = useAuth();
  const { data: userData } = useGetMeQuery();

  const { isRecording, startRecording } = useAudioRecorderStore();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState(STRING_EMPTY);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch messages for active conversation
  const { data: messagesData } = useGetConversationQuery(activeConversationId);

  // Fetch active subscription for token display
  const { data: activeSubscription } = useGetActiveSubscriptionByUserQuery(
    user?.id,
  );

  // Chat mutation
  const { mutateAsync: chatMutation, isPending: isTyping } = useChatMutation();

  // Load messages when conversation changes
  useEffect(() => {
    if (messagesData?.mappings) {
      setMessages(Object.values(messagesData.mappings).slice(1));
    } else {
      setMessages([]);
    }
  }, [messagesData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputValue.trim() || isTyping) return;

    const messageContent = inputValue.trim();
    const messageId = uuidv4();
    const newConversationId = activeConversationId || uuidv4();

    // Find the last assistant message to use as parent
    const lastAssistantMessage = [...messages]
      .reverse()
      .find((msg) => msg.role === 'ASSISTANT');
    const parentId = lastAssistantMessage?.id || null;

    // Add user message optimistically
    const userMessage: ChatMessage = {
      id: messageId,
      content: messageContent,
      role: 'USER',
      createdAt: new Date().toISOString(),
      parentId,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue(STRING_EMPTY);

    const loadingMessageId = uuidv4();
    const loadingMessage: ChatMessage = {
      id: loadingMessageId,
      content: STRING_EMPTY,
      role: 'ASSISTANT',
      createdAt: new Date().toISOString(),
      parentId: messageId,
      isStreaming: true,
    };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      const response = await chatMutation({
        id: messageId,
        content: messageContent,
        parentId,
        conversationId: newConversationId,
      });

      // Update conversation ID if new
      if (!activeConversationId) {
        setActiveConversationId(response.data.conversationId);
      }

      // Replace loading message with actual response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessageId
            ? {
                ...response.data.message,
                isStreaming: false,
              }
            : msg,
        ),
      );
    } catch (error) {
      // Remove loading message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== loadingMessageId));

      // Check if it's a subscription error
      if (
        error &&
        typeof error === 'object' &&
        'type' in error &&
        error.type === 'SUBSCRIPTION_ERROR'
      ) {
        toast.error(
          'message' in error && typeof error.message === 'string'
            ? error.message
            : "You don't have an active subscription or your daily tokens have been exhausted.",
          {
            description:
              'Please upgrade your subscription or wait until tomorrow to continue chatting.',
            duration: 5000,
          },
        );
      } else {
        toast.error('Failed to send message. Please try again.');
      }
      console.error('Failed to send message:', error);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setInputValue(STRING_EMPTY);
    setActiveConversationId(null);
  };

  const handleCopy = async (content: string | null, messageId: string) => {
    if (!content) return;

    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl rounded-l-none border bg-background shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-3 h-14">
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 md:hidden"
            onClick={onMobileMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-green-500" />
            <span className="font-medium text-sm">Chat Triz</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Subscription Token Display */}
          {activeSubscription && (
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-accent/50">
              <Zap className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium">
                {activeSubscription.tokensPerDayRemaining.toLocaleString()}
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 px-2"
          >
            <RotateCcwIcon className="size-4" />
            <span className="ml-1 hidden sm:inline">Reset</span>
          </Button>
        </div>
      </div>
      {/* Conversation Area */}
      <Conversation className="flex-1">
        <ConversationContent className="space-y-4">
          {messages.map((message, index) => {
            const isLastMessage = index === messages.length - 1;
            return (
              <div key={message.id} className="group relative space-y-3">
                <Message from={convertRoleToLowerCase(message.role)}>
                  <MessageContent>
                    {message.isStreaming && message.content === STRING_EMPTY ? (
                      <div className="flex items-center gap-2">
                        <Loader size={14} />
                        <span className="text-muted-foreground text-sm">
                          Thinking...
                        </span>
                      </div>
                    ) : (
                      <Response>{message.content}</Response>
                    )}
                  </MessageContent>
                  <MessageAvatar
                    src={
                      message.role === 'USER'
                        ? userData?.avatarUrl || '/logo.svg'
                        : '/chatbot.svg'
                    }
                    name={message.role === 'USER' ? 'User' : 'AI'}
                  />
                </Message>
                {message.content && (
                  <div
                    className={`${
                      message.role === 'USER'
                        ? 'mr-10 flex justify-end'
                        : 'ml-10'
                    } ${
                      isLastMessage
                        ? 'opacity-100'
                        : 'opacity-0 group-hover:opacity-100'
                    } transition-opacity duration-200`}
                  >
                    <Actions>
                      <Action
                        tooltip="Copy"
                        onClick={() => handleCopy(message.content, message.id)}
                      >
                        {copiedId === message.id ? (
                          <CheckIcon className="size-4" />
                        ) : (
                          <CopyIcon className="size-4" />
                        )}
                      </Action>
                    </Actions>
                  </div>
                )}
              </div>
            );
          })}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      {/* Input Area */}
      <div className="border-t p-4 pb-2">
        {isRecording ? (
          <AudioRecorderWithVisualizer
            onRecordingComplete={(transcript) => {
              setInputValue(transcript);
            }}
          />
        ) : (
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputTextarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything about development, coding, or technology..."
              disabled={isTyping}
            />
            <PromptInputToolbar>
              <PromptInputTools>
                <PromptInputButton
                  disabled={isTyping}
                  onClick={() => startRecording()}
                >
                  <MicIcon size={16} />
                </PromptInputButton>
              </PromptInputTools>
              <PromptInputSubmit
                disabled={!inputValue.trim() || isTyping}
                status={isTyping ? 'streaming' : 'ready'}
              />
            </PromptInputToolbar>
          </PromptInput>
        )}
      </div>
      <div className="text-center pb-2 text-xs text-muted-foreground">
        Nội dung AI cung cấp chỉ mang tính chất tham khảo. Có thể cung cấp một
        số câu trả lời sai lệch.
      </div>
    </div>
  );
};

export default ChatInterface;
