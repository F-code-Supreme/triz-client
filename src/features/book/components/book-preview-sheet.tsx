import { BookOpen, Download, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

import { bookStatuses } from '../data/data';

import type { AdminBook } from '../types';

interface BookPreviewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book?: AdminBook;
}

export const BookPreviewSheet = ({
  open,
  onOpenChange,
  book,
}: BookPreviewSheetProps) => {
  const { t } = useTranslation('pages.admin');
  const [imageError, setImageError] = useState(false);

  if (!book) return null;

  const status = bookStatuses.find((s) => s.value === book.status);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t('books.preview.title')}</SheetTitle>
          <SheetDescription>{t('books.preview.description')}</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Book Cover */}
          <div className="flex justify-center">
            <div className="w-48 h-64 bg-gradient-to-br from-sky-200 to-blue-400 rounded-lg overflow-hidden shadow-lg flex items-center justify-center">
              {book.bCoverUrl && !imageError ? (
                <img
                  src={book.bCoverUrl}
                  alt={book.title || 'Book cover'}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <BookOpen className="h-24 w-24 text-white/50" />
              )}
            </div>
          </div>

          {/* Book Details */}
          <div className="space-y-4">
            {/* Title */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                {t('books.preview.title_label')}
              </h3>
              <p className="text-lg font-semibold text-foreground">
                {book.title || t('books.preview.na')}
              </p>
            </div>

            {/* Author */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                {t('books.preview.author_label')}
              </h3>
              <p className="text-base text-foreground">
                {book.author || t('books.preview.na')}
              </p>
            </div>

            {/* Publisher */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                {t('books.preview.publisher_label')}
              </h3>
              <p className="text-base text-foreground">
                {book.publisher || t('books.preview.na')}
              </p>
            </div>

            {/* Status */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                {t('books.preview.status_label')}
              </h3>
              <Badge
                variant={
                  status?.value === 'PUBLISHED' ? 'default' : 'secondary'
                }
              >
                {status?.label || t('books.preview.unknown')}
              </Badge>
            </div>

            {/* Display Order */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                {t('books.preview.display_order_label')}
              </h3>
              <p className="text-base text-foreground">{book.displayOrder}</p>
            </div>

            {/* Book ID */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                {t('books.preview.book_id_label')}
              </h3>
              <p className="text-sm text-foreground font-mono">{book.id}</p>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-4">
              {book.bUrl && (
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() => {
                    const url = book.bUrl.startsWith('http')
                      ? book.bUrl
                      : `${window.location.origin}${book.bUrl}`;
                    window.open(url, '_blank');
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {t('books.preview.open_book')}
                </Button>
              )}
              {book.bUrl && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = book.bUrl.startsWith('http')
                      ? book.bUrl
                      : `${window.location.origin}${book.bUrl}`;
                    link.download = book.title || 'book';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {t('books.preview.download')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
