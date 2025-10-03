import { useVirtualizer } from '@tanstack/react-virtual';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import {
  MessageSquare,
  Search,
  PanelLeftClose,
  PanelLeft,
  MoreVertical,
  Edit,
  Archive,
  Plus,
} from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { STRING_EMPTY } from '@/constants';
import {
  useArchiveConversationMutation,
  useRenameConversationMutation,
} from '@/features/conversation/services/mutations';
import { useGetConversationsQuery } from '@/features/conversation/services/queries';
import { useDebounce } from '@/hooks';
import { cn } from '@/lib/utils';

import type { Conversation } from '../types';

type GroupedConversation =
  | {
      type: 'date';
      date: string;
      dateLabel: string;
    }
  | {
      type: 'conversation';
      conversation: Conversation;
    };

const ConversationItem = ({
  conversation,
  isSelected,
  onClick,
  onRename,
  onArchive,
}: {
  conversation: Conversation;
  isSelected: boolean;
  onClick: (conversation: Conversation) => void;
  onRename: (conversationId: string, newTitle: string) => void;
  onArchive: (conversation: Conversation) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(
    conversation.title || STRING_EMPTY,
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditTitle(conversation.title || STRING_EMPTY);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const handleSaveEdit = () => {
    const trimmedTitle = editTitle.trim();
    if (trimmedTitle && trimmedTitle !== conversation.title) {
      onRename(conversation.id, trimmedTitle);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(conversation.title || STRING_EMPTY);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div
      className={cn(
        'group relative w-full h-auto px-4 py-2 rounded-md transition-colors bg-transparent',
        'hover:bg-primary/20',
        isSelected && 'bg-primary hover:bg-primary/80',
      )}
    >
      <Button
        variant="ghost"
        className="flex items-start gap-3 w-full min-w-0 h-auto p-0 hover:bg-transparent focus-visible:ring-0"
        onClick={() => !isEditing && onClick(conversation)}
      >
        <div className="flex-1 min-w-0 space-y-1 text-left">
          {isEditing ? (
            <Input
              ref={inputRef}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={handleKeyDown}
              className={cn(
                'h-7 text-sm font-medium border-none focus-visible:ring-0 focus-visible:ring-offset-0',
                isSelected && 'bg-primary/20 text-primary-foreground',
              )}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <p
              className={cn(
                'text-sm font-medium truncate',
                isSelected && 'text-primary-foreground',
              )}
            >
              {conversation.title || 'New Conversation'}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            {conversation.updatedAt &&
              format(parseISO(conversation.updatedAt), 'HH:mm')}
          </p>
        </div>
        {!isEditing && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/30',
                  isSelected && 'opacity-100 bg-transparent',
                )}
              >
                <MoreVertical
                  className={cn(
                    'h-4 w-4',
                    isSelected && 'text-primary-foreground',
                  )}
                />
                <span className="sr-only">More actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenuItem onClick={handleStartEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onArchive(conversation);
                }}
              >
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </Button>
    </div>
  );
};

const DateHeader = ({ dateLabel }: { dateLabel: string }) => {
  return (
    <div className="px-4 py-2 text-xs font-medium text-muted-foreground bg-background/80 sticky top-0 z-10 border-b">
      {dateLabel}
    </div>
  );
};

const ConversationSkeleton = () => {
  return (
    <div className="p-3 space-y-2">
      <div className="flex items-start gap-3">
        <Skeleton className="h-4 w-4 rounded-sm mt-1" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
};

interface ConversationListProps {
  selectedConversationId?: string;
  onConversationSelect: (conversation: Conversation) => void;
  onNewChat: () => void;
  className?: string;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const ConversationList = ({
  selectedConversationId,
  onConversationSelect,
  onNewChat,
  className,
  isCollapsed,
  toggleCollapse,
}: ConversationListProps) => {
  const { t } = useTranslation('action');
  const [searchQuery, setSearchQuery] = useState(STRING_EMPTY);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const parentRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetConversationsQuery(debouncedSearchQuery);

  // Mutations
  const { mutate: renameMutation } = useRenameConversationMutation();
  const { mutate: archiveMutation } = useArchiveConversationMutation();

  // Handlers for actions
  const handleRename = (conversationId: string, newTitle: string) => {
    renameMutation(
      {
        conversationId,
        title: newTitle,
      },
      {
        onSuccess: () => {
          toast.success('Conversation renamed successfully');
        },
        onError: (error) => {
          toast.error(
            (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || 'Failed to rename conversation',
          );
        },
      },
    );
  };

  const handleArchive = (conversation: Conversation) => {
    archiveMutation(
      {
        conversationId: conversation.id,
        archived: true,
      },
      {
        onSuccess: () => {
          toast.success('Conversation archived successfully');
        },
        onError: (error) => {
          toast.error(
            (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || 'Failed to archive conversation',
          );
        },
      },
    );
  };

  // Group conversations by date
  const groupedData = useMemo<GroupedConversation[]>(() => {
    if (!data?.pages) return [];

    const conversations = data.pages.flatMap((page) => page.content || []);
    const filtered = conversations.filter((conv) =>
      conv.title?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()),
    );

    const groups: GroupedConversation[] = [];
    let currentDate = STRING_EMPTY;

    filtered.forEach((conversation) => {
      const conversationDate = format(
        parseISO(conversation.updatedAt!),
        'yyyy-MM-dd',
      );

      if (conversationDate !== currentDate) {
        currentDate = conversationDate;

        let dateLabel: string;
        const date = parseISO(conversation.updatedAt!);

        if (isToday(date)) {
          dateLabel = 'Today';
        } else if (isYesterday(date)) {
          dateLabel = 'Yesterday';
        } else {
          dateLabel = format(date, 'MMM dd, yyyy');
        }

        groups.push({
          type: 'date',
          date: conversationDate,
          dateLabel,
        });
      }

      groups.push({
        type: 'conversation',
        conversation,
      });
    });

    return groups;
  }, [data, debouncedSearchQuery]);

  const virtualizer = useVirtualizer({
    count: groupedData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(
      (index: number) => {
        const item = groupedData[index];
        return item?.type === 'date' ? 40 : 60;
      },
      [groupedData],
    ),
    overscan: 5,
  });

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Load more when scrolled to bottom
  const virtualItems = virtualizer.getVirtualItems();
  const lastItem = virtualItems[virtualItems.length - 1];

  if (
    lastItem &&
    lastItem.index >= groupedData.length - 3 &&
    hasNextPage &&
    !isFetchingNextPage
  ) {
    handleLoadMore();
  }

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-background border border-r-0 rounded-xl rounded-r-none',
        className,
      )}
    >
      <div className="flex items-center justify-between p-4 border-b bg-muted/50 h-14">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={toggleCollapse}
        >
          {isCollapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>
        {!isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onNewChat}
            title="New Chat"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>
      {/* Search Header */}
      <div className="px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="relative">
          <Search className="absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-6 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>

      {/* Conversation List */}
      <ScrollArea className="flex-1" ref={parentRef}>
        {isLoading ? (
          <div className="space-y-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <ConversationSkeleton key={i} />
            ))}
          </div>
        ) : groupedData.length === 0 ? (
          isError ? (
            <div className="p-4 flex flex-col gap-4 text-center text-red-500">
              <p>Failed to load conversations</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No conversations found</p>
              {debouncedSearchQuery && (
                <p className="text-sm mt-2">Try adjusting your search terms</p>
              )}
            </div>
          )
        ) : (
          <div
            style={{
              height: virtualizer.getTotalSize(),
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualItems.map((virtualItem) => {
              const item = groupedData[virtualItem.index];

              return (
                <div
                  key={virtualItem.key}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  {item?.type === 'date' ? (
                    <DateHeader dateLabel={item.dateLabel} />
                  ) : item?.type === 'conversation' ? (
                    <ConversationItem
                      conversation={item.conversation}
                      isSelected={
                        selectedConversationId === item.conversation.id
                      }
                      onClick={onConversationSelect}
                      onRename={handleRename}
                      onArchive={handleArchive}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        )}

        {/* Loading more indicator */}
        {isFetchingNextPage && (
          <div className="p-4 text-center">
            <div className="space-y-1">
              <ConversationSkeleton />
              <ConversationSkeleton />
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ConversationList;
