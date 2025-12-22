import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatDate } from '@/utils';

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
  const { t } = useTranslation('pages.admin');
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('flashcards.deck_preview.title')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              {t('flashcards.deck_preview.id')}
            </h3>
            <p className="text-sm">{deck.id}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              {t('flashcards.deck_preview.deck_title')}
            </h3>
            <p className="text-sm font-semibold">{deck.title}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              {t('flashcards.deck_preview.description')}
            </h3>
            <p className="text-sm">{deck.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              {t('flashcards.deck_preview.number_of_flashcards')}
            </h3>
            <Badge variant="secondary">
              {deck.numberOfFlashcards} {t('flashcards.deck_preview.cards')}
            </Badge>
          </div>

          {deck.createdAt && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {t('flashcards.deck_preview.created_at')}
              </h3>
              <p className="text-sm">
                {formatDate(new Date(deck.createdAt), 'DD/MM/YYYY HH:mm')}
              </p>
            </div>
          )}

          {deck.updatedAt && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {t('flashcards.deck_preview.updated_at')}
              </h3>
              <p className="text-sm">
                {formatDate(new Date(deck.updatedAt), 'DD/MM/YYYY HH:mm')}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
