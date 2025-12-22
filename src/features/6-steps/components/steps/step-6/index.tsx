import { HelpCircle, Loader2, Star, Info } from 'lucide-react';
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
  IStep6EvaluatedIdea,
} from '@/features/6-steps/services/mutations/types';

interface Step6Props {
  onNext: (data: Record<string, unknown>) => void;
  onBack: () => void;
  initialData?: Record<string, unknown>;
}

interface IdeaEvaluation extends IStep6EvaluatedIdea {
  idea: Idea;
  isLoading?: boolean;
  userComment?: string;
  userRating?: number;
}

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

  const targetML = useMemo(
    () =>
      (initialData?.targetML as string) ||
      (stepData.step5?.targetML as string) ||
      stepData.step4?.physicalContradictions[
        stepData.step4.selectedPhysicalContradictionIndex || 0
      ]?.contradictionStatement ||
      '',
    [initialData?.targetML, stepData.step4, stepData.step5],
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
            status: 'RESERVE' as const,
            analysis: {
              screening: '',
              resourcesAndInertia: '',
              overallBenefit: '',
            },
            decisionMessage: '',
            actionSuggestion: '',
            isLoading: true,
            userComment: undefined,
            userRating: undefined,
          },
        ];
      });

      try {
        const response = await step6Mutation.mutateAsync({
          ideaGenerationSession: {
            targetML,
            ideas: [idea],
          },
        });

        // API returns { evaluatedIdeas: [...] }, extract the first one
        const evaluation = response.evaluatedIdeas[0];

        setEvaluations((prev) => {
          // Ensure uniqueness when updating
          const filtered = prev.filter((e) => e.ideaId !== idea.id);
          return [...filtered, { ...evaluation, idea, isLoading: false }];
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

    const selectedEvaluations = uniqueEvaluations.filter(
      (e) => e.status === 'SELECTED',
    );

    if (selectedEvaluations.length === 0) {
      toast.error('Cần ít nhất một ý tưởng được chọn để tiếp tục');
      return;
    }

    onNext({ evaluations: uniqueEvaluations });
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
        <div className="self-stretch text-center justify-start items-center gap-2 inline-flex">
          <div className="text-4xl font-bold leading-[48px] tracking-tight">
            Ra quyết định
          </div>
          {targetML && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Info className="h-5 w-5 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 max-h-96 overflow-y-auto">
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Thông tin bổ sung</h4>

                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Mâu thuẫn Vật lý mục tiêu:
                    </p>
                    <p className="text-sm">{targetML}</p>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
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
                    evaluation?.status === 'REJECTED'
                      ? 'border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-950/20'
                      : evaluation?.status === 'SELECTED'
                        ? 'border-green-500/50 bg-green-50/50 dark:bg-green-950/20'
                        : evaluation?.status === 'RESERVE'
                          ? 'border-secondary bg-secondary/10'
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
                            {evaluation.status === 'SELECTED' && (
                              <Badge variant="default" className="bg-green-600">
                                Đề xuất
                              </Badge>
                            )}
                            {evaluation.status === 'RESERVE' && (
                              <Badge variant="secondary">Dự phòng</Badge>
                            )}
                            {evaluation.status === 'REJECTED' && (
                              <Badge
                                variant="outline"
                                className="border-yellow-500 text-yellow-700 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-950/30"
                              >
                                Không đề xuất
                              </Badge>
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
                      {/* REJECTED Ideas */}
                      {evaluation.status === 'REJECTED' ? (
                        <div className="space-y-3">
                          <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-500/50 rounded-lg space-y-3">
                            {/* Screening Analysis */}
                            {evaluation.analysis?.screening && (
                              <div className="space-y-2">
                                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-600">
                                  Lọc ý tưởng:
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {evaluation.analysis.screening}
                                </p>
                              </div>
                            )}

                            {/* Decision Message */}
                            {evaluation.decisionMessage && (
                              <div className="space-y-2">
                                <p className="text-sm font-medium">
                                  Quyết định:
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {evaluation.decisionMessage}
                                </p>
                              </div>
                            )}

                            {/* Action Suggestion */}
                            {evaluation.actionSuggestion && (
                              <div className="space-y-2">
                                <p className="text-sm font-medium">Gợi ý:</p>
                                <p className="text-sm text-muted-foreground">
                                  {evaluation.actionSuggestion}
                                </p>
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
                          {/* SELECTED / RESERVE Ideas - Full Analysis */}
                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold">
                              Đánh giá của AI:
                            </h4>

                            {/* Analysis Criteria */}
                            <div className="space-y-4">
                              {/* Screening */}
                              {evaluation.analysis?.screening && (
                                <div className="p-3 bg-muted/30 rounded-lg space-y-2">
                                  <div className="flex items-center gap-2">
                                    <h5 className="text-sm font-medium">
                                      1. Lọc ý tưởng
                                    </h5>
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
                                            Lọc ý tưởng
                                          </h4>
                                          <p className="text-sm text-muted-foreground">
                                            Loại bỏ các ý tưởng sai về khoa học,
                                            có độ tin cậy thấp (dựa vào may
                                            rủi), hoặc không khả thi với người
                                            dùng phổ thông.
                                          </p>
                                        </div>
                                      </PopoverContent>
                                    </Popover>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {evaluation.analysis.screening}
                                  </p>
                                </div>
                              )}

                              {/* Resources and Inertia */}
                              {evaluation.analysis?.resourcesAndInertia && (
                                <div className="p-3 bg-muted/30 rounded-lg space-y-2">
                                  <div className="flex items-center gap-2">
                                    <h5 className="text-sm font-medium">
                                      2. Tài nguyên & Quán tính hệ thống
                                    </h5>
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
                                            Tài nguyên & Quán tính
                                          </h4>
                                          <p className="text-sm text-muted-foreground">
                                            Ưu tiên sử dụng tài nguyên sẵn có
                                            (đặc biệt tài nguyên &quot;miễn
                                            phí&quot; như không khí, trọng lực,
                                            hình dạng). Giảm thiểu thay đổi hệ
                                            thống.
                                          </p>
                                        </div>
                                      </PopoverContent>
                                    </Popover>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {evaluation.analysis.resourcesAndInertia}
                                  </p>
                                </div>
                              )}

                              {/* Overall Benefit */}
                              {evaluation.analysis?.overallBenefit && (
                                <div className="p-3 bg-muted/30 rounded-lg space-y-2">
                                  <div className="flex items-center gap-2">
                                    <h5 className="text-sm font-medium">
                                      3. Lợi ích tổng thể (9-Screens)
                                    </h5>
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
                                            Lợi ích tổng thể
                                          </h4>
                                          <p className="text-sm text-muted-foreground">
                                            Đánh giá theo phương pháp 9-Screens:
                                            lợi ích cho các hệ thống liên quan
                                            và môi trường, không tạo mâu thuẫn
                                            mới.
                                          </p>
                                        </div>
                                      </PopoverContent>
                                    </Popover>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {evaluation.analysis.overallBenefit}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Decision Message */}
                            {evaluation.decisionMessage && (
                              <div className="p-3 bg-primary/10 rounded-lg space-y-2">
                                <p className="text-sm font-medium">
                                  Quyết định:
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {evaluation.decisionMessage}
                                </p>
                              </div>
                            )}

                            {/* Action Suggestion */}
                            {evaluation.actionSuggestion && (
                              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg space-y-2">
                                <p className="text-sm font-medium">
                                  Gợi ý hành động:
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {evaluation.actionSuggestion}
                                </p>
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
