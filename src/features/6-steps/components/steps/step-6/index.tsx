import { HelpCircle, Loader2, Star } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useStep6SuggestionMutation } from '@/features/6-steps/services/mutations';
import { useSixStepDataStore } from '@/features/6-steps/store/useSixStepDataStore';

import ActionButtons from '../../action-buttons';

import type {
  Idea,
  IStep6SuggestionResponse,
} from '@/features/6-steps/services/mutations/types';

interface Step6Props {
  onNext: (data: Record<string, unknown>) => void;
  onBack: () => void;
  initialData?: Record<string, unknown>;
}

interface IdeaEvaluation extends IStep6SuggestionResponse {
  idea: Idea;
  isLoading?: boolean;
  userComment?: string;
  userRating?: number;
}

const getCategoryBadgeVariant = (
  category: 'excellent' | 'good' | 'average' | 'poor',
) => {
  switch (category) {
    case 'excellent':
      return 'default'; // blue
    case 'good':
      return 'secondary'; // green-ish
    case 'average':
      return 'outline'; // neutral
    case 'poor':
      return 'destructive'; // red
    default:
      return 'outline';
  }
};

const getCategoryLabel = (
  category: 'excellent' | 'good' | 'average' | 'poor',
) => {
  switch (category) {
    case 'excellent':
      return 'Xuất sắc';
    case 'good':
      return 'Tốt';
    case 'average':
      return 'Trung bình';
    case 'poor':
      return 'Kém';
    default:
      return category;
  }
};

