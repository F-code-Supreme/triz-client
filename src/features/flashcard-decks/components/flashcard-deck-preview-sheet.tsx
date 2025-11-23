import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import type { FlashcardDeck } from '../types';

interface FlashcardDeckPreviewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deck: FlashcardDeck;
}

export const FlashcardDeckPreviewSheet = ({
  open,
  onOpenChange,
  deck,
}: FlashcardDeckPreviewSheetProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Deck Preview</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              ID
            </h3>
            <p className="text-sm">{deck.id}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Title
            </h3>
            <p className="text-sm font-semibold">{deck.title}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Description
            </h3>
            <p className="text-sm">{deck.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Number of Flashcards
            </h3>
            <Badge variant="secondary">{deck.numberOfFlashcards} cards</Badge>
          </div>

          {deck.createdAt && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Created At
              </h3>
              <p className="text-sm">
                {new Date(deck.createdAt).toLocaleString()}
              </p>
            </div>
          )}

          {deck.updatedAt && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Updated At
              </h3>
              <p className="text-sm">
                {new Date(deck.updatedAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
