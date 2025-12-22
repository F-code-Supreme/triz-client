import { Plus, Info } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SelectableItem } from '@/features/6-steps/components/selectable-item';
import { SelectableItemSkeletonList } from '@/features/6-steps/components/selectable-item-skeleton-list';
import { useStep5SuggestionMutation } from '@/features/6-steps/services/mutations';
import { useSixStepDataStore } from '@/features/6-steps/store/useSixStepDataStore';

import ActionButtons from '../../action-buttons';

import type { Idea } from '@/features/6-steps/services/mutations/types';

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
  const { stepData } = useSixStepDataStore();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [targetML, setTargetML] = useState<string>('');

  const step5Mutation = useStep5SuggestionMutation();

  // Fetch ideas when component mounts
  useEffect(() => {
    const fetchIdeas = async () => {
      const step1Data = stepData.step1;
      const step2Data = stepData.step2;
      const step3Data = stepData.step3;
      const step4Data = stepData.step4;

      if (!step1Data || !step2Data || !step3Data || !step4Data) {
        toast.error('Missing required step data');
        return;
      }

      // Check if we have initialData with ideas
      if (initialData?.ideas && Array.isArray(initialData.ideas)) {
        setIdeas(initialData.ideas as Idea[]);
        return;
      }

      try {
        const response = await step5Mutation.mutateAsync({
          step5Data: {
            technicalContradictions: step4Data.technicalContradictions || [],
          },
          trizPrinciples:
            step4Data.selectedPrinciples?.map((p) => ({
              priority: p.priority,
              principle: {
                id: p.id,
                name: p.name,
                description: p.description,
                examples: p.examples,
              },
            })) || [],
        });

        setTargetML(response.ideaGenerationSession.targetML);
        setIdeas(response.ideaGenerationSession.ideas);
      } catch (error) {
        console.error('Failed to get step 5 suggestions:', error);
        toast.error('Failed to generate ideas');
      }
    };

    fetchIdeas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Group ideas by principle ID and sort by priority
  const groupedIdeas = useMemo(() => {
    const groups: Record<number, Idea[]> = {};

    ideas.forEach((idea) => {
      const principleId = idea.principleUsed.id;
      if (!groups[principleId]) {
        groups[principleId] = [];
      }
      groups[principleId].push(idea);
    });

    // Sort ideas within each group by priority
    Object.keys(groups).forEach((principleId) => {
      // Sort by idea id as fallback since priority is not available
      groups[Number(principleId)].sort((a, b) => a.id - b.id);
    });

    // Convert to array of [principleId, ideas] pairs and sort by principle id
    const sortedEntries = Object.entries(groups).sort((a, b) => {
      return Number(a[0]) - Number(b[0]); // Sort by principle ID
    });

    // Convert back to object while maintaining order
    return Object.fromEntries(sortedEntries);
  }, [ideas]);

  const handleEditIdea = (ideaId: number, newText: string) => {
    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === ideaId ? { ...idea, ideaStatement: newText } : idea,
      ),
    );
  };

  const handleDeleteIdea = (ideaId: number) => {
    setIdeas((prev) => prev.filter((idea) => idea.id !== ideaId));
  };

  const handleAddIdea = (principleId: number) => {
    const principle = ideas.find(
      (idea) => idea.principleUsed.id === principleId,
    )?.principleUsed;

    if (!principle) return;

    const newIdea: Idea = {
      id: Math.max(...ideas.map((i) => i.id), 0) + 1,
      element: stepData.step4?.physicalContradictions[0]?.element || '',
      sourceType: 'TRIZ_Principle',
      principleUsed: principle,
      ideaStatement: 'Ý tưởng mới...',
      howItAddresses: '',
    };

    setIdeas((prev) => [...prev, newIdea]);
  };

  const [selectedIdeaIds, setSelectedIdeaIds] = useState<Set<number>>(
    new Set(),
  );

  const handleSelectIdea = (ideaId: number) => {
    setSelectedIdeaIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(ideaId)) {
        newSet.delete(ideaId);
      } else {
        if (newSet.size >= 3) {
          toast.error('Chỉ được chọn tối đa 3 ý tưởng');
          return prev;
        }
        newSet.add(ideaId);
      }
      return newSet;
    });
  };

  const handleNext = () => {
    if (ideas.length === 0) {
      toast.error('Vui lòng có ít nhất một ý tưởng để tiếp tục');
      return;
    }

    if (selectedIdeaIds.size > 3) {
      toast.error('Vui lòng chọn đúng 3 ý tưởng để tiếp tục');
      return;
    }

    const selectedIdeas = ideas.filter((idea) => selectedIdeaIds.has(idea.id));
    onNext({ ideas, selectedIdeas, targetML });
  };

  if (step5Mutation.isPending) {
    return (
      <div className="max-w-4xl xl:max-w-5xl 2xl:max-w-7xl mx-auto h-full flex flex-col gap-4">
        <div className="flex-1 flex flex-col gap-4">
          <div className="self-stretch text-center justify-center text-4xl font-bold leading-[48px] tracking-tight">
            Phát các ý tưởng giải quyết ML
          </div>
          <div className="self-stretch px-6 py-5 bg-blue-50 dark:bg-blue-950 rounded-lg outline outline-1 outline-offset-[-1px] outline-blue-600 inline-flex justify-center items-center gap-2 mx-auto">
            <div className="justify-start text-blue-800 dark:text-blue-200 text-base font-bold leading-6">
              Mâu thuẫn vật lý:{' '}
              {stepData.step4?.physicalContradictions[
                stepData.step4.selectedPhysicalContradictionIndex || 0
              ]?.contradictionStatement || 'N/A'}
            </div>
          </div>

          <div className="self-stretch justify-start text-sm font-semibold leading-6 text-slate-600">
            Đang tạo các ý tưởng từ các nguyên tắc TRIZ...
          </div>

          <ScrollArea className="h-[50vh] pr-4">
            <div className="flex flex-col gap-6">
              {/* Skeleton for 3 principle groups */}
              {[1, 2, 3].map((groupIndex) => (
                <div key={groupIndex} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-6 w-64 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                    <div className="h-9 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <SelectableItemSkeletonList count={3} />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        <ActionButtons onBack={onBack} onNext={handleNext} disableNext={true} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl xl:max-w-5xl 2xl:max-w-7xl mx-auto h-full flex flex-col gap-4">
      <div className="flex-1 flex flex-col gap-4">
        <div className="self-stretch text-center justify-center items-center gap-2 inline-flex">
          <div className="text-4xl font-bold leading-[48px] tracking-tight">
            Phát các ý tưởng giải quyết ML
          </div>
          {targetML && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Info className="h-5 w-5 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 max-h-96 overflow-y-auto">
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Thông tin bổ sung</h4>

                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Target ML (Mâu thuẫn Vật lý mục tiêu):
                    </p>
                    <p className="text-sm">{targetML}</p>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
        <div className="self-stretch px-6 py-5 bg-blue-50 dark:bg-blue-950 rounded-lg outline outline-1 outline-offset-[-1px] outline-blue-600 inline-flex justify-center items-center gap-2 mx-auto">
          <div className="justify-start text-blue-800 dark:text-blue-200 text-base font-bold leading-6">
            Mâu thuẫn vật lý:{' '}
            {stepData.step4?.physicalContradictions[
              stepData.step4.selectedPhysicalContradictionIndex || 0
            ]?.contradictionStatement || 'N/A'}
          </div>
        </div>

        <div className="self-stretch justify-start text-sm font-semibold leading-6 text-slate-600">
          Xem lại và chỉnh sửa các ý tưởng được tạo từ các nguyên tắc TRIZ. Chọn
          nhiều nhất 3 ý tưởng tốt nhất để đánh giá:
        </div>

        {selectedIdeaIds.size > 0 && (
          <div className="bg-blue-50 dark:bg-blue-950 rounded-lg px-4 py-3 border border-blue-200 dark:border-blue-800">
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Đã chọn {selectedIdeaIds.size}/3 ý tưởng
            </span>
          </div>
        )}

        <ScrollArea className="h-[50vh] pr-4">
          <div className="flex flex-col gap-6">
            {Object.entries(groupedIdeas).map(
              ([principleId, principleIdeas]) => {
                const principle = principleIdeas[0].principleUsed;
                return (
                  <div key={principleId} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-base">
                        Nguyên tắc #{principle.id}: {principle.name}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAddIdea(Number(principleId))}
                        className="gap-2"
                      >
                        <Plus className="w-4 h-4 text-secondary" />
                        <span className="text-sm font-normal leading-5">
                          Thêm ý tưởng
                        </span>
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {principleIdeas.map((idea) => (
                        <SelectableItem
                          key={idea.id}
                          id={idea.id.toString()}
                          text={idea.ideaStatement}
                          isSelected={selectedIdeaIds.has(idea.id)}
                          isEditable
                          isDeletable
                          onSelect={(id) => handleSelectIdea(Number(id))}
                          onEdit={(id, newText) =>
                            handleEditIdea(Number(id), newText)
                          }
                          onDelete={(id) => handleDeleteIdea(Number(id))}
                        />
                      ))}
                    </div>
                  </div>
                );
              },
            )}

            {ideas.length === 0 && !step5Mutation.isPending && (
              <div className="text-center py-12 text-muted-foreground">
                <p>Chưa có ý tưởng nào được tạo.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <ActionButtons
        onBack={onBack}
        onNext={handleNext}
        disableNext={ideas.length === 0 || selectedIdeaIds.size > 3}
        nextLabel="Đánh giá ý tưởng"
      />
    </div>
  );
};
