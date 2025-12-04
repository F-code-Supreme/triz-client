import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('pages.admin');
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
            {initialData
              ? t('flashcards.deck_form.edit_title')
              : t('flashcards.deck_form.create_title')}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('flashcards.deck_form.title')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('flashcards.deck_form.title_placeholder')}
                      {...field}
                    />
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
                  <FormLabel>{t('flashcards.deck_form.description')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t(
                        'flashcards.deck_form.description_placeholder',
                      )}
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
                {t('flashcards.deck_form.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? initialData
                    ? t('flashcards.deck_form.updating') + '...'
                    : t('flashcards.deck_form.creating') + '...'
                  : initialData
                    ? t('flashcards.deck_form.update')
                    : t('flashcards.deck_form.create')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
