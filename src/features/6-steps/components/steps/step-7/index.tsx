import { useNavigate } from '@tanstack/react-router';
import { Star } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateSixStepJournalMutation } from '@/features/6-steps/services/mutations';
import { useSixStepDataStore } from '@/features/6-steps/store/useSixStepDataStore';

export interface Step7Props {
  onBack: () => void;
}

export const Step7Summary = ({ onBack }: Step7Props) => {
  const navigate = useNavigate();
  const { stepData, resetWorkflow } = useSixStepDataStore();

  const createJournalMutation = useCreateSixStepJournalMutation();

  const handleFinish = async () => {
    if (
      !stepData.step1 ||
      !stepData.step2 ||
      !stepData.step3 ||
      !stepData.step4 ||
      !stepData.step5 ||
      !stepData.step6
    ) {
      toast.error('Vui lòng hoàn thành tất cả các bước trước khi lưu');
      return;
    }

    try {
      // Prepare the payload according to ICreateSixStepJournalPayload
      const payload = {
        step1Understand: {
          rawProblem: stepData.step1.understanding,
          selectedMiniProblem: stepData.step1.selectedMiniProblem,
        },
        step2Objectives: {
          goal: stepData.step2.selectedGoal?.text || '',
        },
        step3Analysis: {
          systemIdentified: stepData.step3.systemIdentified,
          elements: stepData.step3.elements,
          requiredStates: Object.entries(stepData.step3.requiredStates).reduce(
            (acc, [key, states]) => {
              acc[key] = states.map((state) => state.text);
              return acc;
            },
            {} as Record<string, string[]>,
          ),
        },
        step4Contradiction: {
          physicalContradictions: stepData.step4.physicalContradictions,
        },
        step5Ideas: {
          selectedIdeas:
            stepData.step5.selectedIdeas?.map((idea) => ({
              id: idea.id,
              element: idea.element,
              sourceType: 'TRIZ_Principle' as const,
              principleUsed: {
                id: idea.principleUsed.id,
                name: idea.principleUsed.name,
                priority: idea.principleUsed.priority,
                subPoint: idea.principleUsed.subPoint || '',
              },
              ideaStatement: idea.ideaStatement,
              howItAddresses: idea.howItAddresses,
              abstractionLevel: 'concept' as const,
            })) || [],
        },
        step6Decision: {
          evaluatedIdeas: stepData.step6.evaluations.map((evaluation) => {
            const idea = stepData.step5?.selectedIdeas?.find(
              (i) => i.id === evaluation.ideaId,
            );
            return {
              ideaId: evaluation.ideaId,
              ideaStatement: idea?.ideaStatement || '',
              aiComment: evaluation.message || '',
              userComment: evaluation.userComment || '',
              userRating: evaluation.userRating || 0,
            };
          }),
        },
      };

      const result = await createJournalMutation.mutateAsync(payload);

      toast.success('Lưu nhật ký thành công!');

      // Reset the workflow
      resetWorkflow();

      // Navigate to the journal detail page
      navigate({
        to: '/journals/$journalId',
        params: { journalId: result.id },
      });
    } catch (error) {
      console.error('Failed to create journal:', error);
      toast.error('Có lỗi xảy ra khi lưu nhật ký. Vui lòng thử lại.');
    }
  };
  return (
    <div className="max-w-4xl xl:max-w-5xl 2xl:max-w-7xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Tóm tắt</CardTitle>
          <p className="text-muted-foreground mt-2">
            Tổng hợp toàn bộ quá trình giải quyết vấn đề 6 bước
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1 Summary */}
          {stepData?.step1 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Bước 1: Hiểu bài toán</h3>
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Vấn đề ban đầu:
                  </p>
                  <p className="text-sm whitespace-pre-wrap">
                    {stepData.step1.understanding}
                  </p>
                </div>
                {stepData.step1.selectedMiniProblem && (
                  <div className="space-y-2 pt-2 border-t">
                    <p className="text-xs font-medium text-muted-foreground">
                      Vấn đề nhỏ đã chọn:
                    </p>
                    <div className="text-sm font-semibold text-primary">
                      {stepData.step1.selectedMiniProblem}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2 Summary */}
          {stepData?.step2 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">
                Bước 2: Đề ra mục đích cần đạt
              </h3>
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Tất cả mục tiêu:
                  </p>
                  {stepData.step2.goals.map((goal, index) => (
                    <div key={goal.id} className="text-sm">
                      {index + 1}. {goal.text}
                    </div>
                  ))}
                </div>
                {stepData.step2.selectedGoal && (
                  <div className="space-y-2 pt-2 border-t">
                    <p className="text-xs font-medium text-muted-foreground">
                      Mục tiêu đã chọn:
                    </p>
                    <div className="text-sm font-semibold text-primary">
                      {stepData.step2.selectedGoal.text}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3 Summary */}
          {stepData?.step3 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">
                Bước 3: Trả lời các câu hỏi
              </h3>
              <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Hệ thống xác định:
                  </p>
                  <p className="text-sm font-semibold">
                    {stepData.step3.systemIdentified}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Các yếu tố:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {stepData.step3.elements.map((element) => (
                      <span
                        key={element}
                        className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium"
                      >
                        {element}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    Trạng thái yêu cầu:
                  </p>
                  {Object.entries(stepData.step3.requiredStates).map(
                    ([element, states]) => (
                      <div key={element} className="space-y-1">
                        <p className="text-xs font-semibold text-primary">
                          {element}:
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          {states.map((state) => (
                            <li key={state.id} className="text-sm">
                              {state.text}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4 Summary */}
          {stepData?.step4 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">
                Bước 4: Phát biểu mâu thuẫn
              </h3>
              <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                {/* Physical Contradictions */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Mâu thuẫn Vật lý (ML):
                  </p>
                  {stepData.step4.physicalContradictions.map((pc, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        stepData.step4?.selectedPhysicalContradictionIndex ===
                        index
                          ? 'bg-primary/10 border border-primary'
                          : 'bg-background'
                      }`}
                    >
                      <p className="text-xs font-semibold text-primary mb-1">
                        {pc.element}
                      </p>
                      <p className="text-sm">{pc.contradictionStatement}</p>
                    </div>
                  ))}
                </div>

                {/* Technical Contradictions */}
                {stepData.step4.technicalContradictions &&
                  stepData.step4.technicalContradictions.length > 0 && (
                    <div className="space-y-2 pt-2 border-t">
                      <p className="text-xs font-medium text-muted-foreground">
                        Mâu thuẫn Kỹ thuật (MK):
                      </p>
                      {stepData.step4.technicalContradictions.map(
                        (tc, index) => (
                          <div
                            key={index}
                            className="space-y-3 p-3 bg-background rounded-lg"
                          >
                            {/* MK1 */}
                            <div className="space-y-1">
                              <p className="text-xs font-medium">MK1:</p>
                              <p className="text-sm">
                                {tc.MK1.contradictionStatement}
                              </p>
                              <div className="flex gap-4 text-xs mt-2">
                                <span className="text-green-600">
                                  ↑ #{tc.MK1.improvingParameter.number}{' '}
                                  {tc.MK1.improvingParameter.name}
                                </span>
                                <span className="text-red-600">
                                  ↓ #{tc.MK1.worseningParameter.number}{' '}
                                  {tc.MK1.worseningParameter.name}
                                </span>
                              </div>
                            </div>

                            {/* MK2 */}
                            <div className="space-y-1 pt-2 border-t">
                              <p className="text-xs font-medium">MK2:</p>
                              <p className="text-sm">
                                {tc.MK2.contradictionStatement}
                              </p>
                              <div className="flex gap-4 text-xs mt-2">
                                <span className="text-green-600">
                                  ↑ #{tc.MK2.improvingParameter.number}{' '}
                                  {tc.MK2.improvingParameter.name}
                                </span>
                                <span className="text-red-600">
                                  ↓ #{tc.MK2.worseningParameter.number}{' '}
                                  {tc.MK2.worseningParameter.name}
                                </span>
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  )}

                {/* Selected Principles (if any) */}
                {stepData.step4.selectedPrinciples &&
                  stepData.step4.selectedPrinciples.length > 0 && (
                    <div className="space-y-2 pt-2 border-t">
                      <p className="text-xs font-medium text-muted-foreground">
                        Nguyên lý được đề xuất:
                      </p>
                      <div className="grid gap-2">
                        {stepData.step4.selectedPrinciples.map((principle) => (
                          <div
                            key={principle.id}
                            className="p-3 bg-background rounded-lg"
                          >
                            <p className="text-xs font-semibold text-primary mb-1">
                              #{principle.id} {principle.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {principle.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* Step 5 Summary */}
          {stepData?.step5 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">
                Bước 5: Phát các ý tưởng giải quyết ML
              </h3>
              <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                {stepData.step5.selectedIdeas &&
                stepData.step5.selectedIdeas.length > 0 ? (
                  <>
                    <p className="text-xs font-medium text-muted-foreground">
                      3 ý tưởng được chọn để đánh giá:
                    </p>
                    {stepData.step5.selectedIdeas.map((idea, index) => (
                      <div key={idea.id} className="space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-semibold text-primary mt-0.5">
                            #{index + 1}
                          </span>
                          <div className="flex-1 space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">
                              Nguyên tắc #{idea.principleUsed.id}:{' '}
                              {idea.principleUsed.name}
                            </p>
                            <p className="text-sm">{idea.ideaStatement}</p>
                            {idea.howItAddresses && (
                              <p className="text-xs text-muted-foreground italic">
                                {idea.howItAddresses}
                              </p>
                            )}
                          </div>
                        </div>
                        {index <
                          (stepData.step5?.selectedIdeas?.length ?? 0) - 1 && (
                          <div className="border-t" />
                        )}
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Chưa chọn ý tưởng nào.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 6 Summary */}
          {stepData?.step6 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Bước 6: Ra quyết định</h3>
              <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                {stepData.step6.evaluations.map((evaluation) => {
                  const idea = stepData.step5?.selectedIdeas?.find(
                    (i) => i.id === evaluation.ideaId,
                  );
                  const isRejected =
                    evaluation.status === 'rejected' || !evaluation.evaluation;

                  return (
                    <div
                      key={evaluation.ideaId}
                      className={`p-3 rounded-lg ${
                        isRejected
                          ? 'bg-yellow-50/50 dark:bg-yellow-950/20 border border-yellow-500/50'
                          : 'bg-primary/10 border border-primary'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-primary">
                            Ý tưởng #{evaluation.ideaId}
                          </p>
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded ${
                              isRejected
                                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 border border-yellow-500/50'
                                : 'bg-primary/20 text-primary'
                            }`}
                          >
                            {isRejected ? 'Không khả thi' : 'Đạt'}
                          </span>
                        </div>
                        {idea && (
                          <p className="text-sm">{idea.ideaStatement}</p>
                        )}

                        {/* Show scores only for passing ideas */}
                        {!isRejected && evaluation.evaluation && (
                          <>
                            <div className="grid grid-cols-4 gap-2 pt-2 border-t">
                              <div className="text-center">
                                <p className="text-xs text-muted-foreground">
                                  ML
                                </p>
                                <p className="text-sm font-semibold">
                                  {evaluation.evaluation.scores.mlResolution}
                                  /10
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-muted-foreground">
                                  Khả thi
                                </p>
                                <p className="text-sm font-semibold">
                                  {evaluation.evaluation.scores.feasibility}/10
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-muted-foreground">
                                  Tác động
                                </p>
                                <p className="text-sm font-semibold">
                                  {evaluation.evaluation.scores.systemImpact}
                                  /10
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-muted-foreground">
                                  Tổng
                                </p>
                                <p className="text-sm font-bold text-primary">
                                  {evaluation.evaluation.scores.total}/30
                                </p>
                              </div>
                            </div>
                            <div className="pt-2 border-t space-y-2">
                              <div>
                                <p className="text-xs font-medium mb-1">
                                  Đánh giá AI:{' '}
                                  <span className="capitalize">
                                    {evaluation.evaluation.category ===
                                    'excellent'
                                      ? 'Xuất sắc'
                                      : evaluation.evaluation.category ===
                                          'good'
                                        ? 'Tốt'
                                        : evaluation.evaluation.category ===
                                            'average'
                                          ? 'Trung bình'
                                          : 'Kém'}
                                  </span>
                                </p>
                                {evaluation.message && (
                                  <p className="text-xs text-muted-foreground">
                                    {evaluation.message}
                                  </p>
                                )}
                              </div>
                            </div>
                          </>
                        )}

                        {/* Show rejection info for rejected ideas */}
                        {isRejected && (
                          <div className="pt-2 border-t space-y-2">
                            {evaluation.rejectionReason && (
                              <div>
                                <p className="text-xs font-medium text-yellow-800 dark:text-yellow-600 mb-1">
                                  Lý do:
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {evaluation.rejectionReason}
                                </p>
                              </div>
                            )}
                            {evaluation.suggestion && (
                              <div>
                                <p className="text-xs font-medium mb-1">
                                  Gợi ý:
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {evaluation.suggestion}
                                </p>
                              </div>
                            )}
                            {evaluation.message && (
                              <p className="text-xs text-muted-foreground">
                                {evaluation.message}
                              </p>
                            )}
                          </div>
                        )}

                        {/* User feedback */}
                        {(evaluation.userRating || evaluation.userComment) && (
                          <div className="pt-2 border-t">
                            <p className="text-xs font-medium mb-1">
                              Đánh giá của bạn:
                            </p>
                            {evaluation.userRating && (
                              <div className="flex items-center gap-1 mb-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < evaluation.userRating!
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                                <span className="text-xs text-muted-foreground ml-1">
                                  ({evaluation.userRating}/5)
                                </span>
                              </div>
                            )}
                            {evaluation.userComment && (
                              <p className="text-xs text-muted-foreground italic">
                                &ldquo;{evaluation.userComment}&rdquo;
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                {stepData.step6.evaluations.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Chưa có đánh giá nào.
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between gap-3">
            <Button
              onClick={onBack}
              variant="outline"
              size="lg"
              disabled={createJournalMutation.isPending}
            >
              Quay lại
            </Button>
            <Button
              onClick={handleFinish}
              size="lg"
              disabled={createJournalMutation.isPending}
            >
              {createJournalMutation.isPending ? 'Đang lưu...' : 'Hoàn thành'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
