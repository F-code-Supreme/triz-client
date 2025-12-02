import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface Step3Props {
  onNext: (data: { questions: string }) => void;
  onBack: () => void;
  initialData?: { questions: string };
}

export const Step3AnswerQuestions = ({
  onNext,
  onBack,
  initialData,
}: Step3Props) => {
  const [questions, setQuestions] = useState(initialData?.questions || '');

  const handleNext = () => {
    if (questions.trim()) {
      onNext({ questions });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Bước 3: TRẢ LỜI CÁC CÂU HỎI
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Trả lời các câu hỏi về bài toán
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-sm">Hướng dẫn:</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Xác định các yếu tố cần chú ý</li>
              <li>
                Các yếu tố đó của hệ thống có trong BT phải có tính chất gì? ở
                trạng thái nào?
              </li>
              <li>Xem xét lần lượt từng yếu tố</li>
            </ul>
          </div>

          <div className="space-y-2">
            <label htmlFor="questions" className="text-sm font-medium">
              Trả lời các câu hỏi <span className="text-destructive">*</span>
            </label>
            <Textarea
              id="questions"
              placeholder="Trả lời các câu hỏi..."
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              className="min-h-[200px] resize-none"
            />
          </div>

          <div className="flex justify-between gap-3">
            <Button onClick={onBack} variant="outline" size="lg">
              Quay lại
            </Button>
            <Button onClick={handleNext} disabled={!questions.trim()} size="lg">
              Tiếp theo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
