import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useQueryClient } from '@tanstack/react-query';
import { GripVertical, Pencil, Plus } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useGetAssignmentsByModuleQuery } from '@/features/assignment/services/queries';
import { useReorderLessonMutation } from '@/features/lesson/services/mutations';
import { useGetLessonsByModuleQuery } from '@/features/lesson/services/queries';
import { LessonKeys } from '@/features/lesson/services/queries/keys';

import { AssignmentRow } from './AssignmentRow';
import { LessonRow } from './LessonRow';

import type { Lesson } from '@/features/lesson/types';
import type { Module } from '@/features/modules/types';

type ModuleCardProps = {
  module: Module;
  disabled?: boolean;
  onEditModule?: (moduleId: string) => void;
  onAddAssignment?: (moduleId: string) => void;
  onAddLesson?: (moduleId: string) => void;
  onEditLesson?: (lessonId: string, moduleId: string) => void;
  onViewLesson?: (lessonId: string) => void;
  onDeleteLesson?: (lessonId: string) => void;
  onEditAssignment?: (assignmentId: string) => void;
  onViewAssignment?: (assignmentId: string) => void;
  onDeleteAssignment?: (assignmentId: string) => void;
  editingModuleId?: string | null;
  EditModuleForm?: React.ComponentType<{
    moduleId: string;
    initialName?: string;
  }>;
};

export const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  onEditModule,
  onAddAssignment,
  onAddLesson,
  onEditLesson,
  onViewLesson,
  onDeleteLesson,
  onEditAssignment,
  onViewAssignment,
  onDeleteAssignment,
  editingModuleId,
  EditModuleForm,
  disabled = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: module.id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  const { data: lessons } = useGetLessonsByModuleQuery(module.id);
  const { data: assignments } = useGetAssignmentsByModuleQuery(module.id);
  const assignmentsList = assignments ? assignments.content : [];

  // setup DnD sensors for lessons (local to module)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const queryClient = useQueryClient();
  const reorderLessonMutation = useReorderLessonMutation(module.id);
  const lessonsList = Array.isArray(lessons) ? lessons : (lessons ?? []);

  const handleLessonDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) return;
    if (reorderLessonMutation.isPending) return;

    const oldIndex = lessonsList.findIndex((l) => String(l.id) === activeId);
    const newIndex = lessonsList.findIndex((l) => String(l.id) === overId);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(lessonsList, oldIndex, newIndex);
    const lessonQueryKey = [LessonKeys.GetLessonsByModuleQuery, module.id];

    // snapshot previous cache (could be array or { content: [...] })
    const previous = queryClient.getQueryData(lessonQueryKey);

    // optimistic update: preserve original shape
    queryClient.setQueryData(lessonQueryKey, (oldData: Lesson) => {
      if (!oldData) return reordered;
      if (Array.isArray(oldData)) return reordered;
      if (oldData && typeof oldData === 'object' && 'content' in oldData) {
        return {
          ...oldData,
          content: reordered,
        };
      }
      // fallback
      return reordered;
    });

    // send string ids to backend
    reorderLessonMutation.mutate(
      reordered.map((l) => String(l.id)),
      {
        onError: (err: unknown) => {
          // revert to previous snapshot
          if (previous !== undefined) {
            queryClient.setQueryData(lessonQueryKey, previous);
          } else {
            queryClient.invalidateQueries({ queryKey: lessonQueryKey });
          }
          let msg = 'Failed to reorder lessons';
          if (err instanceof Error) msg = err.message;
          else if (typeof err === 'string') msg = err;
          toast.error(msg);
        },
        onSuccess: () => {
          toast.success('Lesson order updated');
        },
      },
    );
  };
  const lessonsPending = reorderLessonMutation.isPending;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border rounded-lg bg-gray-50 p-4"
    >
      {editingModuleId === module.id && EditModuleForm ? (
        <EditModuleForm moduleId={module.id} initialName={module.name} />
      ) : null}

      {/* Module header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            className={
              disabled
                ? 'cursor-not-allowed opacity-60'
                : 'cursor-grab active:cursor-grabbing touch-none'
            }
            // only attach drag attributes when not disabled
            {...(disabled ? {} : attributes)}
            {...(disabled ? {} : listeners)}
            aria-disabled={disabled}
            title={disabled ? 'Reordering disabled' : 'Drag to reorder'}
            type="button"
          >
            {disabled ? (
              <span className="inline-block w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" />
            ) : (
              <GripVertical className="h-5 w-5 text-gray-400" />
            )}
          </button>
          <h3 className="font-medium text-base">
            {module.name} ({module.lessonCount}{' '}
            {module.lessonCount === 1 ? 'lesson' : 'lessons'})
          </h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditModule?.(module.id)}
            disabled={disabled}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddAssignment?.(module.id)}
            disabled={disabled}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Assignment
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddLesson?.(module.id)}
            disabled={disabled}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Lesson
          </Button>
        </div>
      </div>

      {/* Lessons dnd context */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleLessonDragEnd}
      >
        <SortableContext
          items={lessonsList.map((l) => String(l.id))}
          strategy={verticalListSortingStrategy}
        >
          {/* Lessons table */}
          {lessonsList && lessonsList.length > 0 && (
            <div className="bg-white rounded-md border overflow-hidden mb-4">
              {lessonsList.map((lesson) => (
                <LessonRow
                  key={lesson.id}
                  lesson={lesson}
                  // wrap the callback so we also pass the parent module id
                  onEdit={(lessonId) => onEditLesson?.(lessonId, module.id)}
                  onView={onViewLesson}
                  onDelete={onDeleteLesson}
                  disabled={disabled || lessonsPending}
                />
              ))}
            </div>
          )}
        </SortableContext>
      </DndContext>

      {/* Assignments table */}
      {assignmentsList && assignmentsList.length > 0 && (
        <div className="bg-white rounded-md border overflow-hidden">
          {assignmentsList.map((assignment) => (
            <AssignmentRow
              key={assignment.id}
              assignment={assignment}
              onEdit={onEditAssignment}
              onView={onViewAssignment}
              onDelete={onDeleteAssignment}
            />
          ))}
        </div>
      )}
    </div>
  );
};
