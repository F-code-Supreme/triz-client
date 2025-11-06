import { MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';
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
import { useDeleteBookMutation } from '../services/mutations';

import type { AdminBook } from '../types';

interface BooksDataTableRowActionsProps {
  row: {
    original: AdminBook;
  };
}

export const BooksDataTableRowActions = ({
  row,
}: BooksDataTableRowActionsProps) => {
  const book = row.original;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const deleteBookMutation = useDeleteBookMutation();

  const handleDelete = async () => {
    await deleteBookMutation.mutateAsync({
      bookId: book.id,
    });
    setIsDeleteOpen(false);
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
          <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
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

      <Sheet open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Delete Book</SheetTitle>
            <SheetDescription>
              Are you sure you want to delete &quot;{book.title}&quot;? This
              action cannot be undone.
            </SheetDescription>
          </SheetHeader>
          <div className="flex gap-3 justify-end pt-6">
            <SheetClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </SheetClose>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteBookMutation.isPending}
            >
              {deleteBookMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
