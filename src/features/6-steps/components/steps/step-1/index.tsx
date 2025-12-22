import { Plus, Info } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from '@/components/ui/shadcn-io/ai/prompt-input';
import { useStep1SuggestionMutation } from '@/features/6-steps/services/mutations';
import { useSixStepDataStore } from '@/features/6-steps/store/useSixStepDataStore';

import ActionButtons from '../../action-buttons';
import { SelectableItem } from '../../selectable-item';
import { SelectableItemSkeletonList } from '../../selectable-item-skeleton-list';

import type {
  MiniProblem,
  SixStepData,
} from '@/features/6-steps/store/useSixStepDataStore';

interface Step1Props {
  onNext: (data: SixStepData['step1']) => void;
}

export const Step1UnderstandProblem = ({ onNext }: Step1Props) => {
  const { stepData } = useSixStepDataStore();
  const initialData = stepData.step1;

  const [understanding, setUnderstanding] = useState(
    initialData?.understanding || '',
  );
  const [understandingSummary, setUnderstandingSummary] = useState(
    initialData?.understandingSummary || '',
  );
  const [systemContext, setSystemContext] = useState<{
    mainObject: string;
    environment: string;
  }>(initialData?.systemContext || { mainObject: '', environment: '' });
  const [psychologicalInertia, setPsychologicalInertia] = useState<string[]>(
    initialData?.psychologicalInertia || [],
  );
  const [clarificationNeeded, setClarificationNeeded] = useState<
    string[] | null
  >(initialData?.clarificationNeeded || null);
  const [miniProblems, setMiniProblems] = useState<MiniProblem[]>(
    initialData?.miniProblems || [],
  );
  const [selectedMiniProblemId, setSelectedMiniProblemId] = useState<
    string | null
  >(null);
  const [isAddingMiniProblem, setIsAddingMiniProblem] = useState(false);
  const [newMiniProblemText, setNewMiniProblemText] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(
    !!initialData?.miniProblems && initialData.miniProblems.length > 0,
  );

  const step1Mutation = useStep1SuggestionMutation();

  // Update local state when store data changes
  useEffect(() => {
    if (initialData) {
      setUnderstanding(initialData.understanding || '');
      setUnderstandingSummary(initialData.understandingSummary || '');
      setSystemContext(
        initialData.systemContext || { mainObject: '', environment: '' },
      );
      setPsychologicalInertia(initialData.psychologicalInertia || []);
      setClarificationNeeded(initialData.clarificationNeeded || null);
      setMiniProblems(initialData.miniProblems || []);
      setHasSubmitted(
        !!initialData.miniProblems && initialData.miniProblems.length > 0,
      );
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (understanding.trim()) {
      setHasSubmitted(true);
      try {
        const response = await step1Mutation.mutateAsync({
          rawProblem: understanding,
        });

        // Store all response data
        setUnderstandingSummary(response.understandingSummary);
        setSystemContext(response.systemContext);
        setPsychologicalInertia(response.psychologicalInertia);
        setClarificationNeeded(response.clarificationNeeded);

        // Convert API response mini problems to our format
        const problems: MiniProblem[] = response.miniProblems.map(
          (problem, index) => ({
            id: `api-${index}`,
            text: problem,
          }),
        );

        setMiniProblems(problems);
      } catch (error) {
        console.error('Failed to get suggestions:', error);
        setHasSubmitted(false);
      }
    }
  };

  const handleAddMiniProblem = () => {
    if (!newMiniProblemText.trim()) {
      setIsAddingMiniProblem(false);
      return;
    }
    const newProblem: MiniProblem = {
      id: `custom-${Date.now()}`,
      text: newMiniProblemText.trim(),
    };
    setMiniProblems((prev) => [newProblem, ...prev]);
    setNewMiniProblemText('');
    setIsAddingMiniProblem(false);
    setSelectedMiniProblemId(newProblem.id);
  };

  const handleCancelAdd = () => {
    setNewMiniProblemText('');
    setIsAddingMiniProblem(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddMiniProblem();
    } else if (e.key === 'Escape') {
      handleCancelAdd();
    }
  };

  const handleEditMiniProblem = (id: string, newText: string) => {
    setMiniProblems((prevProblems) =>
      prevProblems.map((problem) =>
        problem.id === id ? { ...problem, text: newText } : problem,
      ),
    );
  };

  const handleNext = () => {
    if (selectedMiniProblemId) {
      const selectedProblem = miniProblems.find(
        (p) => p.id === selectedMiniProblemId,
      );
      if (selectedProblem) {
        onNext({
          understanding,
          understandingSummary,
          systemContext,
          psychologicalInertia,
          miniProblems,
          selectedMiniProblem: selectedProblem.text,
          clarificationNeeded,
        });
      }
    }
  };

  // Show initial prompt input
  if (!hasSubmitted) {
    return (
      <div className="max-w-4xl xl:max-w-5xl 2xl:max-w-7xl mx-auto h-full flex flex-col gap-8 mt-24">
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
            disabled={step1Mutation.isPending}
          />
          <PromptInputToolbar>
            <div className="flex-1" />
            <PromptInputSubmit
              disabled={!understanding.trim() || step1Mutation.isPending}
            />
          </PromptInputToolbar>
        </PromptInput>
        {step1Mutation.isPending && (
          <div className="text-center text-muted-foreground">
            Đang phân tích vấn đề...
          </div>
        )}
      </div>
    );
  }

  // Show mini problems selection
  return (
    <div className="max-w-4xl xl:max-w-5xl 2xl:max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex-1 flex flex-col gap-4">
        <div className="self-stretch text-center justify-start items-center gap-2 inline-flex">
          <div className="text-4xl font-bold leading-[48px] tracking-tight">
            Chọn bài toán mini để phân tích
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Info className="h-5 w-5 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 max-h-96 overflow-y-auto">
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Thông tin bổ sung</h4>

                {understandingSummary && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Tóm tắt hiểu vấn đề:
                    </p>
                    <p className="text-sm">{understandingSummary}</p>
                  </div>
                )}

                {systemContext.mainObject && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Đối tượng chính:
                    </p>
                    <p className="text-sm">{systemContext.mainObject}</p>
                  </div>
                )}

                {systemContext.environment && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Môi trường:
                    </p>
                    <p className="text-sm">{systemContext.environment}</p>
                  </div>
                )}

                {psychologicalInertia.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Quán tính tâm lý:
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      {psychologicalInertia.map((item, idx) => (
                        <li key={idx} className="text-sm">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {clarificationNeeded && clarificationNeeded.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Cần làm rõ:
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      {clarificationNeeded.map((item, idx) => (
                        <li key={idx} className="text-sm">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="self-stretch px-6 py-5 bg-blue-50 dark:bg-blue-950 rounded-lg outline outline-1 outline-offset-[-1px] outline-blue-600 inline-flex justify-center items-center gap-2 mx-auto">
          <div className="justify-start text-blue-800 dark:text-blue-200 text-base font-bold leading-6">
            Vấn đề ban đầu: {understanding}
          </div>
        </div>

        <div className="self-stretch justify-start text-sm font-semibold leading-6 text-slate-600 ">
          Chọn 1 trong các bài toán mini sau:
        </div>

        <ScrollArea className="h-[45vh] pr-4">
          <div className="flex flex-col gap-3">
            {step1Mutation.isPending ? (
              <SelectableItemSkeletonList count={5} />
            ) : (
              miniProblems.map((problem) => (
                <SelectableItem
                  key={problem.id}
                  id={problem.id}
                  text={problem.text}
                  isSelected={selectedMiniProblemId === problem.id}
                  isEditable={true}
                  onEdit={handleEditMiniProblem}
                  onSelect={(id) => setSelectedMiniProblemId(id)}
                />
              ))
            )}
          </div>
        </ScrollArea>

        {/* Add more mini problems */}
        <div>
          {isAddingMiniProblem ? (
            <div className="w-full pl-3.5 pr-3 py-4 rounded-lg bg-secondary-foreground outline outline-1 outline-offset-[-1px] outline-primary flex items-center gap-3">
              <input
                type="text"
                value={newMiniProblemText}
                onChange={(e) => setNewMiniProblemText(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleAddMiniProblem}
                placeholder="Nhập bài toán mini của bạn..."
                className="flex-1 text-primary dark:text-foreground text-sm font-normal leading-5 bg-transparent outline-none"
                autoFocus
              />
            </div>
          ) : (
            <Button
              variant="ghost"
              onClick={() => setIsAddingMiniProblem(true)}
              className="rounded-lg pl-1 pr-1"
            >
              <Plus className="w-4 h-4 text-secondary" />
              <span className="text-sm font-normal leading-5">
                Thêm bài toán mini khác
              </span>
            </Button>
          )}
        </div>
      </div>

      <ActionButtons
        onBack={() => setHasSubmitted(false)}
        onNext={handleNext}
        disableNext={!selectedMiniProblemId}
      />
    </div>
  );
};
