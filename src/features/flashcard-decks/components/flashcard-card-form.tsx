import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

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
import { Textarea } from '@/components/ui/textarea';

import type { Flashcard } from '@/features/flashcard/types';

const flashcardFormSchema = z.object({
  term: z.string().min(1, 'Term is required'),
  definition: z.string().min(1, 'Definition is required'),
  termImgUrl: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
  defImgUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type FlashcardFormValues = z.infer<typeof flashcardFormSchema>;

interface FlashcardCardFormProps {
  card?: Flashcard;
  isLoading?: boolean;
  onSubmit: (values: FlashcardFormValues) => void;
  onCancel: () => void;
}

export const FlashcardCardForm = ({
  card,
  isLoading,
  onSubmit,
  onCancel,
}: FlashcardCardFormProps) => {
  const form = useForm<FlashcardFormValues>({
    resolver: zodResolver(flashcardFormSchema),
    defaultValues: {
      term: card?.term || '',
      definition: card?.definition || '',
      termImgUrl: card?.termImgUrl || '',
      defImgUrl: card?.defImgUrl || '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="term"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Term</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter the term or question"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="termImgUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Term Image URL (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com/image.jpg"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="definition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Definition</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter the definition or answer"
                  className="min-h-[100px] resize-none"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="defImgUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Definition Image URL (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com/image.jpg"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {card ? 'Update Card' : 'Create Card'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
