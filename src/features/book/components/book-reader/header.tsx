import { ChevronLeft } from 'lucide-react';
import { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { BookmarkButton } from '../bookmark-button';
import { BookmarksHighlightsPopover } from '../bookmarks-highlights-popover';

import type { BookHighlight } from '@/features/book-highlight/types';
import type { Bookmark } from '@/features/bookmark/types';

interface BookReaderHeaderProps {
  bookId: string;
  bookTitle: string;
  bookmarks: Bookmark[];
  highlights: BookHighlight[];
  currentLocation: string | number;
  isBookmarked: boolean;
  onNavigateBack: () => void;
  onBookmarkItemClick: (
    location: string,
    type: 'bookmark' | 'highlight',
  ) => void;
  className?: string;
}

export const BookReaderHeader: React.FC<BookReaderHeaderProps> = ({
  bookId,
  bookTitle,
  bookmarks,
  highlights,
  currentLocation,
  isBookmarked,
  onNavigateBack,
  onBookmarkItemClick,
  className,
}) => {
  const currentBookmark = bookmarks.find(
    (b) => b.location === String(currentLocation),
  );

  const handleBookmarkItemClick = useCallback(
    (location: string, type: 'bookmark' | 'highlight') => {
      onBookmarkItemClick(location, type);
    },
    [onBookmarkItemClick],
  );

  return (
    <div
      className={cn(
        'sticky top-0 z-40 flex items-center justify-between border-b bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className,
      )}
    >
      {/* Left section - Back button and title */}
      <div className="flex items-center gap-3 min-w-0">
        <Button
          onClick={onNavigateBack}
          variant="ghost"
          size="icon"
          className="h-9 w-9 flex-shrink-0"
          aria-label="Go back"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="truncate text-lg font-semibold text-foreground">
          {bookTitle}
        </h1>
      </div>

      {/* Right section - Bookmarks/Highlights and Bookmark button */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <BookmarksHighlightsPopover
          bookId={bookId}
          bookmarks={bookmarks}
          highlights={highlights}
          onItemClick={handleBookmarkItemClick}
        />
        <BookmarkButton
          bookId={bookId}
          isBookmarked={isBookmarked}
          currentLocation={currentLocation}
          bookmarkTitle={currentBookmark?.title}
        />
      </div>
    </div>
  );
};
