import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface Step5Props {
  onNext: (data: Record<string, unknown>) => void;
  onBack: () => void;
  initialData?: Record<string, unknown>;
}

export const Step5GenerateIdeas = ({
  onNext,
  onBack,
  initialData,
}: Step5Props) => {
  const [ideas, setIdeas] = useState(
    (initialData?.ideas as string | undefined) || '',
  );

  const handleNext = () => {
    if (ideas.trim()) {
      onNext({ ideas });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Bước 5: PHÁT CÁC Ý TƯỞNG GIẢI QUYẾT ML
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Liệt kê các ý tưởng giải quyết mâu thuẫn
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-sm">Hướng dẫn:</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>
                Khi phát các ý tưởng cần phải ghi lại ngay, tuyệt đối không phê
                phán, chỉ trích
              </li>
              <li>Sử dụng các công cụ đã học để phát ý tưởng</li>
              <li>
                Chỉ khi thấy đã phát hết các ý tưởng có thể có mới chuyển sang
                giai đoạn sau
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <label htmlFor="ideas" className="text-sm font-medium">
              Các ý tưởng <span className="text-destructive">*</span>
            </label>
            <Textarea
              id="ideas"
              placeholder="Liệt kê các ý tưởng..."
              value={ideas}
              onChange={(e) => setIdeas(e.target.value)}
              className="min-h-[200px] resize-none"
            />
          </div>

          <div className="flex justify-between gap-3">
            <Button onClick={onBack} variant="outline" size="lg">
              Quay lại
            </Button>
            <Button onClick={handleNext} disabled={!ideas.trim()} size="lg">
              Tiếp theo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
