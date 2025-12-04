import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSixStepDataStore } from '@/features/6-steps/store/useSixStepDataStore';

export interface Step7Props {
  onBack: () => void;
}

export const Step7Summary = ({ onBack }: Step7Props) => {
  const { stepData } = useSixStepDataStore();
  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
                    Mâu thuẫn Lý học (ML):
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
                            <p className="text-xs font-semibold text-primary">
                              {tc.element}
                            </p>

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
                {stepData.step5.ideas.map((idea, index) => (
                  <div key={idea.id} className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-semibold text-primary mt-0.5">
                        #{index + 1}
                      </span>
                      <div className="flex-1 space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">
                          Nguyên tắc #{idea.principleUsed.id}:{' '}
                          {idea.principleUsed.name} (Độ ưu tiên:{' '}
                          {idea.principleUsed.priority})
                        </p>
                        <p className="text-sm">{idea.ideaStatement}</p>
                        {idea.howItAddresses && (
                          <p className="text-xs text-muted-foreground italic">
                            {idea.howItAddresses}
                          </p>
                        )}
                      </div>
                    </div>
                    {index < (stepData.step5?.ideas.length ?? 0) - 1 && (
                      <div className="border-t" />
                    )}
                  </div>
                ))}
                {stepData.step5.ideas.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Chưa có ý tưởng nào được tạo.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 6 Summary */}
          {stepData?.step6 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Bước 6: Ra quyết định</h3>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm whitespace-pre-wrap">
                  {stepData.step6.decision}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between gap-3">
            <Button onClick={onBack} variant="outline" size="lg">
              Quay lại
            </Button>
            <Button size="lg">Hoàn thành</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
