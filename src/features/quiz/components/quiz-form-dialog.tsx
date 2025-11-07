import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useCreateQuizMutation } from '@/features/quiz/service/mutations';

const questionSchema = z.object({
  content: z.string().min(1, 'Question content is required'),
  questionType: z.enum(['SINGLE_CHOICE', 'MULTIPLE_CHOICE']),
  options: z
    .array(
      z.object({
        content: z.string().min(1, 'Option content is required'),
        isCorrect: z.boolean(),
      }),
    )
    .min(2, 'At least 2 options are required'),
});

const quizFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  durationInMinutes: z
    .number()
    .min(1, 'Duration must be at least 1 minute')
    .optional(),
  questions: z.array(questionSchema).min(1, 'At least 1 question is required'),
});

type QuizFormValues = z.infer<typeof quizFormSchema>;

interface QuizFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quiz?: any;
  onSuccess?: () => void;
}

export const QuizFormDialog = ({
  open,
  onOpenChange,
  quiz,
  onSuccess,
}: QuizFormDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const isEdit = !!quiz;

  const createQuizMutation = useCreateQuizMutation();
  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      title: quiz?.title || '',
      description: quiz?.description || '',
      durationInMinutes: quiz?.durationInMinutes || undefined,
      questions: quiz?.questions || [
        {
          content: '',
          questionType: 'SINGLE_CHOICE' as const,
          options: [
            { content: '', isCorrect: true },
            { content: '', isCorrect: false },
          ],
        },
      ],
    },
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control: form.control,
    name: 'questions',
  });

  const onSubmit = async (values: QuizFormValues) => {
    setIsLoading(true);
    try {
      const processedQuestions = values.questions.map((q) => {
        if (q.questionType === 'SINGLE_CHOICE') {
          let found = false;
          return {
            ...q,
            options: q.options.map((opt) => {
              if (opt.isCorrect && !found) {
                found = true;
                return { ...opt, isCorrect: true };
              }
              return { ...opt, isCorrect: false };
            }),
          };
        }
        return q;
      });
      const submitValues = {
        ...values,
        questions: processedQuestions,
        durationInMinutes: values.durationInMinutes || 1,
      };
      if (!isEdit) {
        await createQuizMutation.mutateAsync(submitValues);
      }
      onSuccess?.();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Error saving quiz:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addQuestion = () => {
    appendQuestion({
      content: '',
      questionType: 'SINGLE_CHOICE' as const,
      options: [
        { content: '', isCorrect: true },
        { content: '', isCorrect: false },
      ],
    });
  };

  const addOption = (questionIndex: number) => {
    const currentOptions = form.getValues(`questions.${questionIndex}.options`);
    form.setValue(`questions.${questionIndex}.options`, [
      ...currentOptions,
      { content: '', isCorrect: false },
    ]);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const currentOptions = form.getValues(`questions.${questionIndex}.options`);
    if (currentOptions.length > 2) {
      const newOptions = currentOptions.filter(
        (_, index) => index !== optionIndex,
      );
      form.setValue(`questions.${questionIndex}.options`, newOptions);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Quiz' : 'Create New Quiz'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the quiz information and questions.'
              : 'Create a new quiz with questions and options.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter quiz title..." {...field} />
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
                        placeholder="Enter quiz description..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="durationInMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter duration in minutes (optional)..."
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined,
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Questions</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addQuestion}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Question
                </Button>
              </div>

              {questionFields.map((questionField, questionIndex) => (
                <Card key={questionField.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">
                        Question {questionIndex + 1}
                      </CardTitle>
                      {questionFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQuestion(questionIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name={`questions.${questionIndex}.content`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Question Content</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter question content..."
                              rows={2}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`questions.${questionIndex}.questionType`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Question Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select question type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="SINGLE_CHOICE">
                                Single Choice
                              </SelectItem>
                              <SelectItem value="MULTIPLE_CHOICE">
                                Multiple Choice
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <FormLabel>Options</FormLabel>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => addOption(questionIndex)}
                        >
                          <Plus className="mr-1 h-3 w-3" />
                          Add Option
                        </Button>
                      </div>

                      {form
                        .watch(`questions.${questionIndex}.options`)
                        ?.map((_, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="flex items-center gap-2"
                          >
                            <FormField
                              control={form.control}
                              name={`questions.${questionIndex}.options.${optionIndex}.isCorrect`}
                              render={({ field }) => {
                                const questionType = form.watch(
                                  `questions.${questionIndex}.questionType`,
                                );
                                return (
                                  <FormItem>
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={(checked) => {
                                          if (
                                            questionType === 'SINGLE_CHOICE'
                                          ) {
                                            const options = form.getValues(
                                              `questions.${questionIndex}.options`,
                                            );
                                            const newOptions = options.map(
                                              (opt, idx) => ({
                                                ...opt,
                                                isCorrect:
                                                  idx === optionIndex
                                                    ? !!checked
                                                    : false,
                                              }),
                                            );
                                            form.setValue(
                                              `questions.${questionIndex}.options`,
                                              newOptions,
                                            );
                                          } else {
                                            field.onChange(checked);
                                          }
                                        }}
                                      />
                                    </FormControl>
                                  </FormItem>
                                );
                              }}
                            />
                            <FormField
                              control={form.control}
                              name={`questions.${questionIndex}.options.${optionIndex}.content`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Input
                                      placeholder={`Option ${optionIndex + 1}...`}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            {form.watch(`questions.${questionIndex}.options`)
                              ?.length > 2 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  removeOption(questionIndex, optionIndex)
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-end gap-3">
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
                  ? 'Saving...'
                  : isEdit
                    ? 'Update Quiz'
                    : 'Create Quiz'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
