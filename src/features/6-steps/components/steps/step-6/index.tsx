import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface Step6Props {
  onNext: (data: Record<string, unknown>) => void;
  onBack: () => void;
  initialData?: Record<string, unknown>;
}

export const Step6MakeDecision = ({
  onNext,
  onBack,
  initialData,
}: Step6Props) => {
  const [decision, setDecision] = useState(
    (initialData?.decision as string | undefined) || '',
  );

  const handleNext = () => {
    if (decision.trim()) {
      onNext({ decision });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Bước 6: RA QUYẾT ĐỊNH</CardTitle>
          <p className="text-muted-foreground mt-2">
            Đánh giá và chọn giải pháp tối ưu
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-sm">Hướng dẫn:</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Loại bỏ các ý tưởng không khả thi</li>
              <li>
                Phân tích, đánh giá và sắp xếp các ý tưởng khả thi theo thứ tự
                ưu tiên
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <label htmlFor="decision" className="text-sm font-medium">
              Quyết định giải pháp <span className="text-destructive">*</span>
            </label>
            <Textarea
              id="decision"
              placeholder="Quyết định giải pháp..."
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
              className="min-h-[200px] resize-none"
            />
          </div>

          <div className="flex justify-between gap-3">
            <Button onClick={onBack} variant="outline" size="lg">
              Quay lại
            </Button>
            <Button onClick={handleNext} disabled={!decision.trim()} size="lg">
              Xem tóm tắt
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
