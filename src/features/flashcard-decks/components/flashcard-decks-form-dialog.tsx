import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import {
  useCreateFlashcardDeckMutation,
  useUpdateFlashcardDeckMutation,
} from '../services/mutations';

import type { FlashcardDeck } from '../types';

const deckFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
});

type DeckFormValues = z.infer<typeof deckFormSchema>;

interface FlashcardDecksFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: FlashcardDeck;
}

export const FlashcardDecksFormDialog = ({
  open,
  onOpenChange,
  initialData,
}: FlashcardDecksFormDialogProps) => {
  const createMutation = useCreateFlashcardDeckMutation();
  const updateMutation = useUpdateFlashcardDeckMutation();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const form = useForm<DeckFormValues>({
    resolver: zodResolver(deckFormSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        description: initialData.description,
      });
    } else {
      form.reset({
        title: '',
        description: '',
      });
    }
  }, [initialData, form]);

  const onSubmit = async (data: DeckFormValues) => {
    try {
      if (initialData) {
        await updateMutation.mutateAsync({
          deckId: initialData.id,
          payload: data as never,
        });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Error submitting deck:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Deck' : 'Create New Deck'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter deck title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter deck description"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? initialData
                    ? 'Updating...'
                    : 'Creating...'
                  : initialData
                    ? 'Update'
                    : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
