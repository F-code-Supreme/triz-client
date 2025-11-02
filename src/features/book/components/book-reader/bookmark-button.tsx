import { Bookmark } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import useAuth from '@/features/auth/hooks/use-auth';
import {
  useCreateBookmarkMutation,
  useDeleteBookmarkMutation,
} from '@/features/bookmark/services/mutations';
import { useGetBookmarksByBookQuery } from '@/features/bookmark/services/queries';

interface BookmarkButtonProps {
  bookId: string;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ bookId }) => {
  const { user } = useAuth();
  const [isCurrentPageBookmarked, setIsCurrentPageBookmarked] = useState(false);
  const [location, setLocation] = useState<string>('');

  // Get all bookmarks for this book
  const { data: bookmarks = [] } = useGetBookmarksByBookQuery(bookId);

  // Mutations
  const { mutate: createBookmark, isPending: isCreating } =
    useCreateBookmarkMutation();
  const { mutate: deleteBookmark, isPending: isDeleting } =
    useDeleteBookmarkMutation();

  // Check if current page is bookmarked
  useEffect(() => {
    if (location && bookmarks.length > 0) {
      const isBookmarked = bookmarks.some((b) => b.location === location);
      setIsCurrentPageBookmarked(isBookmarked);
    }
  }, [location, bookmarks]);

  // Get current location from sessionStorage
  useEffect(() => {
    const updateLocation = () => {
      const storedLocation = sessionStorage.getItem(`book-location-${bookId}`);
      if (storedLocation) {
        setLocation(storedLocation);
      }
    };

    updateLocation();
    window.addEventListener('storage', updateLocation);
    // Custom event for when location changes within the same tab
    window.addEventListener('bookLocationChanged', updateLocation);

    return () => {
      window.removeEventListener('storage', updateLocation);
      window.removeEventListener('bookLocationChanged', updateLocation);
    };
  }, [bookId]);

  const handleToggleBookmark = async () => {
    if (!location || !user?.id) return;

    if (isCurrentPageBookmarked) {
      // Delete bookmark
      const bookmarkToDelete = bookmarks.find((b) => b.location === location);
      if (bookmarkToDelete) {
        deleteBookmark({ bookmarkId: bookmarkToDelete.id });
      }
    } else {
      // Create bookmark
      createBookmark({
        bookId,
        location,
        title: `Bookmark at ${location}`,
      });
    }
  };

  const isLoading = isCreating || isDeleting;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleBookmark}
            disabled={isLoading}
            className={isCurrentPageBookmarked ? 'text-primary' : ''}
          >
            <Bookmark
              className={`h-5 w-5 ${
                isCurrentPageBookmarked ? 'fill-current' : ''
              }`}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isCurrentPageBookmarked
            ? 'Remove bookmark from this page'
            : 'Bookmark this page'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BookmarkButton;
