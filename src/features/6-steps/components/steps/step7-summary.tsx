import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Step7Props {
  onBack: () => void;
  stepData?: {
    step1?: { understanding: string };
    step2?: { objective: string };
    step3?: { questions: string };
    step4?: { contradiction: string };
    step5?: { ideas: string };
    step6?: { decision: string };
  };
}

export const Step7Summary = ({ onBack, stepData }: Step7Props) => {
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
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm whitespace-pre-wrap">
                  {stepData.step1.understanding}
                </p>
              </div>
            </div>
          )}

          {/* Step 2 Summary */}
          {stepData?.step2 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">
                Bước 2: Đề ra mục đích cần đạt
              </h3>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm whitespace-pre-wrap">
                  {stepData.step2.objective}
                </p>
              </div>
            </div>
          )}

          {/* Step 3 Summary */}
          {stepData?.step3 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">
                Bước 3: Trả lời các câu hỏi
              </h3>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm whitespace-pre-wrap">
                  {stepData.step3.questions}
                </p>
              </div>
            </div>
          )}

          {/* Step 4 Summary */}
          {stepData?.step4 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">
                Bước 4: Phát biểu mâu thuẫn
              </h3>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm whitespace-pre-wrap">
                  {stepData.step4.contradiction}
                </p>
              </div>
            </div>
          )}

          {/* Step 5 Summary */}
          {stepData?.step5 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">
                Bước 5: Phát các ý tưởng giải quyết ML
              </h3>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm whitespace-pre-wrap">
                  {stepData.step5.ideas}
                </p>
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
