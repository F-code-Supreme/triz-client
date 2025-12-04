import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRestoreBookMutation } from '@/features/book/services/mutations';
import { useGetAllDeletedBooksAdminQuery } from '@/features/book/services/queries';
import { useRestorePackageMutation } from '@/features/packages/services/mutations';
import { useGetDeletedPackagesQuery } from '@/features/packages/services/queries';
import { AdminLayout } from '@/layouts/admin-layout';

import { DeletedBooksSection } from './sections/deleted-books-section';
import { DeletedPackagesSection } from './sections/deleted-packages-section';

import type { AdminBook } from '@/features/book/types';
import type { Package } from '@/features/packages/types';

const AdminArchivePage = () => {
  const { t } = useTranslation('pages.admin');
  const [activeTab, setActiveTab] = useState('books');

  // Books queries and mutations
  const { data: deletedBooksData, isLoading: isLoadingBooks } =
    useGetAllDeletedBooksAdminQuery();
  const restoreBook = useRestoreBookMutation();

  // Packages queries and mutations
  const { data: deletedPackagesData, isLoading: isLoadingPackages } =
    useGetDeletedPackagesQuery();
  const restorePackage = useRestorePackageMutation();

  const deletedBooks = useMemo(() => {
    return deletedBooksData?.content || [];
  }, [deletedBooksData]);

  const deletedPackages = useMemo(() => {
    return deletedPackagesData?.content || [];
  }, [deletedPackagesData]);

  const handleRestoreBook = async (book: AdminBook) => {
    try {
      await restoreBook.mutateAsync({
        bookId: book.id,
      });
      toast.success(t('archive.books.restore_success', { title: book.title }));
    } catch (error) {
      console.error('Restore error:', error);
      toast.error(t('archive.books.restore_error'));
    }
  };

  const handleRestorePackage = async (pkg: Package) => {
    try {
      await restorePackage.mutateAsync(pkg.id);
      toast.success(t('archive.packages.restore_success', { name: pkg.name }));
    } catch (error) {
      console.error('Restore error:', error);
      toast.error(t('archive.packages.restore_error'));
    }
  };

  return (
    <AdminLayout meta={{ title: 'Archive' }}>
      <div className="flex flex-col gap-8 p-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('archive.title')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('archive.description')}
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger className="gap-2" value="books">
              {t('archive.tabs.books')}
              {deletedBooks.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {deletedBooks.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger className="gap-2" value="packages">
              {t('archive.tabs.packages')}
              {deletedPackages.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {deletedPackages.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Books Tab */}
          <TabsContent value="books" className="space-y-4">
            <DeletedBooksSection
              books={deletedBooks}
              isLoading={isLoadingBooks}
              onRestore={handleRestoreBook}
            />
          </TabsContent>

          {/* Packages Tab */}
          <TabsContent value="packages" className="space-y-4">
            <DeletedPackagesSection
              packages={deletedPackages}
              isLoading={isLoadingPackages}
              onRestore={handleRestorePackage}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminArchivePage;
