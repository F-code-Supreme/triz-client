import { MoreHorizontal, Eye, Pencil, Trash2, Spade } from 'lucide-react';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { FlashcardDeckPreviewSheet } from './flashcard-deck-preview-sheet';
import { FlashcardDecksFormDialog } from './flashcard-decks-form-dialog';
import { FlashcardManageCardsDialog } from './flashcard-manage-cards';
import { useDeleteFlashcardDeckMutation } from '../services/mutations';

import type { FlashcardDeck } from '../types';

interface FlashcardDecksDataTableRowActionsProps {
  row: {
    original: FlashcardDeck;
  };
  isDeleted?: boolean;
}

export const FlashcardDecksDataTableRowActions = ({
  row,
  isDeleted = false,
}: FlashcardDecksDataTableRowActionsProps) => {
  const deck = row.original;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isManageCardsOpen, setIsManageCardsOpen] = useState(false);

  const deleteDeckMutation = useDeleteFlashcardDeckMutation();

  const handleDelete = async () => {
    await deleteDeckMutation.mutateAsync({
      deckId: deck.id,
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
            <>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsManageCardsOpen(true)}>
            <Spade className="mr-2 h-4 w-4" />
            Manage Cards
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <FlashcardDeckPreviewSheet
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        deck={deck}
      />

      <FlashcardDecksFormDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        initialData={deck}
      />

      <AlertDialog open={isActionOpen} onOpenChange={setIsActionOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isDeleted ? 'Restore Deck' : 'Delete Deck'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isDeleted
                ? `Are you sure you want to restore "${deck.title}"? This will make the deck visible again.`
                : `Are you sure you want to delete "${deck.title}"? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteDeckMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className={
                isDeleted
                  ? ''
                  : 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
              }
              onClick={handleDelete}
              disabled={deleteDeckMutation.isPending}
            >
              {deleteDeckMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <FlashcardManageCardsDialog
        open={isManageCardsOpen}
        onOpenChange={setIsManageCardsOpen}
        deckId={deck.id}
      />
    </>
  );
};
