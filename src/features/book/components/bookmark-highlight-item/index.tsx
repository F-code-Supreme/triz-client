import { Trash2, ChevronRight } from 'lucide-react';
import { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface BookmarkHighlightItemProps {
  id: string;
  title: string;
  location?: string;
  type: 'bookmark' | 'highlight';
  onDelete: (id: string) => void;
  onClick: (id: string, location?: string) => void;
  isLoading?: boolean;
}

export const BookmarkHighlightItem: React.FC<BookmarkHighlightItemProps> = ({
  id,
  title,
  location,
  type,
  onDelete,
  onClick,
  isLoading = false,
}) => {
  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete(id);
    },
    [id, onDelete],
  );

  const handleClick = useCallback(() => {
    onClick(id, location);
  }, [id, location, onClick]);

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        'group flex w-full items-center gap-3 rounded-md px-4 py-3 text-left transition-colors hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed',
      )}
      type="button"
      aria-label={`${type}: ${title}`}
    >
      {/* Icon indicator */}
      <div
        className={cn(
          'flex-shrink-0 h-2 w-2 rounded-full',
          type === 'bookmark' ? 'bg-yellow-500' : 'bg-blue-500',
        )}
      />

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{title}</p>
        {location && (
          <p className="truncate text-xs text-muted-foreground">{location}</p>
        )}
      </div>

      {/* Action buttons */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
            aria-label="Actions"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </button>
  );
};
