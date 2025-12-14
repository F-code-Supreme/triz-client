import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, Upload } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { FileUpload, FileUploadTrigger } from '@/components/ui/file-upload';
import { useGetCourseQuery } from '@/features/courses/services/queries';
import { useUploadFileMutation } from '@/features/media/services/mutations';
import {
  useGetModuleByCourseQuery,
  useGetModulesById,
} from '@/features/modules/services/queries';
import {
  useUpdateQuizMutation,
  useGetQuizByIdMutationAdmin,
} from '@/features/quiz/service/mutations';

const createQuestionSchema = (t: any) =>
  z.object({
    content: z
      .string()
      .min(1, t('quizzes.create_dialog.question.content_required')),
    questionType: z.enum(['SINGLE_CHOICE', 'MULTIPLE_CHOICE']),
    options: z
      .array(
        z.object({
          content: z
            .string()
            .min(1, t('quizzes.create_dialog.question.option_required')),
          isCorrect: z.boolean(),
        }),
      )
      .min(2, t('quizzes.create_dialog.question.min_options')),
  });

const createQuizEditFormSchema = (t: any) =>
  z.object({
    title: z.string().min(1, t('quizzes.create_dialog.form.title_required')),
    description: z
      .string()
      .min(1, t('quizzes.create_dialog.form.description_required')),
    durationInMinutes: z
      .number()
      .min(1, t('quizzes.create_dialog.form.duration_min'))
      .optional(),
    moduleId: z.string().optional(),
    imageSource: z.string().optional(),
    questions: z
      .array(createQuestionSchema(t))
      .min(1, t('quizzes.create_dialog.question.min_questions')),
  });

type QuizEditFormValues = z.infer<ReturnType<typeof createQuizEditFormSchema>>;

interface QuizEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quizId: string;
  onSuccess?: () => void;
}

