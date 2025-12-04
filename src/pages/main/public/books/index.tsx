import { Link } from '@tanstack/react-router';
import { BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import useAuth from '@/features/auth/hooks/use-auth';
import BookItem from '@/features/book/components/book-list/book-item';
import BookSkeleton from '@/features/book/components/book-list/book-skeleton';
import { useGetAllBooksQuery } from '@/features/book/services/queries';
import { DefaultLayout } from '@/layouts/default-layout';

const BookLibraryPage = () => {
  const { t } = useTranslation('pages.books');
  const { data, isLoading, error } = useGetAllBooksQuery();
  const { isAuthenticated } = useAuth();

  const books = data?.content || [];

  return (
    <DefaultLayout meta={{ title: t('page_meta_title') }}>
      <div className="space-y-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2 flex-1">
            <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
              <BookOpen className="h-8 w-8" />
              {t('title')}
            </h1>
            <p className="text-muted-foreground">{t('description')}</p>
          </div>
          {isAuthenticated && (
            <Button asChild className="h-10">
              <Link to="/books/me">{t('my_books')}</Link>
            </Button>
          )}
        </div>

        {/* Books Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <BookSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-6 text-center">
            <h3 className="text-lg font-semibold text-destructive mb-2">
              {t('error.title')}
            </h3>
            <p className="text-destructive/80 mb-4">{t('error.description')}</p>
            <Button
              onClick={() => window.location.reload()}
              variant="destructive"
            >
              {t('error.retry')}
            </Button>
          </div>
        ) : books.length === 0 ? (
          <div className="rounded-lg border border-dashed bg-muted/50 p-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {t('empty.title')}
            </h3>
            <p className="text-muted-foreground">{t('empty.description')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookItem key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default BookLibraryPage;
