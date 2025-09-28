import { useVirtualizer } from '@tanstack/react-virtual';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { MessageSquare, Search } from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { STRING_EMPTY } from '@/constants';
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
}: {
  conversation: Conversation;
  isSelected: boolean;
  onClick: (conversation: Conversation) => void;
}) => {
  return (
    <Button
      variant={isSelected ? 'secondary' : 'ghost'}
      className={cn(
        'w-full h-auto p-2 justify-start text-left',
        'hover:bg-accent/50 transition-colors',
        isSelected && 'bg-secondary',
      )}
      onClick={() => onClick(conversation)}
    >
      <div className="flex items-start gap-3 w-full min-w-0">
        <div className="flex-1 min-w-0 space-y-1">
          <p className="text-sm font-medium truncate">
            {conversation.title || 'New Conversation'}
          </p>
          <p className="text-xs text-muted-foreground">
            {conversation.updatedAt &&
              format(parseISO(conversation.updatedAt), 'HH:mm')}
          </p>
        </div>
      </div>
    </Button>
  );
};

const DateHeader = ({ dateLabel }: { dateLabel: string }) => {
  return (
    <div className="px-2 py-2 text-xs font-medium text-muted-foreground bg-background/80 sticky top-0 z-10 border-b">
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
  className?: string;
}

const ConversationList = ({
  selectedConversationId,
  onConversationSelect,
  className,
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

  // Group conversations by date
  const groupedData = useMemo<GroupedConversation[]>(() => {
    if (!data?.pages) return [];

    const conversations = data.pages.flatMap((page) => page.data || []);
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
        return item?.type === 'date' ? 40 : 80;
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

  if (isError) {
    return (
      <div className={cn('flex flex-col h-full', className)}>
        <div className="p-4 text-center text-red-500">
          <p>Failed to load conversations</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-background border rounded-xl',
        className,
      )}
    >
      {/* Search Header */}
      <div className="p-2 border-b bg-muted/50 h-14"></div>
      {/* Search Header */}
      <div className="p-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
          <div className="p-8 text-center text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No conversations found</p>
            {debouncedSearchQuery && (
              <p className="text-sm mt-2">Try adjusting your search terms</p>
            )}
          </div>
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
