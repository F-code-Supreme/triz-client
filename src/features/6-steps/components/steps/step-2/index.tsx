import { Plus } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

import Goal from './Goal';
import ActionButtons from '../../ActionButtons';

export interface GoalItem {
  id: string;
  text: string;
}

interface Step2Props {
  onNext: (data: { goals: GoalItem[]; selectedGoal?: GoalItem }) => void;
  onBack: () => void;
  initialData?: { goals: GoalItem[] };
}

// Mock data for goals
const MOCK_GOALS: GoalItem[] = [
  { id: '1', text: 'Kéo dài thời lượng pin' },
  { id: '2', text: 'Duy trì hiệu năng CPU cao' },
  { id: '3', text: 'Giảm nhiệt độ thiết bị' },
  { id: '4', text: 'Giảm nhiệt độ thiết bị' },
  { id: '5', text: 'Giảm nhiệt độ thiết bị' },
  { id: '6', text: 'Giảm nhiệt độ thiết bị' },
  { id: '7', text: 'Giảm nhiệt độ thiết bị' },
  { id: '8', text: 'Giảm nhiệt độ thiết bị' },
  { id: '9', text: 'Giảm nhiệt độ thiết bị' },
];

export const Step2DefineObjective = ({
  onNext,
  onBack,
  initialData,
}: Step2Props) => {
  const [goals, setGoals] = useState<GoalItem[]>(
    initialData?.goals || MOCK_GOALS,
  );
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalText, setNewGoalText] = useState('');

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
      <div className="flex-1 flex flex-col gap-8">
        <div className="self-stretch text-center justify-start text-4xl font-bold leading-[48px] tracking-tight">
          Mục tiêu bạn muốn đạt được từ vấn đề là gì?
        </div>
        <div className="self-stretch px-6 py-5 bg-blue-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-blue-600 inline-flex justify-center items-center gap-2 mx-auto">
          <div className="justify-start text-blue-800 text-base font-bold leading-6">
            Vấn đề: Pin điện thoại nhanh hết nhưng không được giảm hiệu năng
            CPU.
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <ScrollArea className="h-[45vh] pr-4">
            <div className="flex flex-col gap-3">
              {goals.map((goal) => (
                <Goal
                  key={goal.id}
                  goal={goal.text}
                  isSelected={selectedGoalId === goal.id}
                  onEdit={(newText) => handleEditGoal(goal.id, newText)}
                  onSelect={() => setSelectedGoalId(goal.id)}
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
      </div>
      <ActionButtons
        onBack={onBack}
        onNext={handleNext}
        disableNext={!selectedGoalId}
      />
    </div>
  );
};
