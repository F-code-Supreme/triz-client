import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { useState } from 'react';
import { useCreateQuizMutation } from '@/features/quiz/service/mutations';
import { toast } from 'sonner';

interface CreateQuizDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess?: () => void;
}

function CreateQuizDialog({ open, setOpen, onSuccess }: CreateQuizDialogProps) {
  const createQuizMutation = useCreateQuizMutation();

  const [form, setForm] = useState({
    title: '',
    description: '',
    durationInMinutes: 60,
  });

  const [questions, setQuestions] = useState<
    Array<{
      content: string;
      questionType: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';
      options: Array<{
        content: string;
        isCorrect: boolean;
      }>;
    }>
  >([]);

  const [addingQuestion, setAddingQuestion] = useState(false);

  const [questionDraft, setQuestionDraft] = useState({
    content: '',
    options: [{ content: '', isCorrect: false }],
    questionType: 'SINGLE_CHOICE' as 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    try {
      console.log('Submitting quiz with questions:', {
        ...form,
        questions,
      });
      await createQuizMutation.mutateAsync({
        ...form,
        questions,
      });

      toast.success('Quiz created successfully');
      setOpen(false);
      onSuccess?.();

      setForm({
        title: '',
        description: '',
        durationInMinutes: 60,
      });
      setQuestions([]);
      setQuestionDraft({
        content: '',
        options: [{ content: '', isCorrect: false }],
        questionType: 'SINGLE_CHOICE',
      });
      setAddingQuestion(false);
    } catch (error) {
      toast.error('Failed to create quiz');
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Quiz</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Input
                placeholder="Quiz Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <Textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Input
                type="number"
                min={1}
                placeholder="Time Limit (minutes)"
                value={form.durationInMinutes}
                onChange={(e) =>
                  setForm({
                    ...form,
                    durationInMinutes: Number(e.target.value),
                  })
                }
                required
              />
            </div>
          </div>

          <div className="border rounded-lg p-4 mt-2">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">Questions</div>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => setAddingQuestion(true)}
              >
                + Add Question
              </Button>
            </div>
            <div className="space-y-2">
              {questions.map((q, idx) => (
                <div
                  key={idx}
                  className="border rounded p-2 flex flex-col gap-1"
                >
                  <div className="flex gap-2 items-center">
                    <span className="font-medium">
                      Question {idx + 1} ({q.questionType})
                    </span>
                    <span className="text-sm flex-1">{q.content}</span>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setQuestions(questions.filter((_, i) => i !== idx))
                      }
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {addingQuestion && (
              <div className="border rounded-lg p-3 mt-2 space-y-2 bg-muted/30">
                <Select
                  value={questionDraft.questionType}
                  onValueChange={(v) =>
                    setQuestionDraft({
                      ...questionDraft,
                      questionType: v as 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE',
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Question Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SINGLE_CHOICE">Single Choice</SelectItem>
                    <SelectItem value="MULTIPLE_CHOICE">
                      Multiple Choice
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Question Text"
                  value={questionDraft.content}
                  onChange={(e) =>
                    setQuestionDraft({
                      ...questionDraft,
                      content: e.target.value,
                    })
                  }
                />
                <div className="space-y-3">
                  <div className="font-medium text-sm">
                    Answers{' '}
                    <span className="text-xs text-muted-foreground">
                      Mark the correct answer
                    </span>
                  </div>
                  {questionDraft.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2 mb-1">
                      <Input
                        className="flex-1"
                        placeholder={`Answer ${idx + 1}`}
                        value={opt.content}
                        onChange={(e) => {
                          const newOpts = [...questionDraft.options];
                          newOpts[idx].content = e.target.value;
                          setQuestionDraft({
                            ...questionDraft,
                            options: newOpts,
                          });
                        }}
                      />
                      {questionDraft.questionType === 'SINGLE_CHOICE' ? (
                        <Button
                          type="button"
                          size="sm"
                          variant={opt.isCorrect ? 'default' : 'outline'}
                          onClick={() => {
                            const newOpts = questionDraft.options.map(
                              (o, i) => ({
                                ...o,
                                isCorrect: i === idx ? true : false,
                              }),
                            );
                            setQuestionDraft({
                              ...questionDraft,
                              options: newOpts,
                            });
                          }}
                        >
                          {opt.isCorrect ? 'Correct' : 'Mark correct'}
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          variant={opt.isCorrect ? 'default' : 'outline'}
                          onClick={() => {
                            const newOpts = [...questionDraft.options];
                            newOpts[idx].isCorrect = !newOpts[idx].isCorrect;
                            setQuestionDraft({
                              ...questionDraft,
                              options: newOpts,
                            });
                          }}
                        >
                          {opt.isCorrect ? 'Correct' : 'Mark correct'}
                        </Button>
                      )}
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setQuestionDraft({
                            ...questionDraft,
                            options: questionDraft.options.filter(
                              (_, i) => i !== idx,
                            ),
                          })
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      setQuestionDraft({
                        ...questionDraft,
                        options: [
                          ...questionDraft.options,
                          { content: '', isCorrect: false },
                        ],
                      })
                    }
                  >
                    Add Answer
                  </Button>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="default"
                    onClick={() => {
                      if (
                        !questionDraft.content ||
                        questionDraft.options.length < 2 ||
                        !questionDraft.options.some((o) => o.isCorrect)
                      )
                        return;
                      setQuestions([...questions, questionDraft]);
                      setQuestionDraft({
                        content: '',
                        options: [{ content: '', isCorrect: false }],
                        questionType: 'SINGLE_CHOICE',
                      });
                      setAddingQuestion(false);
                    }}
                  >
                    Add Question
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setAddingQuestion(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createQuizMutation.isPending}>
              {createQuizMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateQuizDialog;
