import { Bookmark } from 'lucide-react';
import { useCallback } from 'react';
import { toast } from 'sonner';

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
import { cn } from '@/lib/utils';

interface BookmarkButtonProps {
  bookId: string;
  isBookmarked: boolean;
  currentLocation: string | number;
  bookmarkTitle?: string;
  className?: string;
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  bookId,
  isBookmarked,
  currentLocation,
  bookmarkTitle,
  className,
}) => {
  const { isAuthenticated } = useAuth();
  const { mutate: createBookmark, isPending: isCreating } =
    useCreateBookmarkMutation();
  const { mutate: deleteBookmark, isPending: isDeleting } =
    useDeleteBookmarkMutation();

  const handleBookmarkClick = useCallback(() => {
    if (!isAuthenticated) {
      toast.info('Please sign in to bookmark');
      return;
    }

    if (isBookmarked && bookmarkTitle) {
      deleteBookmark(
        { bookmarkId: bookmarkTitle }, // Using title as ID since we need the bookmark ID
        {
          onSuccess: () => {
            toast.success('Bookmark removed');
          },
          onError: () => {
            toast.error('Failed to remove bookmark');
          },
        },
      );
    } else {
      createBookmark(
        {
          bookId,
          location: String(currentLocation),
          title: `Page ${currentLocation}`,
        },
        {
          onSuccess: () => {
            toast.success('Bookmark added');
          },
          onError: () => {
            toast.error('Failed to add bookmark');
          },
        },
      );
    }
  }, [
    isAuthenticated,
    isBookmarked,
    bookmarkTitle,
    deleteBookmark,
    createBookmark,
    bookId,
    currentLocation,
  ]);

  const isPending = isCreating || isDeleting;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleBookmarkClick}
            disabled={isPending || !isAuthenticated}
            variant="ghost"
            size="icon"
            className={cn(
              'h-10 w-10 transition-all duration-200',
              isBookmarked && 'text-yellow-500',
              className,
            )}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <Bookmark
              className="h-5 w-5"
              fill={isBookmarked ? 'currentColor' : 'none'}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
