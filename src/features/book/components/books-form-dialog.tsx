import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadList,
  FileUploadItem,
  FileUploadItemPreview,
  FileUploadItemMetadata,
  FileUploadItemProgress,
  FileUploadItemDelete,
  FileUploadTrigger,
} from '@/components/ui/file-upload';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

import {
  useCreateBookMutation,
  useUpdateBookMutation,
  useUploadFileMutation,
} from '../services/mutations';
import { BookStatus } from '../types';

import type { AdminBook } from '../types';

const bookFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().optional().default(''),
  publisher: z.string().optional().default(''),
  bCoverUrl: z.string().optional().default(''),
  bUrl: z.string().min(1, 'Book file is required'),
  status: z.enum([BookStatus.PUBLISHED, BookStatus.UNPUBLISHED]),
  displayOrder: z.coerce.number().int().default(0),
});

type BookFormValues = z.infer<typeof bookFormSchema>;

interface BooksFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: AdminBook;
}

export const BooksFormDialog = ({
  open,
  onOpenChange,
  initialData,
}: BooksFormDialogProps) => {
  const { t } = useTranslation('pages.admin');
  const createMutation = useCreateBookMutation();
  const updateMutation = useUpdateBookMutation();
  const uploadMutation = useUploadFileMutation();
  const isLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    uploadMutation.isPending;

  const [coverFiles, setCoverFiles] = useState<File[]>([]);
  const [bookFiles, setBookFiles] = useState<File[]>([]);

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: '',
      author: '',
      publisher: '',
      bCoverUrl: '',
      bUrl: '',
      status: BookStatus.PUBLISHED,
      displayOrder: 0,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title || '',
        author: initialData.author || '',
        publisher: initialData.publisher || '',
        bCoverUrl: initialData.bCoverUrl || '',
        bUrl: initialData.bUrl,
        status: initialData.status,
        displayOrder: initialData.displayOrder || 0,
      });
    } else {
      form.reset({
        title: '',
        author: '',
        publisher: '',
        bCoverUrl: '',
        bUrl: '',
        status: BookStatus.PUBLISHED,
        displayOrder: 0,
      });
      setCoverFiles([]);
      setBookFiles([]);
    }
  }, [initialData, open, form]);

  const onSubmit = async (values: BookFormValues) => {
    if (initialData) {
      await updateMutation.mutateAsync({
        bookId: initialData.id,
        title: values.title,
        author: values.author,
        publisher: values.publisher,
        bCoverUrl: values.bCoverUrl,
        bUrl: values.bUrl,
        status: values.status,
        displayOrder: values.displayOrder,
        deletedAt: initialData.deletedAt,
      });
    } else {
      await createMutation.mutateAsync({
        title: values.title,
        author: values.author,
        publisher: values.publisher,
        bCoverUrl: values.bCoverUrl,
        bUrl: values.bUrl,
        status: values.status,
        displayOrder: values.displayOrder,
        deletedAt: null,
      });
    }
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {initialData
              ? t('books.form.edit_title')
              : t('books.form.create_title')}
          </SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('books.form.title')} *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('books.form.title_placeholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('books.form.author')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('books.form.author_placeholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="publisher"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('books.form.publisher')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('books.form.publisher_placeholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bUrl"
              render={() => (
                <FormItem>
                  <FormLabel>{t('books.form.book_file')} *</FormLabel>
                  <FormControl>
                    <FileUpload
                      value={bookFiles}
                      onValueChange={(files) => {
                        setBookFiles(files);
                        if (files.length > 0) {
                          const file = files[0];
                          form.setValue('bUrl', file.name);
                        }
                      }}
                      onUpload={async (
                        files,
                        { onProgress, onSuccess, onError },
                      ) => {
                        for (const file of files) {
                          try {
                            onProgress(file, 0);
                            const response = await uploadMutation.mutateAsync({
                              file,
                            });
                            if (response.data) {
                              form.setValue('bUrl', response.data);
                              onProgress(file, 100);
                              onSuccess(file);
                            }
                          } catch (error) {
                            onError(
                              file,
                              error instanceof Error
                                ? error
                                : new Error('Upload failed'),
                            );
                          }
                        }
                      }}
                      accept=".epub"
                      maxFiles={1}
                      maxSize={100 * 1024 * 1024} // 100MB
                    >
                      <FileUploadDropzone className="rounded-lg border-2 border-dashed p-6">
                        <div className="text-center">
                          <div className="text-sm font-medium text-muted-foreground">
                            Drag and drop your book file here
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">
                            or
                          </div>
                          <FileUploadTrigger asChild>
                            <Button type="button" variant="link" size="sm">
                              Click to browse
                            </Button>
                          </FileUploadTrigger>
                        </div>

                        <FileUploadList className="mt-4 space-y-2">
                          {bookFiles.map((file) => (
                            <FileUploadItem key={file.name} value={file}>
                              <div className="flex items-center gap-3 w-full">
                                <FileUploadItemPreview />
                                <div className="flex-1">
                                  <FileUploadItemMetadata />
                                  <FileUploadItemProgress />
                                </div>
                                <FileUploadItemDelete />
                              </div>
                            </FileUploadItem>
                          ))}
                        </FileUploadList>
                      </FileUploadDropzone>
                    </FileUpload>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bCoverUrl"
              render={() => (
                <FormItem>
                  <FormLabel>{t('books.form.cover_image')}</FormLabel>
                  <FormControl>
                    <FileUpload
                      value={coverFiles}
                      onValueChange={(files) => {
                        setCoverFiles(files);
                        if (files.length > 0) {
                          const file = files[0];
                          form.setValue('bCoverUrl', file.name);
                        }
                      }}
                      onUpload={async (
                        files,
                        { onProgress, onSuccess, onError },
                      ) => {
                        for (const file of files) {
                          try {
                            onProgress(file, 0);
                            const response = await uploadMutation.mutateAsync({
                              file,
                            });
                            if (response.data) {
                              form.setValue('bCoverUrl', response.data);
                              onProgress(file, 100);
                              onSuccess(file);
                            }
                          } catch (error) {
                            onError(
                              file,
                              error instanceof Error
                                ? error
                                : new Error('Upload failed'),
                            );
                          }
                        }
                      }}
                      accept="image/*"
                      maxFiles={1}
                      maxSize={10 * 1024 * 1024} // 10MB
                    >
                      <FileUploadDropzone className="rounded-lg border-2 border-dashed p-6">
                        <div className="text-center">
                          <div className="text-sm font-medium text-muted-foreground">
                            Drag and drop your cover image here
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">
                            or
                          </div>
                          <FileUploadTrigger asChild>
                            <Button type="button" variant="link" size="sm">
                              Click to browse
                            </Button>
                          </FileUploadTrigger>
                        </div>

                        <FileUploadList className="mt-4 space-y-2">
                          {coverFiles.map((file) => (
                            <FileUploadItem key={file.name} value={file}>
                              <div className="flex items-center gap-3 w-full">
                                <FileUploadItemPreview />
                                <div className="flex-1">
                                  <FileUploadItemMetadata />
                                  <FileUploadItemProgress />
                                </div>
                                <FileUploadItemDelete />
                              </div>
                            </FileUploadItem>
                          ))}
                        </FileUploadList>
                      </FileUploadDropzone>
                    </FileUpload>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('books.form.status')}</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={BookStatus.PUBLISHED}>
                        {t('books.form.status_published')}
                      </SelectItem>
                      <SelectItem value={BookStatus.UNPUBLISHED}>
                        {t('books.form.status_unpublished')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="displayOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('books.form.display_order')}</FormLabel>
                  <FormControl>
                    <Input placeholder="0" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-6">
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? t('books.form.saving') + '...'
                  : initialData
                    ? t('books.form.update_book')
                    : t('books.form.create_book')}
              </Button>
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  {t('books.form.cancel')}
                </Button>
              </SheetClose>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