export const Step6MakeDecision = ({
  onNext,
  onBack,
  initialData,
}: Step6Props) => {
  const { stepData } = useSixStepDataStore();
  const step6Mutation = useStep6SuggestionMutation();

  const [evaluations, setEvaluations] = useState<IdeaEvaluation[]>([]);
  const [currentEvaluatingIndex, setCurrentEvaluatingIndex] = useState(0);

  const selectedIdeas = useMemo(
    () =>
      (initialData?.selectedIdeas as Idea[]) ||
      (stepData.step5?.selectedIdeas as Idea[]) ||
      (stepData.step5?.ideas?.slice(0, 3) as Idea[]) ||
      [],
    [initialData?.selectedIdeas, stepData.step5],
  );

  const targetML =
    stepData.step4?.physicalContradictions[
      stepData.step4.selectedPhysicalContradictionIndex || 0
    ]?.contradictionStatement || '';

  const physicalContradictions = useMemo(
    () => stepData.step4?.physicalContradictions || [],
    [stepData.step4?.physicalContradictions],
  );

  // Evaluate ideas one by one
  useEffect(() => {
    const evaluateNextIdea = async () => {
      if (currentEvaluatingIndex >= selectedIdeas.length) return;

      const idea = selectedIdeas[currentEvaluatingIndex];

      // Check if already evaluated or being evaluated
      const existingEvaluation = evaluations.find((e) => e.ideaId === idea.id);
      if (existingEvaluation) return;

      // Add loading state - ensure uniqueness by filtering first
      setEvaluations((prev) => {
        // Remove any existing evaluation for this idea (safety check)
        const filtered = prev.filter((e) => e.ideaId !== idea.id);
        return [
          ...filtered,
          {
            idea,
            ideaId: idea.id,
            status: 'passing' as const,
            evaluation: {
              scores: {
                mlResolution: 0,
                feasibility: 0,
                systemImpact: 0,
                total: 0,
              },
              category: 'average' as const,
              keyStrengths: [],
              keyWeaknesses: [],
              explanation: {
                mlResolution: '',
                feasibility: '',
                systemImpact: '',
              },
            },
            message: '',
            rejectionReason: null,
            category: null,
            suggestion: null,
            assumption: null,
            note: null,
            isLoading: true,
          },
        ];
      });

      try {
        const response = await step6Mutation.mutateAsync({
          targetML,
          idea,
          physicalContradictions,
        });

        setEvaluations((prev) => {
          // Ensure uniqueness when updating
          const filtered = prev.filter((e) => e.ideaId !== idea.id);
          return [...filtered, { ...response, idea, isLoading: false }];
        });

        setCurrentEvaluatingIndex((prev) => prev + 1);
      } catch (error) {
        console.error('Failed to evaluate idea:', error);
        toast.error(`Không thể đánh giá ý tưởng #${idea.id}`);

        // Remove the loading evaluation
        setEvaluations((prev) => prev.filter((e) => e.ideaId !== idea.id));
      }
    };

    evaluateNextIdea();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEvaluatingIndex, selectedIdeas.length]);

  const handleUserCommentChange = (ideaId: number, comment: string) => {
    setEvaluations((prev) =>
      prev.map((e) =>
        e.ideaId === ideaId ? { ...e, userComment: comment } : e,
      ),
    );
  };

  const handleUserRatingChange = (ideaId: number, rating: number) => {
    setEvaluations((prev) =>
      prev.map((e) => (e.ideaId === ideaId ? { ...e, userRating: rating } : e)),
    );
  };

  const handleNext = () => {
    // Get unique evaluations based on ideaId
    const uniqueEvaluations = Array.from(
      new Map(evaluations.map((e) => [e.ideaId, e])).values(),
    );

    const passingEvaluations = uniqueEvaluations.filter(
      (e) => e.status === 'passing',
    );

    if (passingEvaluations.length === 0) {
      toast.error('Cần ít nhất một ý tưởng đạt yêu cầu để tiếp tục');
      return;
    }

    onNext({ evaluations: passingEvaluations });
  };

  // Get unique evaluations for display and validation
  const uniqueEvaluations = useMemo(
    () => Array.from(new Map(evaluations.map((e) => [e.ideaId, e])).values()),
    [evaluations],
  );

  const allEvaluationsComplete =
    uniqueEvaluations.length === selectedIdeas.length &&
    uniqueEvaluations.every((e) => !e.isLoading);

  return (
    <div className="max-w-4xl xl:max-w-5xl 2xl:max-w-7xl mx-auto h-full flex flex-col gap-4">
      <div className="flex-1 flex flex-col gap-4">
        <div className="self-stretch text-center justify-start text-4xl font-bold leading-[48px] tracking-tight">
          Ra quyết định
        </div>

        <div className="self-stretch px-6 py-5 bg-blue-50 dark:bg-blue-950 rounded-lg outline outline-1 outline-offset-[-1px] outline-blue-600 inline-flex justify-center items-center gap-2 mx-auto">
          <div className="justify-start text-blue-800 dark:text-blue-200 text-base font-bold leading-6">
            Mâu thuẫn vật lý: {targetML}
          </div>
        </div>

        <div className="self-stretch justify-start text-sm font-semibold leading-6 text-slate-600">
          Xem đánh giá của AI cho từng ý tưởng và để lại nhận xét của bạn:
        </div>

        <ScrollArea className="h-[50vh] pr-4">
          <div className="flex flex-col gap-6">
            {selectedIdeas.map((idea) => {
              const evaluation = uniqueEvaluations.find(
                (e) => e.ideaId === idea.id,
              );
              const isEvaluating = evaluation?.isLoading;
              const isWaiting = !evaluation;

              return (
                <div
                  key={idea.id}
                  className={`p-4 rounded-lg border-2 ${
                    evaluation?.status === 'rejected'
                      ? 'border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-950/20'
                      : evaluation?.status === 'passing'
                        ? 'border-primary/50 bg-primary/5'
                        : 'border-border'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-base">
                          Ý tưởng #{idea.id}
                        </h3>
                        {evaluation && !isEvaluating && (
                          <>
                            {evaluation.status === 'rejected' ? (
                              <Badge
                                variant="outline"
                                className="border-yellow-500 text-yellow-700 dark:text-yellow-500"
                              >
                                Không khả thi
                              </Badge>
                            ) : (
                              evaluation.evaluation && (
                                <Badge
                                  variant={getCategoryBadgeVariant(
                                    evaluation.evaluation.category,
                                  )}
                                >
                                  {getCategoryLabel(
                                    evaluation.evaluation.category,
                                  )}
                                </Badge>
                              )
                            )}
                          </>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {idea.ideaStatement}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Nguyên tắc: {idea.principleUsed.name}
                      </p>
                    </div>
                  </div>

                  {/* Loading/Waiting States */}
                  {isWaiting && (
                    <div className="text-center py-4 text-muted-foreground">
                      <p className="text-sm">Chờ đánh giá...</p>
                    </div>
                  )}

                  {isEvaluating && (
                    <div className="flex items-center justify-center gap-2 py-4">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span className="text-sm text-muted-foreground">
                        Đang đánh giá ý tưởng...
                      </span>
                    </div>
                  )}

                  {/* Evaluation Content */}
                  {evaluation && !isEvaluating && (
                    <div className="space-y-4">
                      {/* Rejected Idea */}
                      {evaluation.status === 'rejected' ||
                      !evaluation.evaluation ? (
                        <div className="space-y-3">
                          <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-500/50 rounded-lg">
                            {evaluation.rejectionReason && (
                              <div className="space-y-2">
                                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-600">
                                  Lý do:
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {evaluation.rejectionReason}
                                </p>
                              </div>
                            )}
                            {evaluation.category && (
                              <div className="mt-2 text-sm">
                                <span className="font-medium">Loại: </span>
                                <span className="text-muted-foreground">
                                  {evaluation.category ===
                                  'constraint_violation'
                                    ? 'Vi phạm ràng buộc'
                                    : evaluation.category === 'not_solving_ml'
                                      ? 'Không giải quyết ML'
                                      : evaluation.category === 'not_feasible'
                                        ? 'Không khả thi'
                                        : evaluation.category}
                                </span>
                              </div>
                            )}
                            {evaluation.suggestion && (
                              <div className="mt-3 space-y-1">
                                <p className="text-sm font-medium">Gợi ý:</p>
                                <p className="text-sm text-muted-foreground">
                                  {evaluation.suggestion}
                                </p>
                              </div>
                            )}
                            {evaluation.message && (
                              <div className="mt-3 text-sm text-muted-foreground">
                                {evaluation.message}
                              </div>
                            )}
                          </div>

                          {/* User Feedback Section for Rejected Ideas */}
                          <div className="space-y-3 pt-3 border-t">
                            <h4 className="text-sm font-semibold">
                              Đánh giá của bạn:
                            </h4>

                            {/* User Rating */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Đánh giá (1-5 sao)
                              </label>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() =>
                                      handleUserRatingChange(idea.id, star)
                                    }
                                    className="focus:outline-none"
                                  >
                                    <Star
                                      className={`h-6 w-6 ${
                                        (evaluation.userRating ?? 0) >= star
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* User Comment */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Nhận xét của bạn
                              </label>
                              <Textarea
                                placeholder="Thêm nhận xét về ý tưởng này..."
                                value={evaluation.userComment || ''}
                                onChange={(e) =>
                                  handleUserCommentChange(
                                    idea.id,
                                    e.target.value,
                                  )
                                }
                                className="min-h-[80px]"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* AI Evaluation Reasoning */}
                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold">
                              Đánh giá của AI:
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {/* ML Resolution */}
                              <div className="space-y-2">
                                <div className="flex items-center gap-1">
                                  <label className="text-sm font-medium">
                                    Giải quyết ML
                                  </label>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-4 w-4 p-0"
                                      >
                                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80">
                                      <div className="space-y-2">
                                        <h4 className="font-medium text-sm">
                                          Khả năng giải quyết ML
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                          {evaluation.evaluation.explanation
                                            .mlResolution ||
                                            'Đánh giá mức độ ý tưởng giải quyết được mâu thuẫn vật lý'}
                                        </p>
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              </div>

                              {/* Feasibility */}
                              <div className="space-y-2">
                                <div className="flex items-center gap-1">
                                  <label className="text-sm font-medium">
                                    Tính khả thi
                                  </label>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-4 w-4 p-0"
                                      >
                                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80">
                                      <div className="space-y-2">
                                        <h4 className="font-medium text-sm">
                                          Tính khả thi
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                          {evaluation.evaluation.explanation
                                            .feasibility ||
                                            'Đánh giá khả năng triển khai ý tưởng trong thực tế'}
                                        </p>
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              </div>

                              {/* System Impact */}
                              <div className="space-y-2">
                                <div className="flex items-center gap-1">
                                  <label className="text-sm font-medium">
                                    Tác động hệ thống
                                  </label>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-4 w-4 p-0"
                                      >
                                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80">
                                      <div className="space-y-2">
                                        <h4 className="font-medium text-sm">
                                          Tác động hệ thống
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                          {evaluation.evaluation.explanation
                                            .systemImpact ||
                                            'Đánh giá ảnh hưởng của ý tưởng đến hệ thống tổng thể'}
                                        </p>
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              </div>
                            </div>

                            {/* AI Message */}
                            {evaluation.message && (
                              <div className="text-sm text-muted-foreground bg-muted/30 rounded-lg">
                                {evaluation.message}
                              </div>
                            )}
                          </div>

                          {/* User Feedback Section */}
                          <div className="space-y-3 pt-3 border-t">
                            <h4 className="text-sm font-semibold">
                              Đánh giá của bạn:
                            </h4>

                            {/* User Rating */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Đánh giá (1-5 sao)
                              </label>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() =>
                                      handleUserRatingChange(idea.id, star)
                                    }
                                    className="focus:outline-none"
                                  >
                                    <Star
                                      className={`h-6 w-6 ${
                                        (evaluation.userRating ?? 0) >= star
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* User Comment */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Nhận xét của bạn
                              </label>
                              <Textarea
                                placeholder="Thêm nhận xét về ý tưởng này..."
                                value={evaluation.userComment || ''}
                                onChange={(e) =>
                                  handleUserCommentChange(
                                    idea.id,
                                    e.target.value,
                                  )
                                }
                                className="min-h-[80px]"
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {selectedIdeas.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>Không có ý tưởng nào để đánh giá.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <ActionButtons
        onBack={onBack}
        onNext={handleNext}
        disableNext={!allEvaluationsComplete}
        nextLabel="Xem tóm tắt"
      />
    </div>
  );
};
