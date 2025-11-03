import { Highlighter, Bookmark as BookmarkIcon, Notebook } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import useAuth from '@/features/auth/hooks/use-auth';
import { useDeleteHighlightMutation } from '@/features/book-highlight/services/mutations';
import { useDeleteBookmarkMutation } from '@/features/bookmark/services/mutations';
import { cn } from '@/lib/utils';

import { BookmarkHighlightItem } from '../bookmark-highlight-item';

import type { BookHighlight } from '@/features/book-highlight/types';
import type { Bookmark } from '@/features/bookmark/types';

type TabType = 'bookmarks' | 'highlights';

interface BookmarksHighlightsPopoverProps {
  bookId: string;
  bookmarks: Bookmark[];
  highlights: BookHighlight[];
  onItemClick: (location: string, type: 'bookmark' | 'highlight') => void;
  className?: string;
}

export const BookmarksHighlightsPopover: React.FC<
  BookmarksHighlightsPopoverProps
> = ({ bookId, bookmarks, highlights, onItemClick, className }) => {
  const [activeTab, setActiveTab] = useState<TabType>('bookmarks');
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { mutate: deleteBookmark, isPending: isDeletingBookmark } =
    useDeleteBookmarkMutation();
  const { mutate: deleteHighlight, isPending: isDeletingHighlight } =
    useDeleteHighlightMutation();

  const handleDeleteBookmark = useCallback(
    (bookmarkId: string) => {
      deleteBookmark(
        { bookmarkId, bookId },
        {
          onSuccess: () => {
            toast.success('Bookmark deleted');
          },
          onError: () => {
            toast.error('Failed to delete bookmark');
          },
        },
      );
    },
    [deleteBookmark],
  );

  const handleDeleteHighlight = useCallback(
    (highlightId: string) => {
      deleteHighlight(
        { highlightId },
        {
          onSuccess: () => {
            toast.success('Highlight deleted');
          },
          onError: () => {
            toast.error('Failed to delete highlight');
          },
        },
      );
    },
    [deleteHighlight],
  );

  const handleBookmarkItemClick = useCallback(
    (_bookmarkId: string, location?: string) => {
      if (location) {
        onItemClick(location, 'bookmark');
        setOpen(false);
      }
    },
    [onItemClick],
  );

  const handleHighlightItemClick = useCallback(
    (_highlightId: string, range?: string) => {
      if (range) {
        onItemClick(range, 'highlight');
        setOpen(false);
      }
    },
    [onItemClick],
  );

  if (!isAuthenticated) {
    return null;
  }

  const bookmarkCount = bookmarks.length;
  const highlightCount = highlights.length;
  const totalCount = bookmarkCount + highlightCount;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'relative h-10 w-10 transition-all duration-200',
            className,
          )}
          aria-label={`Bookmarks and highlights (${totalCount})`}
        >
          <div className="relative">
            <Notebook className="h-5 w-5" />
            {totalCount > 0 && (
              <Badge
                className="absolute -right-4 -top-4 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
                variant="destructive"
              >
                {totalCount > 9 ? '9+' : totalCount}
              </Badge>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
        {/* Header */}
        <div className="border-b p-4">
          <h3 className="font-semibold text-foreground">
            Bookmarks & Highlights
          </h3>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b px-4 pt-2">
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={cn(
              'flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium transition-colors',
              activeTab === 'bookmarks'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
            type="button"
          >
            <BookmarkIcon className="h-4 w-4" />
            Bookmarks
            {bookmarkCount > 0 && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                {bookmarkCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('highlights')}
            className={cn(
              'flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium transition-colors',
              activeTab === 'highlights'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
            type="button"
          >
            <Highlighter className="h-4 w-4" />
            Highlights
            {highlightCount > 0 && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                {highlightCount}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        <ScrollArea className="h-96">
          {activeTab === 'bookmarks' ? (
            <div className="divide-y">
              {bookmarks.length > 0 ? (
                bookmarks.map((bookmark) => (
                  <BookmarkHighlightItem
                    key={bookmark.id}
                    id={bookmark.id}
                    title={bookmark.title}
                    location={bookmark.location}
                    type="bookmark"
                    onDelete={handleDeleteBookmark}
                    onClick={handleBookmarkItemClick}
                    isLoading={isDeletingBookmark}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                  <BookmarkIcon className="h-8 w-8 text-muted-foreground opacity-50" />
                  <p className="text-sm text-muted-foreground">
                    No bookmarks yet
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="divide-y">
              {highlights.length > 0 ? (
                highlights.map((highlight) => (
                  <BookmarkHighlightItem
                    key={highlight.id}
                    id={highlight.id}
                    title={`Highlight ${highlights.indexOf(highlight) + 1}`}
                    location={highlight.range}
                    type="highlight"
                    onDelete={handleDeleteHighlight}
                    onClick={handleHighlightItemClick}
                    isLoading={isDeletingHighlight}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                  <Highlighter className="h-8 w-8 text-muted-foreground opacity-50" />
                  <p className="text-sm text-muted-foreground">
                    No highlights yet
                  </p>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
