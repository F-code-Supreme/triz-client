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
          goal: stepData.step2.goal,
        },
        step3Analysis: {
          systemIdentified: stepData.step3.systemIdentified,
          elements: stepData.step3.elements,
          objectType: stepData.step3.objectType,
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
              aiComment: evaluation.decisionMessage || '',
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
                    Mục tiêu:
                  </p>
                  <div className="text-sm font-semibold text-primary">
                    {stepData.step2.goal}
                  </div>
                </div>
                {stepData.step2.constraints &&
                  stepData.step2.constraints.length > 0 && (
                    <div className="space-y-2 pt-2 border-t">
                      <p className="text-xs font-medium text-muted-foreground">
                        Ràng buộc:
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        {stepData.step2.constraints.map((constraint, index) => (
                          <li key={index} className="text-sm">
                            {constraint}
                          </li>
                        ))}
                      </ul>
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
                                {tc.mk1.contradictionStatement}
                              </p>
                              <div className="flex gap-4 text-xs mt-2">
                                <span className="text-green-600">
                                  ↑ #{tc.mk1.improvingParameter.number}{' '}
                                  {tc.mk1.improvingParameter.name}
                                </span>
                                <span className="text-red-600">
                                  ↓ #{tc.mk1.worseningParameter.number}{' '}
                                  {tc.mk1.worseningParameter.name}
                                </span>
                              </div>
                            </div>

                            {/* MK2 */}
                            <div className="space-y-1 pt-2 border-t">
                              <p className="text-xs font-medium">MK2:</p>
                              <p className="text-sm">
                                {tc.mk2.contradictionStatement}
                              </p>
                              <div className="flex gap-4 text-xs mt-2">
                                <span className="text-green-600">
                                  ↑ #{tc.mk2.improvingParameter.number}{' '}
                                  {tc.mk2.improvingParameter.name}
                                </span>
                                <span className="text-red-600">
                                  ↓ #{tc.mk2.worseningParameter.number}{' '}
                                  {tc.mk2.worseningParameter.name}
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
                  const isRejected = evaluation.status === 'REJECTED';
                  const isSelected = evaluation.status === 'SELECTED';

                  return (
                    <div
                      key={evaluation.ideaId}
                      className={`p-3 rounded-lg ${
                        isRejected
                          ? 'bg-red-50/50 dark:bg-red-950/20 border border-red-500/50'
                          : isSelected
                            ? 'bg-green-50/50 dark:bg-green-950/20 border border-green-500/50'
                            : 'bg-yellow-50/50 dark:bg-yellow-950/20 border border-yellow-500/50'
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
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-500 border border-red-500/50'
                                : isSelected
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-500 border border-green-500/50'
                                  : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 border border-yellow-500/50'
                            }`}
                          >
                            {isRejected
                              ? 'Loại bỏ'
                              : isSelected
                                ? 'Được chọn'
                                : 'Dự phòng'}
                          </span>
                        </div>
                        {idea && (
                          <p className="text-sm">{idea.ideaStatement}</p>
                        )}

                        {/* Show analysis for all evaluated ideas */}
                        {evaluation.analysis && (
                          <div className="pt-2 border-t space-y-3">
                            {/* Screening */}
                            {evaluation.analysis.screening && (
                              <div>
                                <p className="text-xs font-medium mb-1">
                                  Lọc ý tưởng:
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {evaluation.analysis.screening}
                                </p>
                              </div>
                            )}

                            {/* Resources and Inertia - only for non-rejected */}
                            {!isRejected &&
                              evaluation.analysis.resourcesAndInertia && (
                                <div>
                                  <p className="text-xs font-medium mb-1">
                                    Tài nguyên & Quán tính:
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {evaluation.analysis.resourcesAndInertia}
                                  </p>
                                </div>
                              )}

                            {/* Overall Benefit - only for non-rejected */}
                            {!isRejected &&
                              evaluation.analysis.overallBenefit && (
                                <div>
                                  <p className="text-xs font-medium mb-1">
                                    Lợi ích tổng thể:
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {evaluation.analysis.overallBenefit}
                                  </p>
                                </div>
                              )}
                          </div>
                        )}

                        {/* Decision Message */}
                        {evaluation.decisionMessage && (
                          <div className="pt-2 border-t">
                            <p className="text-xs font-medium mb-1">
                              Quyết định:
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {evaluation.decisionMessage}
                            </p>
                          </div>
                        )}

                        {/* Action Suggestion */}
                        {evaluation.actionSuggestion && (
                          <div className="pt-2 border-t">
                            <p className="text-xs font-medium mb-1">
                              Gợi ý hành động:
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {evaluation.actionSuggestion}
                            </p>
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
