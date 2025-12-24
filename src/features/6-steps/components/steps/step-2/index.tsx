import { Plus, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useStep2SuggestionMutation } from '@/features/6-steps/services/mutations';
import { useSixStepDataStore } from '@/features/6-steps/store/useSixStepDataStore';

import ActionButtons from '../../action-buttons';
import { SelectableItem } from '../../selectable-item';

import type { SixStepData } from '@/features/6-steps/store/useSixStepDataStore';

interface Step2Props {
  onNext: (data: SixStepData['step2']) => void;
  onBack: () => void;
}

interface ConstraintItem {
  id: string;
  text: string;
}

export const Step2DefineObjective = ({ onNext, onBack }: Step2Props) => {
  const { stepData } = useSixStepDataStore();
  const initialData = stepData.step2;
  const selectedMiniProblem = stepData.step1?.selectedMiniProblem;

  // Editable fields
  const [goal, setGoal] = useState<string>(initialData?.goal || '');
  const [constraints, setConstraints] = useState<ConstraintItem[]>(
    initialData?.constraints?.map((c, i) => ({
      id: `constraint-${i}`,
      text: c,
    })) || [],
  );

  // Hidden fields (not editable, passed to next step)
  const [scope, setScope] = useState<string>(initialData?.scope || '');
  const [idealFinalResult, setIdealFinalResult] = useState<string | null>(
    initialData?.idealFinalResult || null,
  );

  const [isAddingConstraint, setIsAddingConstraint] = useState(false);
  const [newConstraintText, setNewConstraintText] = useState('');

  const step2Mutation = useStep2SuggestionMutation();

  // Fetch goal and constraints suggestions when component mounts
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!selectedMiniProblem || !stepData.step1) return;

      // Fetch if no goal exists
      const shouldFetch = !goal || !initialData?.goal;

      if (shouldFetch) {
        try {
          const response = await step2Mutation.mutateAsync({
            understandingSummary: stepData.step1.understandingSummary,
            systemContext: stepData.step1.systemContext,
            psychologicalInertia: stepData.step1.psychologicalInertia,
            miniProblem: selectedMiniProblem,
            clarificationNeeded: stepData.step1.clarificationNeeded,
          });

          // Set editable fields
          setGoal(response.goal);
          setConstraints(
            response.constraints.map((c, i) => ({
              id: `constraint-${i}`,
              text: c,
            })),
          );

          // Set hidden fields
          setScope(response.scope);
          setIdealFinalResult(response.idealFinalResult);
        } catch (error) {
          console.error('Failed to get step 2 suggestions:', error);
        }
      }
    };

    fetchSuggestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMiniProblem]);

  const handleNext = () => {
    if (!goal.trim()) {
      toast.error('Vui lòng nhập mục tiêu.');
      return;
    }

    onNext({
      goal: goal.trim(),
      constraints: constraints.map((c) => c.text),
      scope,
      idealFinalResult,
    });
  };

  const handleEditConstraint = (id: string, newText: string) => {
    setConstraints((prev) =>
      prev.map((constraint) =>
        constraint.id === id ? { ...constraint, text: newText } : constraint,
      ),
    );
  };

  const handleDeleteConstraint = (id: string) => {
    setConstraints((prev) => prev.filter((constraint) => constraint.id !== id));
  };

  const handleAddConstraint = () => {
    if (!newConstraintText.trim()) {
      setIsAddingConstraint(false);
      return;
    }

    const newConstraint: ConstraintItem = {
      id: `constraint-${Date.now()}`,
      text: newConstraintText.trim(),
    };

    setConstraints((prev) => [...prev, newConstraint]);
    setNewConstraintText('');
    setIsAddingConstraint(false);
  };

  const handleCancelAddConstraint = () => {
    setNewConstraintText('');
    setIsAddingConstraint(false);
  };

  const handleConstraintKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Enter') {
      handleAddConstraint();
    } else if (e.key === 'Escape') {
      handleCancelAddConstraint();
    }
  };

  return (
    <div className="max-w-4xl xl:max-w-5xl 2xl:max-w-7xl mx-auto h-full flex flex-col gap-4">
      <div className="flex-1 flex flex-col gap-4">
        <div className="self-stretch text-center justify-center items-center gap-2 inline-flex">
          <div className="text-4xl font-bold leading-[48px] tracking-tight">
            Xác định mục tiêu và ràng buộc
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

                {scope && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Phạm vi:
                    </p>
                    <p className="text-sm">{scope}</p>
                  </div>
                )}

                {idealFinalResult && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Kết quả lý tưởng cuối cùng (IFR):
                    </p>
                    <p className="text-sm">{idealFinalResult}</p>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="self-stretch px-6 py-5 bg-blue-50 dark:bg-blue-950 rounded-lg outline outline-1 outline-offset-[-1px] outline-blue-600 inline-flex justify-center items-center gap-2 mx-auto">
          <div className="justify-start text-blue-800 dark:text-blue-200 text-base font-bold leading-6">
            Bài toán mini: {selectedMiniProblem || 'Chưa có bài toán mini'}
          </div>
        </div>

        {step2Mutation.isPending ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Goal Editor */}
            <div className="flex flex-col gap-2">
              <div className="text-sm font-semibold text-slate-600">
                Mục tiêu:
              </div>
              <Textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Nhập mục tiêu..."
                className="min-h-[100px] resize-none"
              />
            </div>

            {/* Constraints List */}
            <div className="flex flex-col gap-2">
              <div className="text-sm font-semibold text-slate-600">
                Ràng buộc:
              </div>

              <ScrollArea className="h-[30vh] pr-4">
                <div className="flex flex-col gap-3">
                  {constraints.map((constraint) => (
                    <SelectableItem
                      key={constraint.id}
                      id={constraint.id}
                      text={constraint.text}
                      isEditable={true}
                      isDeletable={true}
                      onEdit={handleEditConstraint}
                      onDelete={handleDeleteConstraint}
                    />
                  ))}
                </div>
              </ScrollArea>

              {/* Add constraint */}
              <div>
                {isAddingConstraint ? (
                  <div className="w-full pl-3.5 pr-3 py-4 rounded-lg bg-secondary-foreground outline outline-1 outline-offset-[-1px] outline-primary flex items-center gap-3">
                    <input
                      type="text"
                      value={newConstraintText}
                      onChange={(e) => setNewConstraintText(e.target.value)}
                      onKeyDown={handleConstraintKeyDown}
                      onBlur={handleAddConstraint}
                      placeholder="Nhập ràng buộc mới..."
                      className="flex-1 text-primary dark:text-foreground text-sm font-normal leading-5 bg-transparent outline-none"
                      autoFocus
                    />
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    onClick={() => setIsAddingConstraint(true)}
                    className="rounded-lg pl-1 pr-1"
                  >
                    <Plus className="w-4 h-4 text-secondary" />
                    <span className="text-sm font-normal leading-5">
                      Thêm ràng buộc
                    </span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <ActionButtons
        onBack={onBack}
        onNext={handleNext}
        disableNext={!goal.trim() || step2Mutation.isPending}
      />
    </div>
  );
};