export const QuizEditDialog = ({
  open,
  onOpenChange,
  quizId,
  onSuccess,
}: QuizEditDialogProps) => {
  const { t } = useTranslation('pages.admin');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [isGeneralQuiz, setIsGeneralQuiz] = useState<boolean>(false);

  const { data: coursesData } = useGetCourseQuery();
  const { data: modulesData } = useGetModuleByCourseQuery(selectedCourseId);

  const updateQuizMutation = useUpdateQuizMutation();
  const uploadFileMutation = useUploadFileMutation();
  const {
    data: quizData,
    isLoading: isLoadingQuiz,
    error,
  } = useGetQuizByIdMutationAdmin(quizId);

  const { data: currentModuleData } = useGetModulesById(
    quizData?.moduleId || '',
  );

  const form = useForm<QuizEditFormValues>({
    resolver: zodResolver(createQuizEditFormSchema(t)),
    mode: 'onSubmit',
    defaultValues: {
      title: '',
      description: '',
      durationInMinutes: undefined,
      moduleId: '',
      imageSource: '',
      questions: [
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

  useEffect(() => {
    if (quizData) {
      const isGeneral = !quizData.moduleId;
      setIsGeneralQuiz(isGeneral);

      if (isGeneral && quizData.imageSource) {
        setUploadedImageUrl(quizData.imageSource);
      }

      const formattedQuestions =
        quizData.questions?.map((question) => ({
          content: question.content,
          questionType: question.questionType as
            | 'SINGLE_CHOICE'
            | 'MULTIPLE_CHOICE',
          options:
            question.options?.map((option) => ({
              content: option.content,
              isCorrect: option.isCorrect,
            })) || [],
        })) || [];

      if (!isGeneral && currentModuleData?.courseId) {
        setSelectedCourseId(currentModuleData.courseId);
      }

      form.reset({
        title: quizData.title || '',
        description: quizData.description || '',
        durationInMinutes: quizData.durationInMinutes
          ? Number(quizData.durationInMinutes)
          : undefined,
        moduleId: quizData.moduleId || '',
        imageSource: quizData.imageSource || '',
        questions:
          formattedQuestions.length > 0
            ? formattedQuestions
            : [
                {
                  content: '',
                  questionType: 'SINGLE_CHOICE' as const,
                  options: [
                    { content: '', isCorrect: true },
                    { content: '', isCorrect: false },
                  ],
                },
              ],
      });
    }
  }, [quizData, currentModuleData, form]);

  const onSubmit = async (values: QuizEditFormValues) => {
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

      const submitValues: any = {
        title: values.title,
        description: values.description,
        questions: processedQuestions,
      };

      if (isGeneralQuiz) {
        submitValues.imageSource = values.imageSource || null;
        submitValues.moduleId = null;
      } else {
        if (!values.moduleId) {
          throw new Error('Module is required for course quiz');
        }
        submitValues.moduleId = values.moduleId;
      }

      await updateQuizMutation.mutateAsync({
        quizId,
        payload: submitValues,
      });

      onSuccess?.();
      onOpenChange(false);
      setSelectedCourseId('');
    } catch (error) {
      console.error('Error updating quiz:', error);
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

  const handleImageUpload = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const response = await uploadFileMutation.mutateAsync({ file });
      const imageUrl = response.data || response;
      setUploadedImageUrl(imageUrl as string);
      form.setValue('imageSource', imageUrl as string);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsLoading(false);
    }
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

  if (isLoadingQuiz) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">
                {t('quizzes.edit_dialog.loading')}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <p className="text-red-600">{t('quizzes.edit_dialog.error')}</p>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="mt-4"
              >
                {t('quizzes.edit_dialog.close')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('quizzes.edit_dialog.title')}</DialogTitle>
          <DialogDescription>
            {t('quizzes.edit_dialog.description')}
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
                    <FormLabel>
                      {t('quizzes.create_dialog.form.title')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          'quizzes.create_dialog.form.title_placeholder',
                        )}
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
                    <FormLabel>
                      {t('quizzes.create_dialog.form.description')}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t(
                          'quizzes.create_dialog.form.description_placeholder',
                        )}
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
                    <FormLabel>
                      {t('quizzes.create_dialog.form.duration')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        placeholder={t(
                          'quizzes.create_dialog.form.duration_placeholder',
                        )}
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

            {isGeneralQuiz ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">
                    {t('quizzes.create_dialog.form.upload_image')}
                  </h3>
                  <div className="flex items-center gap-2">
                    <FileUpload
                      accept="image/*"
                      maxFiles={1}
                      onValueChange={handleImageUpload}
                    >
                      <FileUploadTrigger className="px-3 py-1.5 border rounded-md text-sm bg-background hover:bg-accent transition-colors inline-flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        {t('quizzes.create_dialog.form.upload')}
                      </FileUploadTrigger>
                    </FileUpload>
                    {uploadFileMutation.isPending && (
                      <span className="text-sm text-muted-foreground">
                        {t('quizzes.create_dialog.form.upload_loading')}{' '}
                        {uploadFileMutation.progress}%
                      </span>
                    )}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="imageSource"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder={t(
                            'quizzes.create_dialog.form.upload_placeholder',
                          )}
                          {...field}
                          value={uploadedImageUrl || field.value || ''}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            setUploadedImageUrl(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {uploadedImageUrl && (
                  <div className="mt-2">
                    <img
                      src={uploadedImageUrl}
                      alt="Quiz preview"
                      className="max-w-xs rounded-md border"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {t('quizzes.create_dialog.course_module')}
                </h3>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <FormLabel>
                      {t('quizzes.create_dialog.form.course')}
                    </FormLabel>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          {selectedCourseId
                            ? coursesData?.content?.find(
                                (c) => c.id === selectedCourseId,
                              )?.title ||
                              t('quizzes.create_dialog.form.course_placeholder')
                            : t(
                                'quizzes.create_dialog.form.course_placeholder',
                              )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[400px] max-h-[300px] overflow-y-auto">
                        {coursesData?.content?.map((course) => (
                          <DropdownMenuItem
                            key={course.id}
                            onClick={() => {
                              setSelectedCourseId(course.id);
                              form.setValue('moduleId', '');
                            }}
                          >
                            {course.title}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {selectedCourseId && (
                    <FormField
                      control={form.control}
                      name="moduleId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t('quizzes.create_dialog.form.module')}
                          </FormLabel>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start"
                                >
                                  {field.value
                                    ? modulesData?.find(
                                        (m) => m.id === field.value,
                                      )?.name ||
                                      t(
                                        'quizzes.create_dialog.form.module_placeholder',
                                      )
                                    : t(
                                        'quizzes.create_dialog.form.module_placeholder',
                                      )}
                                </Button>
                              </FormControl>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[400px] max-h-[300px] overflow-y-auto">
                              {modulesData?.map((module) => (
                                <DropdownMenuItem
                                  key={module.id}
                                  onClick={() => field.onChange(module.id)}
                                >
                                  <div className="flex flex-col">
                                    <span>{module.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {module.durationInMinutes} mins · Level:{' '}
                                      {module.level}
                                    </span>
                                  </div>
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
            )}

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  {t('quizzes.create_dialog.questions_section')}
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addQuestion}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t('quizzes.create_dialog.add_question')}
                </Button>
              </div>

              {questionFields.map((questionField, questionIndex) => (
                <Card key={questionField.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">
                        {t('quizzes.create_dialog.question.title', {
                          number: questionIndex + 1,
                        })}
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
                          <FormLabel>
                            {t('quizzes.create_dialog.question.content')}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={t(
                                'quizzes.create_dialog.question.content_placeholder',
                              )}
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
                          <FormLabel>
                            {t('quizzes.create_dialog.question.type')}
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={t(
                                    'quizzes.create_dialog.question.type',
                                  )}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="SINGLE_CHOICE">
                                {t(
                                  'quizzes.create_dialog.question.single_choice',
                                )}
                              </SelectItem>
                              <SelectItem value="MULTIPLE_CHOICE">
                                {t(
                                  'quizzes.create_dialog.question.multiple_choice',
                                )}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <FormLabel>
                          {t('quizzes.create_dialog.question.option')}
                        </FormLabel>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => addOption(questionIndex)}
                        >
                          <Plus className="mr-1 h-3 w-3" />
                          {t('quizzes.create_dialog.question.add_option')}
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
                                      placeholder={t(
                                        'quizzes.create_dialog.question.option_placeholder',
                                      )}
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
                {t('quizzes.edit_dialog.buttons.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? t('quizzes.edit_dialog.buttons.updating')
                  : t('quizzes.edit_dialog.buttons.update')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
