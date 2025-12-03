import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useStep2SuggestionMutation } from '@/features/6-steps/services/mutations';
import { useSixStepDataStore } from '@/features/6-steps/store/useSixStepDataStore';

import ActionButtons from '../../ActionButtons';
import { SelectableItem } from '../../SelectableItem';
import { SelectableItemSkeletonList } from '../../SelectableItemSkeleton';

import type {
  GoalItem,
  SixStepData,
} from '@/features/6-steps/store/useSixStepDataStore';

interface Step2Props {
  onNext: (data: SixStepData['step2']) => void;
  onBack: () => void;
  initialData?: { goals: GoalItem[] };
  selectedMiniProblem?: string;
}

export const Step2DefineObjective = ({ onNext, onBack }: Step2Props) => {
  const { stepData } = useSixStepDataStore();
  const initialData = stepData.step2;
  const selectedMiniProblem = stepData.step1?.selectedMiniProblem;

  const [goals, setGoals] = useState<GoalItem[]>(initialData?.goals || []);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalText, setNewGoalText] = useState('');

  const step2Mutation = useStep2SuggestionMutation();

  // Update local state when store data changes
  useEffect(() => {
    if (initialData?.goals) {
      setGoals(initialData.goals);
    }
  }, [initialData]);

  // Fetch goal suggestions when component mounts or mini problem changes
  useEffect(() => {
    const fetchGoalSuggestions = async () => {
      if (!selectedMiniProblem) return;

      // Check if we need to fetch new suggestions
      // Fetch if: no goals exist OR the existing goals don't match the current mini problem
      const shouldFetch =
        goals.length === 0 ||
        !initialData?.goals ||
        initialData?.goals.length === 0;

      if (shouldFetch) {
        try {
          const response = await step2Mutation.mutateAsync({
            miniProblem: selectedMiniProblem,
          });

          // Convert API response to goals
          const suggestedGoals: GoalItem[] = [];

          // Add main goal
          if (response.goal) {
            suggestedGoals.push({
              id: 'main-goal',
              text: response.goal,
            });
          }

          // Add secondary goals if available
          if (response.secondaryGoals && response.secondaryGoals.length > 0) {
            response.secondaryGoals.forEach((goal, index) => {
              suggestedGoals.push({
                id: `secondary-${index}`,
                text: goal,
              });
            });
          }

          setGoals(suggestedGoals);
          // Auto-select the first goal
          if (suggestedGoals.length > 0) {
            setSelectedGoalId(suggestedGoals[0].id);
          }
        } catch (error) {
          console.error('Failed to get goal suggestions:', error);
          setGoals([]);
        }
      }
    };

    fetchGoalSuggestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMiniProblem]);

  const handleNext = () => {
    if (goals.length > 0 && selectedGoalId) {
      const selectedGoal = goals.find((g) => g.id === selectedGoalId);
      onNext({ goals, selectedGoal });
    }
  };

  const handleEditGoal = (id: string, newText: string) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === id ? { ...goal, text: newText } : goal,
      ),
    );
  };

  const handleAddGoal = () => {
    if (!newGoalText.trim()) {
      setIsAddingGoal(false);
      return;
    }
    const newGoal: GoalItem = {
      id: Date.now().toString(),
      text: newGoalText.trim(),
    };
    setGoals((prevGoals) => [newGoal, ...prevGoals]); // Add to top
    setNewGoalText('');
    setIsAddingGoal(false);
    setSelectedGoalId(newGoal.id);
  };

  const handleCancelAdd = () => {
    setNewGoalText('');
    setIsAddingGoal(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddGoal();
    } else if (e.key === 'Escape') {
      handleCancelAdd();
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col gap-4">
      <div className="flex-1 flex flex-col gap-4">
        <div className="self-stretch text-center justify-start text-4xl font-bold leading-[48px] tracking-tight">
          Mục tiêu bạn muốn đạt được từ vấn đề là gì?
        </div>
        <div className="self-stretch px-6 py-5 bg-blue-50 dark:bg-blue-950 rounded-lg outline outline-1 outline-offset-[-1px] outline-blue-600 inline-flex justify-center items-center gap-2 mx-auto">
          <div className="justify-start text-blue-800 dark:text-blue-200 text-base font-bold leading-6">
            Bài toán mini: {selectedMiniProblem || 'Chưa có bài toán mini'}
          </div>
        </div>

        <div className="self-stretch justify-start text-sm font-semibold leading-6 text-slate-600 ">
          Chọn 1 trong các mục tiêu sau:
        </div>

        {step2Mutation.isPending ? (
          <ScrollArea className="h-[45vh] pr-4">
            <div className="flex flex-col gap-3">
              <SelectableItemSkeletonList count={5} />
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col gap-4">
            <ScrollArea className="h-[45vh] pr-4">
              <div className="flex flex-col gap-3">
                {goals.map((goal) => (
                  <SelectableItem
                    key={goal.id}
                    id={goal.id}
                    text={goal.text}
                    isSelected={selectedGoalId === goal.id}
                    isEditable={true}
                    onEdit={handleEditGoal}
                    onSelect={(id) => setSelectedGoalId(id)}
                  />
                ))}
              </div>
            </ScrollArea>
            {/* Add more goals */}
            <div>
              {isAddingGoal ? (
                <div className="w-full pl-3.5 pr-3 py-4 rounded-lg bg-secondary-foreground outline outline-1 outline-offset-[-1px] outline-primary flex items-center gap-3">
                  <input
                    type="text"
                    value={newGoalText}
                    onChange={(e) => setNewGoalText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleAddGoal}
                    placeholder="Nhập mục tiêu mới..."
                    className="flex-1 text-primary dark:text-foreground text-sm font-normal leading-5 bg-transparent outline-none"
                    autoFocus
                  />
                </div>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => setIsAddingGoal(true)}
                  className="rounded-lg pl-1 pr-1"
                >
                  <Plus className="w-4 h-4 text-secondary" />
                  <span className="text-sm font-normal leading-5">
                    Thêm mục tiêu khác
                  </span>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      <ActionButtons
        onBack={onBack}
        onNext={handleNext}
        disableNext={!selectedGoalId || step2Mutation.isPending}
      />
    </div>
  );
};
