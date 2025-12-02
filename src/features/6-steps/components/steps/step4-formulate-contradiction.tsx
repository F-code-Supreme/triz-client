import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface Step4Props {
  onNext: (data: Record<string, unknown>) => void;
  onBack: () => void;
  initialData?: Record<string, unknown>;
}

export const Step4FormulateContradiction = ({
  onNext,
  onBack,
  initialData,
}: Step4Props) => {
  const [contradiction, setContradiction] = useState(
    (initialData?.contradiction as string | undefined) || '',
  );

  const handleNext = () => {
    if (contradiction.trim()) {
      onNext({ contradiction });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Bước 4: PHÁT BIỂU ML</CardTitle>
          <p className="text-muted-foreground mt-2">
            Phát biểu mâu thuẫn trong bài toán
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-sm">Hướng dẫn:</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>
                Yếu tố phải có (Đ) để thực hiện công việc có ích này và phải có
                (-Đ) để thực hiện công việc có ích kia
              </li>
              <li>Ở giai đoạn này có thể thu được không phải một mà vài ML</li>
            </ul>
          </div>

          <div className="space-y-2">
            <label htmlFor="contradiction" className="text-sm font-medium">
              Phát biểu mâu thuẫn <span className="text-destructive">*</span>
            </label>
            <Textarea
              id="contradiction"
              placeholder="Phát biểu mâu thuẫn..."
              value={contradiction}
              onChange={(e) => setContradiction(e.target.value)}
              className="min-h-[200px] resize-none"
            />
          </div>

          <div className="flex justify-between gap-3">
            <Button onClick={onBack} variant="outline" size="lg">
              Quay lại
            </Button>
            <Button
              onClick={handleNext}
              disabled={!contradiction.trim()}
              size="lg"
            >
              Tiếp theo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
