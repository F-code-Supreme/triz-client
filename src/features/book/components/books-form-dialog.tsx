import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
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
} from '../services/mutations';
import { BookStatus } from '../types';

import type { AdminBook } from '../types';

const bookFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().optional().default(''),
  publisher: z.string().optional().default(''),
  bCoverUrl: z.string().url().optional().default(''),
  bUrl: z.string().url('Book URL must be a valid URL'),
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
  const createMutation = useCreateBookMutation();
  const updateMutation = useUpdateBookMutation();
  const isLoading = createMutation.isPending || updateMutation.isPending;

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
      <SheetContent className="w-full max-w-xl">
        <SheetHeader>
          <SheetTitle>
            {initialData ? 'Edit Book' : 'Create New Book'}
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
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Book title" {...field} />
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
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <Input placeholder="Author name" {...field} />
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
                  <FormLabel>Publisher</FormLabel>
                  <FormControl>
                    <Input placeholder="Publisher name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Book URL *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/book.pdf"
                      type="url"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bCoverUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/cover.jpg"
                      type="url"
                      {...field}
                    />
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
                  <FormLabel>Status</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={BookStatus.PUBLISHED}>
                        Published
                      </SelectItem>
                      <SelectItem value={BookStatus.UNPUBLISHED}>
                        Unpublished
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
                  <FormLabel>Display Order</FormLabel>
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
                  ? 'Saving...'
                  : initialData
                    ? 'Update Book'
                    : 'Create Book'}
              </Button>
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </SheetClose>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
