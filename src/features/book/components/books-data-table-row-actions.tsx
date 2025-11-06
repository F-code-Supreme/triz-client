import { MoreHorizontal, Eye, Pencil, Trash2, RotateCcw } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

import { BookPreviewSheet } from './book-preview-sheet';
import { BooksFormDialog } from './books-form-dialog';
import {
  useDeleteBookMutation,
  useRestoreBookMutation,
} from '../services/mutations';

import type { AdminBook } from '../types';

interface BooksDataTableRowActionsProps {
  row: {
    original: AdminBook;
  };
  isDeleted?: boolean;
}

export const BooksDataTableRowActions = ({
  row,
  isDeleted = false,
}: BooksDataTableRowActionsProps) => {
  const book = row.original;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const deleteBookMutation = useDeleteBookMutation();
  const restoreBookMutation = useRestoreBookMutation();

  const handleDelete = async () => {
    await deleteBookMutation.mutateAsync({
      bookId: book.id,
    });
    setIsActionOpen(false);
  };

  const handleRestore = async () => {
    await restoreBookMutation.mutateAsync({
      bookId: book.id,
    });
    setIsActionOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsPreviewOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </DropdownMenuItem>
          {!isDeleted && (
            <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className={isDeleted ? 'text-blue-600' : 'text-destructive'}
            onClick={() => setIsActionOpen(true)}
          >
            {isDeleted ? (
              <>
                <RotateCcw className="mr-2 h-4 w-4" />
                Restore
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <BookPreviewSheet
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        book={book}
      />

      <BooksFormDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        initialData={book}
      />

      <Sheet open={isActionOpen} onOpenChange={setIsActionOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {isDeleted ? 'Restore Book' : 'Delete Book'}
            </SheetTitle>
            <SheetDescription>
              {isDeleted
                ? `Are you sure you want to restore "${book.title}"? This will make the book visible again.`
                : `Are you sure you want to delete "${book.title}"? This action cannot be undone.`}
            </SheetDescription>
          </SheetHeader>
          <div className="flex gap-3 justify-end pt-6">
            <SheetClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </SheetClose>
            <Button
              variant={isDeleted ? 'default' : 'destructive'}
              onClick={isDeleted ? handleRestore : handleDelete}
              disabled={
                isDeleted
                  ? restoreBookMutation.isPending
                  : deleteBookMutation.isPending
              }
            >
              {isDeleted
                ? restoreBookMutation.isPending
                  ? 'Restoring...'
                  : 'Restore'
                : deleteBookMutation.isPending
                  ? 'Deleting...'
                  : 'Delete'}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
