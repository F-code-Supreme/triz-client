import { RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

import type { AdminBook } from '@/features/book/types';

interface DeletedBooksSectionProps {
  books: AdminBook[];
  isLoading: boolean;
  onRestore: (book: AdminBook) => Promise<void>;
}

export const DeletedBooksSection = ({
  books,
  isLoading,
  onRestore,
}: DeletedBooksSectionProps) => {
  const { t } = useTranslation('pages.admin');
  const [selectedBook, setSelectedBook] = useState<AdminBook | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRestore = (book: AdminBook) => {
    setSelectedBook(book);
    setIsDialogOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedBook) return;

    await onRestore(selectedBook);

    setIsDialogOpen(false);
    setSelectedBook(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg border-dashed">
        <p className="text-lg font-medium text-muted-foreground">
          {t('archive.books.no_deleted')}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {t('archive.books.all_active')}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {books.map((book) => (
          <div
            key={book.id}
            className="border rounded-lg p-4 hover:bg-muted/50 transition-colors relative"
          >
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleRestore(book)}
              className="absolute top-4 right-4 h-8 w-8"
              title={t('common.restore')}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <div>
              <h3 className="font-semibold text-lg">{book.title}</h3>
              {book.author && (
                <p className="text-sm text-muted-foreground">
                  by {book.author}
                </p>
              )}
            </div>
            {book.deletedAt && (
              <p className="text-xs text-muted-foreground">
                {t('archive.books.deleted_at')}:{' '}
                {new Date(book.deletedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('archive.books.restore_title')}</DialogTitle>
            <DialogDescription>
              {t('archive.books.restore_message')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleConfirm}>{t('common.restore')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
