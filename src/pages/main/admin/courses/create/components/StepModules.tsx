import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useReorderModuleMutation } from '@/features/courses/services/mutations';
import {
  useCreateModuleMutation,
  useUpdateModuleMutation,
} from '@/features/modules/services/mutations';
import { useGetModulesByCourseQuery } from '@/features/modules/services/queries';
import { ModuleKeys } from '@/features/modules/services/queries/keys';

import { AddAssignmentModal } from './AddAssignmentModal';
import { AddLessonModal } from './AddLessonModal';
import { ModuleCard } from './ModuleCard';

import type { Module } from '@/features/modules/types';
import type { DragEndEvent } from '@dnd-kit/core';

type Props = {
  goNext: () => void;
  goBack: () => void;
  courseId?: string | null;
};

const StepModules: React.FC<Props> = ({ goNext, goBack, courseId }) => {
  const queryClient = useQueryClient();
  const modulesQuery = useGetModulesByCourseQuery(courseId ?? '');
  const modules = modulesQuery.data?.content ?? [];
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [selectedModuleIdForLesson, setSelectedModuleIdForLesson] = useState<
    string | null
  >(null);
  // track lesson being edited (if any)
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);

  const reorderModuleMutation = useReorderModuleMutation(courseId ?? '');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // ignore while a reorder mutation is pending or if no courseId
    if (reorderModuleMutation.isPending || !courseId) return;

    if (over && active.id !== over.id) {
      const oldIndex = modules.findIndex((m) => m.id === active.id);
      const newIndex = modules.findIndex((m) => m.id === over.id);

      const reorderedModules = arrayMove(modules, oldIndex, newIndex);

      const queryKey = [ModuleKeys.GetModulesByCourseQuery, courseId];
      const previous = queryClient.getQueryData(queryKey);

      // optimistic update
      queryClient.setQueryData(queryKey, (oldData: Module) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          content: reorderedModules,
        };
      });

      // send to server with callbacks to revert/invalidate
      reorderModuleMutation.mutate(
        reorderedModules.map((m) => m.id),
        {
          onError: (err: unknown) => {
            // restore previous snapshot
            if (previous !== undefined) {
              queryClient.setQueryData(queryKey, previous);
            } else {
              queryClient.invalidateQueries({ queryKey });
            }
            let msg = 'Failed to reorder modules';
            if (err instanceof Error) msg = err.message;
            else if (typeof err === 'string') msg = err;
            toast.error(msg);
          },
          onSuccess: () => {
            toast.success('Module order updated');
          },
          onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
          },
        },
      );
    }
  };
  // use isLoading for mutation and isFetching for query
  const isPending = reorderModuleMutation.isPending || modulesQuery.isFetching;

  const CreateModuleForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    // keep local disable aware of global pending
    const isCreateDisabled = isPending;
    const createModule = useCreateModuleMutation(courseId ?? '');
    const [name, setName] = useState('');
    const [duration, setDuration] = useState<number>(60);
    const [level, setLevel] = useState<'EASY' | 'MEDIUM' | 'HARD'>('EASY');

    const handleCreate = () => {
      if (!courseId) {
        toast.error('Please save the course before adding modules.');
        return;
      }
      if (!name.trim()) {
        toast.error('Module name is required');
        return;
      }
      createModule.mutate(
        { name: name.trim(), durationInMinutes: duration, level },
        {
          onSuccess: () => {
            toast.success('Module created');
            onClose();
          },
          onError: (err: unknown) => {
            let msg = 'Failed to create module';
            if (err instanceof Error) msg = err.message;
            else if (typeof err === 'string') msg = err;
            else {
              try {
                msg = JSON.stringify(err);
              } catch {
                /* ignore */
              }
            }
            toast.error(msg);
          },
        },
      );
    };

    return (
      <div className="p-4 border rounded bg-white">
        <div className="flex gap-2 mb-2">
          <input
            className="border p-2 rounded flex-1"
            placeholder="Module name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isCreateDisabled}
          />
          <input
            type="number"
            className="border p-2 rounded w-28"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            disabled={isCreateDisabled}
          />
          <select
            className="border p-2 rounded"
            value={level}
            onChange={(e) =>
              setLevel(e.target.value as 'EASY' | 'MEDIUM' | 'HARD')
            }
            disabled={isCreateDisabled}
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
          <div className="flex gap-2">
            <Button onClick={handleCreate} disabled={isCreateDisabled}>
              Create
            </Button>
            <Button
              variant="destructive"
              onClick={onClose}
              disabled={isCreateDisabled}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const EditModuleForm: React.FC<{
    moduleId: string;
    initialName?: string;
  }> = ({ moduleId, initialName }) => {
    const updateModule = useUpdateModuleMutation(moduleId);
    const [name, setName] = useState(initialName ?? '');
    const [duration, setDuration] = useState<number>(60);
    const [level, setLevel] = useState<'EASY' | 'MEDIUM' | 'HARD'>('EASY');

    const handleUpdate = () => {
      if (!name.trim()) {
        toast.error('Module name is required');
        return;
      }
      updateModule.mutate(
        { id: moduleId, name: name.trim(), durationInMinutes: duration, level },
        {
          onSuccess: () => {
            toast.success('Module updated');
            setEditingModuleId(null);
          },
          onError: (err: unknown) => {
            let msg = 'Failed to update module';
            if (err instanceof Error) msg = err.message;
            else if (typeof err === 'string') msg = err;
            else {
              try {
                msg = JSON.stringify(err);
              } catch {
                /* ignore */
              }
            }
            toast.error(msg);
          },
        },
      );
    };

    return (
      <div className="p-4 border rounded bg-white">
        <div className="flex gap-2 mb-2">
          <input
            className="border p-2 rounded flex-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            className="border p-2 rounded w-28"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
          <select
            className="border p-2 rounded"
            value={level}
            onChange={(e) =>
              setLevel(e.target.value as 'EASY' | 'MEDIUM' | 'HARD')
            }
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
          <div className="flex gap-2">
            <Button onClick={handleUpdate}>Save</Button>
            <Button
              variant="destructive"
              onClick={() => setEditingModuleId(null)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="rounded-md border">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-blue-600 rounded" />
          <h2 className="text-xl font-semibold flex items-center gap-2">
            Quản lý Chương Học
            {isPending && (
              <span className="inline-block w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" />
            )}
          </h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCreateForm((v) => !v)}
          disabled={isPending}
        >
          <Plus className="mr-2 h-4 w-4" />
          Tạo Chương Học
        </Button>
      </div>

      {/* Modules list */}
      {showCreateForm && (
        <div className="p-6">
          <CreateModuleForm onClose={() => setShowCreateForm(false)} />
        </div>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={modules.map((m) => m.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="p-6 space-y-6">
            {modules.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                editingModuleId={editingModuleId}
                EditModuleForm={EditModuleForm}
                onEditModule={setEditingModuleId}
                disabled={isPending}
                onAddAssignment={(moduleId) => {
                  setSelectedModuleId(moduleId);
                  setIsAssignmentModalOpen(true);
                }}
                onAddLesson={(moduleId) => {
                  setSelectedModuleIdForLesson(moduleId);
                  setIsLessonModalOpen(true);
                }}
                onEditLesson={(lessonId, moduleId) => {
                  // open modal in edit mode with lesson id + module id
                  setSelectedModuleIdForLesson(moduleId);
                  setEditingLessonId(lessonId);
                  setIsLessonModalOpen(true);
                }}
                onViewLesson={(lessonId) => {
                  // TODO: Implement view lesson functionality
                  toast.info(`View lesson ${lessonId}`);
                }}
                onDeleteLesson={(lessonId) => {
                  // TODO: Implement delete lesson functionality
                  toast.info(`Delete lesson ${lessonId}`);
                }}
                onEditAssignment={(assignmentId) => {
                  // TODO: Implement edit assignment functionality
                  toast.info(`Edit assignment ${assignmentId}`);
                }}
                onViewAssignment={(assignmentId) => {
                  // TODO: Implement view assignment functionality
                  toast.info(`View assignment ${assignmentId}`);
                }}
                onDeleteAssignment={(assignmentId) => {
                  // TODO: Implement delete assignment functionality
                  toast.info(`Delete assignment ${assignmentId}`);
                }}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Add Assignment Modal */}
      {selectedModuleId && (
        <AddAssignmentModal
          open={isAssignmentModalOpen}
          onOpenChange={setIsAssignmentModalOpen}
          moduleId={selectedModuleId}
        />
      )}

      {/* Add Lesson Modal */}
      {selectedModuleIdForLesson && (
        <AddLessonModal
          open={isLessonModalOpen}
          onOpenChange={(open) => {
            setIsLessonModalOpen(open);
            if (!open) {
              // reset editing state when closed
              setEditingLessonId(null);
              setSelectedModuleIdForLesson(null);
            }
          }}
          moduleId={selectedModuleIdForLesson}
          lessonId={editingLessonId ?? undefined}
        />
      )}

      {/* Footer divider and actions */}
      <div className="border-t">
        <div className="flex items-center justify-between p-6">
          <Button variant="outline" onClick={goBack} disabled={isPending}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={goNext} disabled={isPending}>
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepModules;
