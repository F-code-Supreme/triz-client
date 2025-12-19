import { Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStep3SuggestionMutation } from '@/features/6-steps/services/mutations';
import { useSixStepDataStore } from '@/features/6-steps/store/useSixStepDataStore';
import { truncate } from '@/utils';

import ActionButtons from '../../action-buttons';
import { SelectableItem } from '../../selectable-item';

import type { SixStepData } from '@/features/6-steps/store/useSixStepDataStore';

interface Step3Props {
  onNext: (data: SixStepData['step3']) => void;
  onBack: () => void;
}

interface RequiredStateItem {
  id: string;
  text: string;
}

export const Step3AnswerQuestions = ({ onNext, onBack }: Step3Props) => {
  const { stepData } = useSixStepDataStore();
  const initialData = stepData.step3;
  const selectedMiniProblem =
    stepData.step1?.selectedMiniProblem ||
    'Khả năng lưu trữ năng lượng hóa học của các cell pin bị suy giảm (hiện tượng lão hóa vật liệu).';
  const selectedGoal =
    stepData.step2?.selectedGoal?.text ||
    'Khả năng lưu trữ năng lượng của các cell pin được duy trì nguyên vẹn ở mức tối ưu bất chấp thời gian hoạt động.';

  const [systemIdentified, setSystemIdentified] = useState(
    initialData?.systemIdentified || '',
  );
  const [elements, setElements] = useState<string[]>(
    initialData?.elements || [],
  );
  const [requiredStates, setRequiredStates] = useState<
    Record<string, RequiredStateItem[]>
  >(initialData?.requiredStates || {});
  const [activeTab, setActiveTab] = useState<string>('');
  const [isAddingState, setIsAddingState] = useState(false);
  const [newStateText, setNewStateText] = useState('');
  const [isAddingElement, setIsAddingElement] = useState(false);
  const [newElementText, setNewElementText] = useState('');

  const step3Mutation = useStep3SuggestionMutation();

  // Fetch suggestions when component mounts
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!selectedMiniProblem || !selectedGoal) return;

      // Check if we need to fetch new suggestions
      // Fetch if: no system identified OR no initial data exists
      const shouldFetch =
        !systemIdentified ||
        !initialData?.systemIdentified ||
        elements.length === 0;

      if (shouldFetch) {
        try {
          const response = await step3Mutation.mutateAsync({
            miniProblem: selectedMiniProblem,
            goal: selectedGoal,
          });

          setSystemIdentified(response.systemIdentified);
          setElements(response.elements);

          // Convert requiredStates to the format with IDs
          const statesWithIds: Record<string, RequiredStateItem[]> = {};
          Object.entries(response.requiredStates).forEach(
            ([element, states]) => {
              statesWithIds[element] = states.map((state, index) => ({
                id: `${element}-${index}`,
                text: state,
              }));
            },
          );
          setRequiredStates(statesWithIds);

          // Set first element as active tab
          if (response.elements.length > 0) {
            setActiveTab(response.elements[0]);
          }
        } catch (error) {
          console.error('Failed to get step 3 suggestions:', error);
        }
      } else if (initialData?.elements && initialData.elements.length > 0) {
        // Set first element as active tab if data exists
        setActiveTab(initialData.elements[0]);
      }
    };

    fetchSuggestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMiniProblem, selectedGoal]);

  const handleNext = () => {
    // Validate that each element has at least one required state
    const hasInvalidElements = elements.some(
      (element) => !requiredStates[element]?.length,
    );

    if (hasInvalidElements) {
      toast.error(
        'Mỗi yếu tố phải có ít nhất một trạng thái yêu cầu. Vui lòng thêm trạng thái cho tất cả các yếu tố.',
      );
      return;
    }

    if (systemIdentified && elements.length > 0) {
      onNext({ systemIdentified, elements, requiredStates });
    }
  };

  const handleDeleteElement = (element: string) => {
    // Remove element from elements array
    setElements((prev) => prev.filter((el) => el !== element));

    // Remove element's required states
    setRequiredStates((prev) => {
      const newStates = { ...prev };
      delete newStates[element];
      return newStates;
    });

    // Update active tab if we deleted the active one
    if (activeTab === element) {
      const remainingElements = elements.filter((el) => el !== element);
      setActiveTab(remainingElements[0] || '');
    }
  };

  const handleAddElement = () => {
    if (!newElementText.trim()) {
      setIsAddingElement(false);
      return;
    }

    const trimmedElement = newElementText.trim();

    // Check if element already exists
    if (elements.includes(trimmedElement)) {
      toast.warning('Phần tử này đã tồn tại.');
      return;
    }

    setElements((prev) => [...prev, trimmedElement]);
    setRequiredStates((prev) => ({
      ...prev,
      [trimmedElement]: [],
    }));

    // Set new element as active tab
    setActiveTab(trimmedElement);

    setNewElementText('');
    setIsAddingElement(false);
  };

  const handleCancelAddElement = () => {
    setNewElementText('');
    setIsAddingElement(false);
  };

  const handleElementKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddElement();
    } else if (e.key === 'Escape') {
      handleCancelAddElement();
    }
  };

  const handleEditState = (elementKey: string, id: string, newText: string) => {
    setRequiredStates((prev) => ({
      ...prev,
      [elementKey]: prev[elementKey].map((state) =>
        state.id === id ? { ...state, text: newText } : state,
      ),
    }));
  };

  const handleDeleteState = (elementKey: string, id: string) => {
    setRequiredStates((prev) => ({
      ...prev,
      [elementKey]: prev[elementKey].filter((state) => state.id !== id),
    }));
  };

  const handleAddState = () => {
    if (!newStateText.trim() || !activeTab) {
      setIsAddingState(false);
      return;
    }

    const newState: RequiredStateItem = {
      id: `${activeTab}-${Date.now()}`,
      text: newStateText.trim(),
    };

    setRequiredStates((prev) => ({
      ...prev,
      [activeTab]: [...(prev[activeTab] || []), newState],
    }));

    setNewStateText('');
    setIsAddingState(false);
  };

  const handleCancelAdd = () => {
    setNewStateText('');
    setIsAddingState(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddState();
    } else if (e.key === 'Escape') {
      handleCancelAdd();
    }
  };

  return (
    <div className="max-w-4xl xl:max-w-5xl 2xl:max-w-7xl mx-auto h-full flex flex-col gap-4">
      <div className="flex-1 flex flex-col gap-4">
        <div className="self-stretch text-center justify-start text-4xl font-bold leading-[48px] tracking-tight">
          Trả lời các câu hỏi
        </div>
        <div className="self-stretch px-6 py-5 bg-blue-50 dark:bg-blue-950 rounded-lg outline outline-1 outline-offset-[-1px] outline-blue-600 inline-flex justify-center items-center gap-2 mx-auto">
          <div className="justify-start text-blue-800 dark:text-blue-200 text-base font-bold leading-6">
            Mục tiêu: {stepData.step2?.selectedGoal?.text}
          </div>
        </div>

        {/* Elements Tabs */}
        {step3Mutation.isPending ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        ) : (
          elements.length > 0 && (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList>
                {elements.map((element) => (
                  <TabsTrigger
                    key={element}
                    value={element}
                    className="text-xs relative group pr-7"
                    title={element}
                  >
                    {truncate(element, 20)}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteElement(element);
                      }}
                      className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-0.5 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-all"
                      aria-label="Delete element"
                    >
                      <X className="w-3 h-3 text-red-600 dark:text-red-400" />
                    </button>
                  </TabsTrigger>
                ))}
                {isAddingElement ? (
                  <div className="inline-flex items-center px-2">
                    <input
                      type="text"
                      value={newElementText}
                      onChange={(e) => setNewElementText(e.target.value)}
                      onKeyDown={handleElementKeyDown}
                      onBlur={handleAddElement}
                      placeholder="Tên yếu tố..."
                      className="w-32 text-xs px-2 py-1 bg-transparent border-b border-primary outline-none"
                      autoFocus
                    />
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddingElement(true)}
                    className="h-8 px-2"
                  >
                    <Plus className="w-3 h-3" />
                    <span className="text-xs ml-1">Thêm yếu tố</span>
                  </Button>
                )}
              </TabsList>

              {elements.map((element) => (
                <TabsContent
                  key={element}
                  value={element}
                  className="space-y-4"
                >
                  <div className="text-sm font-semibold text-slate-600">
                    Trạng thái yêu cầu cho {element}:
                  </div>

                  <ScrollArea className="h-[35vh] pr-4">
                    <div className="flex flex-col gap-3">
                      {requiredStates[element]?.map((state) => (
                        <SelectableItem
                          key={state.id}
                          id={state.id}
                          text={state.text}
                          isEditable={true}
                          isDeletable={true}
                          onEdit={(id, newText) =>
                            handleEditState(element, id, newText)
                          }
                          onDelete={(id) => handleDeleteState(element, id)}
                        />
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Add more states */}
                  <div>
                    {isAddingState ? (
                      <div className="w-full pl-3.5 pr-3 py-4 rounded-lg bg-secondary-foreground outline outline-1 outline-offset-[-1px] outline-primary flex items-center gap-3">
                        <input
                          type="text"
                          value={newStateText}
                          onChange={(e) => setNewStateText(e.target.value)}
                          onKeyDown={handleKeyDown}
                          onBlur={handleAddState}
                          placeholder="Nhập trạng thái mới..."
                          className="flex-1 text-primary dark:text-foreground text-sm font-normal leading-5 bg-transparent outline-none"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        onClick={() => setIsAddingState(true)}
                        className="rounded-lg pl-1 pr-1"
                      >
                        <Plus className="w-4 h-4 text-secondary" />
                        <span className="text-sm font-normal leading-5">
                          Thêm trạng thái khác
                        </span>
                      </Button>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )
        )}
      </div>

      <ActionButtons
        onBack={onBack}
        onNext={handleNext}
        disableNext={
          !systemIdentified || elements.length === 0 || step3Mutation.isPending
        }
      />
    </div>
  );
};
