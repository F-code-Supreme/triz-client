import { useState } from 'react';

import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from '@/components/ui/shadcn-io/ai/prompt-input';

interface Step1Props {
  onNext: (data: { understanding: string }) => void;
  initialData?: { understanding: string };
}

export const Step1UnderstandProblem = ({ onNext, initialData }: Step1Props) => {
  const [understanding, setUnderstanding] = useState(
    initialData?.understanding || '',
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (understanding.trim()) {
      onNext({ understanding });
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col gap-8 mt-24">
      <div className="self-stretch inline-flex flex-col justify-start items-center gap-4">
        <div className="self-stretch text-center justify-start">
          <div className="text-secondary text-4xl font-bold leading-[48px] tracking-tight">
            Vấn đề bạn muốn giải quyết là gì?
          </div>
          <span className="text-4xl font-bold leading-[48px] tracking-tight">
            Cùng Al phân tích nguyên nhân trước khi chọn giải pháp
          </span>
        </div>
        <div className="text-center justify-start text-slate-600 text-base font-normal leading-6">
          Viết ra bất kỳ vấn đề nào bạn đang gặp - càng tự nhiên càng tốt.
        </div>
      </div>
      <PromptInput onSubmit={handleSubmit}>
        <PromptInputTextarea
          value={understanding}
          onChange={(e) => setUnderstanding(e.target.value)}
          placeholder="Viết vấn đề bạn muốn phân tích nguyên nhân…"
          minHeight={120}
        />
        <PromptInputToolbar>
          <div className="flex-1" />
          <PromptInputSubmit disabled={!understanding.trim()} />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
};
