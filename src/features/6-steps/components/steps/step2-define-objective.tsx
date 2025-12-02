import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface Step2Props {
  onNext: (data: { objective: string }) => void;
  onBack: () => void;
  initialData?: { objective: string };
}

export const Step2DefineObjective = ({
  onNext,
  onBack,
  initialData,
}: Step2Props) => {
  const [objective, setObjective] = useState(initialData?.objective || '');

  const handleNext = () => {
    if (objective.trim()) {
      onNext({ objective });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Bước 2: ĐỀ RA MỤC ĐÍCH CẦN ĐẠT
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Xác định mục đích thực sự cần đạt được
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-sm">Hướng dẫn:</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Dựa trên việc hiểu BT và khuynh hướng phát triển</li>
              <li>
                Đề ra mục đích thực sự cần đạt mà không nghĩ đến cách thực hiện
                mục đích
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <label htmlFor="objective" className="text-sm font-medium">
              Mục đích cần đạt <span className="text-destructive">*</span>
            </label>
            <Textarea
              id="objective"
              placeholder="Mô tả mục đích bạn muốn đạt được..."
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="min-h-[200px] resize-none"
            />
          </div>

          <div className="flex justify-between gap-3">
            <Button onClick={onBack} variant="outline" size="lg">
              Quay lại
            </Button>
            <Button onClick={handleNext} disabled={!objective.trim()} size="lg">
              Tiếp theo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
