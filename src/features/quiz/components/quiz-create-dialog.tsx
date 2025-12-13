import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, Upload } from 'lucide-react';
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import * as XLSX from 'xlsx';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FileUpload, FileUploadTrigger } from '@/components/ui/file-upload';
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
import { useGetCourseQuery } from '@/features/courses/services/queries';
import { useUploadFileMutation } from '@/features/media/services/mutations';
import { useGetModuleByCourseQuery } from '@/features/modules/services/queries';
import {
  useCreateQuizGeneralMutation,
  useCreateQuizMutation,
} from '@/features/quiz/service/mutations';

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

const quizCreateFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  durationInMinutes: z
    .number()
    .min(1, 'Duration must be at least 1 minute')
    .optional(),
  moduleId: z.string().optional(),
  imageSource: z.string().optional(),
  questions: z.array(questionSchema).min(1, 'At least 1 question is required'),
});

type QuizCreateFormValues = z.infer<typeof quizCreateFormSchema>;

interface QuizCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const QuizCreateDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: QuizCreateDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'general' | 'course'>('general');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');

  const { data: coursesData } = useGetCourseQuery();
  const { data: modulesData } = useGetModuleByCourseQuery(selectedCourseId);

  const createQuizMutation = useCreateQuizMutation();
  const createQuizGeneralMutation = useCreateQuizGeneralMutation();
  const uploadFileMutation = useUploadFileMutation();
  const form = useForm<QuizCreateFormValues>({
    resolver: zodResolver(quizCreateFormSchema),
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

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const parseExcelToQuestions = (jsonData: string[][]) => {
    try {
      if (jsonData.length === 0) return;

      const dataRows = jsonData.slice(1);
      const questionsMap = new Map();

      for (const row of dataRows) {
        if (row.length < 5) continue;

        const [
          questionNoRaw,
          questionContent,
          questionType,
          optionContent,
          isCorrectRaw,
        ] = row;

        const questionNo = String(questionNoRaw || '').trim();
        const cleanQuestionContent = String(questionContent || '').trim();
        const cleanOptionContent = String(optionContent || '').trim();
        const cleanQuestionType = String(questionType || '')
          .trim()
          .toUpperCase();

        if (!questionNo || !cleanQuestionContent || !cleanOptionContent)
          continue;

        const questionKey = questionNo;

        if (!questionsMap.has(questionKey)) {
          questionsMap.set(questionKey, {
            content: cleanQuestionContent,
            questionType:
              cleanQuestionType === 'MULTIPLE_CHOICE'
                ? 'MULTIPLE_CHOICE'
                : 'SINGLE_CHOICE',
            options: [],
          });
        }

        let isCorrect = false;
        if (typeof isCorrectRaw === 'boolean') {
          isCorrect = isCorrectRaw;
        } else if (typeof isCorrectRaw === 'string') {
          const cleanIsCorrect = isCorrectRaw.trim().toLowerCase();
          isCorrect =
            cleanIsCorrect === 'true' ||
            cleanIsCorrect === '1' ||
            cleanIsCorrect === 'yes';
        } else if (typeof isCorrectRaw === 'number') {
          isCorrect = isCorrectRaw === 1;
        }

        const question = questionsMap.get(questionKey);

        const existingOption = question.options.find(
          (opt: any) => opt.content === cleanOptionContent,
        );
        if (!existingOption) {
          question.options.push({
            content: cleanOptionContent,
            isCorrect,
          });
        }
      }

      const questions = Array.from(questionsMap.values());

      questions.forEach((question) => {
        if (question.questionType === 'SINGLE_CHOICE') {
          let correctCount = 0;
          question.options.forEach((option: any) => {
            if (option.isCorrect) {
              correctCount++;
              if (correctCount > 1) {
                option.isCorrect = false;
              }
            }
          });

          // Nếu không có đáp án đúng nào, đặt đáp án đầu tiên làm đúng
          if (correctCount === 0 && question.options.length > 0) {
            question.options[0].isCorrect = true;
          }
        } else if (question.questionType === 'MULTIPLE_CHOICE') {
          const hasCorrectAnswer = question.options.some(
            (option: any) => option.isCorrect,
          );
          if (!hasCorrectAnswer && question.options.length > 0) {
            question.options[0].isCorrect = true;
          }
        }

        while (question.options.length < 2) {
          question.options.push({
            content: '',
            isCorrect: false,
          });
        }
      });

      if (questions.length > 0) {
        const currentQuestionsCount = questionFields.length;
        for (let i = currentQuestionsCount - 1; i >= 0; i--) {
          removeQuestion(i);
        }

        questions.forEach((question) => {
          appendQuestion(question);
        });
      }
    } catch (error) {
      console.error('Error parsing Excel to questions:', error);
    }
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

  const handleExcelUpload = (files: File[]) => {
    const file = files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const jsonData = XLSX.utils.sheet_to_json(ws, {
          header: 1,
        }) as string[][];

        if (jsonData.length > 0) {
          parseExcelToQuestions(jsonData);
        }
      } catch (error) {
        console.error('Error reading Excel file:', error);
      }
    };
    reader.readAsBinaryString(file);
  };

  const onSubmit = async (values: QuizCreateFormValues) => {
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

      if (activeTab === 'general') {
        // For general quiz, use imageSource and don't require moduleId
        const generalPayload = {
          ...submitValues,
          imageSource: values.imageSource || null,
          moduleId: 'general-module-id', // Replace with actual general module ID if needed
        };
        await createQuizGeneralMutation.mutateAsync(generalPayload);
      } else {
        // For course quiz, validate moduleId
        if (!values.moduleId) {
          throw new Error('Module is required for course quiz');
        }
        const coursePayload = {
          ...submitValues,
          moduleId: values.moduleId,
        };
        await createQuizMutation.mutateAsync(coursePayload);
      }

      onSuccess?.();
      onOpenChange(false);
      form.reset();
      setSelectedCourseId('');
      setUploadedImageUrl('');
      setActiveTab('general');
    } catch (error) {
      console.error('Error creating quiz:', error);
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
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
          setSelectedCourseId('');
          setUploadedImageUrl('');
          setActiveTab('general');
        }
        onOpenChange(open);
      }}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Quiz</DialogTitle>
          <div className="flex items-start justify-between w-full">
            <DialogDescription>
              Create a new quiz with questions and options.
            </DialogDescription>

            <div className="items-end">
              <Tabs
                value={activeTab}
                onValueChange={(val) => {
                  setActiveTab(val as 'general' | 'course');
                  if (val === 'general') {
                    setSelectedCourseId('');
                    form.setValue('moduleId', '');
                  } else {
                    setUploadedImageUrl('');
                    form.setValue('imageSource', '');
                  }
                }}
              >
                <TabsList>
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="course">Course</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
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
                        min={1}
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

            {activeTab === 'general' ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Quiz Image</h3>
                  <div className="flex items-center gap-2">
                    <FileUpload
                      accept="image/*"
                      maxFiles={1}
                      onValueChange={handleImageUpload}
                    >
                      <FileUploadTrigger className="px-3 py-1.5 border rounded-md text-sm bg-background hover:bg-accent transition-colors inline-flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Upload Image
                      </FileUploadTrigger>
                    </FileUpload>
                    {uploadFileMutation.isPending && (
                      <span className="text-sm text-muted-foreground">
                        Uploading... {uploadFileMutation.progress}%
                      </span>
                    )}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="imageSource"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter image URL..."
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
                  Course & Module Selection
                </h3>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <FormLabel>Select Course</FormLabel>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          {selectedCourseId
                            ? coursesData?.content?.find(
                                (c) => c.id === selectedCourseId,
                              )?.title || 'Select a course'
                            : 'Select a course'}
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
                          <FormLabel>Select Module *</FormLabel>
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
                                      )?.name || 'Select a module'
                                    : 'Select a module'}
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
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium">Questions</h3>
                  <FileUpload
                    accept=".xlsx,.xls"
                    maxFiles={1}
                    onValueChange={handleExcelUpload}
                  >
                    <FileUploadTrigger className="ml-2 px-3 py-1.5 border rounded-md text-sm bg-background hover:bg-accent transition-colors inline-flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload Excel
                    </FileUploadTrigger>
                  </FileUpload>
                </div>
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
                onClick={() => {
                  form.reset();
                  onOpenChange(false);
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Quiz'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
