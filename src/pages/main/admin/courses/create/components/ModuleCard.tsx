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
import { ChevronDown, GripVertical, Pencil, Plus } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useReorderAssignmentMutation } from '@/features/assignment/services/mutations';
import { useGetAssignmentsByModuleQuery } from '@/features/assignment/services/queries';
import { AssignmentKeys } from '@/features/assignment/services/queries/keys';
import { useReorderLessonMutation } from '@/features/lesson/services/mutations';
import { useGetLessonsByModuleQuery } from '@/features/lesson/services/queries';
import { LessonKeys } from '@/features/lesson/services/queries/keys';

import { AssignmentRow } from './AssignmentRow';
import { LessonRow } from './LessonRow';

import type { Assignment } from '@/features/assignment/services/queries/types';
import type { Lesson } from '@/features/lesson/types';
import type { Module } from '@/features/modules/types';

type ModuleCardProps = {
  module: Module;
  disabled?: boolean;
  onEditModule?: (moduleId: string) => void;
  onAddAssignment?: (moduleId: string) => void;
  onAddLesson?: (moduleId: string) => void;
  onEditLesson?: (lessonId: string, moduleId: string) => void;
  onViewLesson?: (lessonId: string, moduleId: string) => void;
  onDeleteLesson?: (lessonId: string) => void;
  onEditAssignment?: (assignmentId: string, moduleId: string) => void;
  onViewAssignment?: (assignmentId: string, moduleId: string) => void;
  onDeleteAssignment?: (assignmentId: string, moduleId: string) => void;
  editingModuleId?: string | null;
  EditModuleForm?: React.ComponentType<{
    moduleId: string;
    initialName?: string;
    durationInMinutes: number;
    level: 'EASY' | 'MEDIUM' | 'HARD';
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
  const { data: lessonsQuery } = useGetLessonsByModuleQuery(module.id);
  const lessons = lessonsQuery?.content;
  const { data: assignments } = useGetAssignmentsByModuleQuery(module.id);

  // Sort lessons based on module.orders
  const sortedLessons = React.useMemo(() => {
    const rawLessons = Array.isArray(lessons) ? lessons : (lessons ?? []);
    const orders = module.orders ?? [];

    if (orders.length === 0) return rawLessons;

    // Create a map of lessonId to order index (only for 'lesson' type)
    const orderMap = new Map(
      orders
        .filter((order) => order.type === 'lesson')
        .map((order, index) => [order.subsetId, index]),
    );

    // Sort lessons based on the order map
    return [...rawLessons].sort((a, b) => {
      const orderA = orderMap.get(a.id) ?? Number.MAX_SAFE_INTEGER;
      const orderB = orderMap.get(b.id) ?? Number.MAX_SAFE_INTEGER;
      return orderA - orderB;
    });
  }, [lessons, module.orders]);

  // Sort assignments based on module.orders
  const sortedAssignments = React.useMemo(() => {
    const rawAssignments = assignments ? assignments.content : [];
    const orders = module.orders ?? [];

    if (orders.length === 0) return rawAssignments;

    // Create a map of assignmentId to order index (only for 'assignment' type)
    const orderMap = new Map(
      orders
        .filter((order) => order.type === 'assignment')
        .map((order, index) => [order.subsetId, index]),
    );

    // Sort assignments based on the order map
    return [...rawAssignments].sort((a, b) => {
      const orderA = orderMap.get(a.id) ?? Number.MAX_SAFE_INTEGER;
      const orderB = orderMap.get(b.id) ?? Number.MAX_SAFE_INTEGER;
      return orderA - orderB;
    });
  }, [assignments, module.orders]);

  // setup DnD sensors for lessons (local to module)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const queryClient = useQueryClient();
  const reorderLessonMutation = useReorderLessonMutation(module.id);
  const reorderAssignmentMutation = useReorderAssignmentMutation(module.id);
  const lessonsList = sortedLessons;
  const assignmentsList = sortedAssignments;

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
          let msg = 'Săp xếp lại thứ tự bài học thất bại';
          if (err instanceof Error) msg = err.message;
          else if (typeof err === 'string') msg = err;
          toast.error(msg);
        },
        onSuccess: () => {
          toast.success('Cập nhật thứ tự bài học thành công');
        },
      },
    );
  };
  const lessonsPending = reorderLessonMutation.isPending;

  const handleAssignmentDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) return;
    if (reorderAssignmentMutation.isPending) return;

    const oldIndex = assignmentsList.findIndex(
      (a) => String(a.id) === activeId,
    );
    const newIndex = assignmentsList.findIndex((a) => String(a.id) === overId);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(assignmentsList, oldIndex, newIndex);
    const assignmentQueryKey = [
      AssignmentKeys.GetAssignmentsByModuleQuery,
      module.id,
    ];

    // snapshot previous cache
    const previous = queryClient.getQueryData(assignmentQueryKey);

    // optimistic update: preserve original shape
    queryClient.setQueryData(assignmentQueryKey, (oldData: Assignment) => {
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
    reorderAssignmentMutation.mutate(
      reordered.map((a) => String(a.id)),
      {
        onError: (err: unknown) => {
          // revert to previous snapshot
          if (previous !== undefined) {
            queryClient.setQueryData(assignmentQueryKey, previous);
          } else {
            queryClient.invalidateQueries({ queryKey: assignmentQueryKey });
          }
          let msg = 'Sắp xếp lại thứ tự bài tập thất bại';
          if (err instanceof Error) msg = err.message;
          else if (typeof err === 'string') msg = err;
          toast.error(msg);
        },
        onSuccess: () => {
          toast.success('Cập nhật thứ tự bài tập thành công');
        },
      },
    );
  };
  const assignmentsPending = reorderAssignmentMutation.isPending;

  const renderEditForm = () =>
    editingModuleId === module.id && EditModuleForm ? (
      <EditModuleForm
        moduleId={module.id}
        initialName={module.name}
        durationInMinutes={module.durationInMinutes}
        level={module.level}
      />
    ) : null;

  const renderHeader = () => {
    if (editingModuleId && editingModuleId === module.id) return null;
    return (
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
            {module.name} - Thời lượng: {module.durationInMinutes} phút - Mức
            độ: {module.level} ({module.lessonCount} bài học,{' '}
            {module.assignmentCount} bài tập)
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
            Chỉnh sửa
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" aria-label="Open menu" size="sm">
                + Thêm <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onAddAssignment?.(module.id)}
                    disabled={disabled}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm bài tập
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onAddLesson?.(module.id)}
                    disabled={disabled}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm bài học
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  };

  const renderLessonsDnd = () => (
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
          <div className="bg-white rounded-md border overflow-hidden my-4">
            {lessonsList.map((lesson) => (
              <LessonRow
                key={lesson.id}
                lesson={lesson}
                onEdit={(lessonId) => onEditLesson?.(lessonId, module.id)}
                onView={(lessonId) => onViewLesson?.(lessonId, module.id)}
                onDelete={(lessonId) => onDeleteLesson?.(lessonId)}
                disabled={disabled || lessonsPending}
              />
            ))}
          </div>
        )}
      </SortableContext>
    </DndContext>
  );

  const renderAssignments = () =>
    assignmentsList && assignmentsList.length > 0 ? (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleAssignmentDragEnd}
      >
        <SortableContext
          items={assignmentsList.map((a) => String(a.id))}
          strategy={verticalListSortingStrategy}
        >
          <div className="bg-white rounded-md border overflow-hidden">
            {assignmentsList.map((assignment) => (
              <AssignmentRow
                key={assignment.id}
                assignment={assignment}
                moduleId={module.id}
                onEdit={onEditAssignment}
                onView={onViewAssignment}
                onDelete={(assignmentId) =>
                  onDeleteAssignment?.(assignmentId, module.id)
                }
                disabled={disabled || assignmentsPending}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    ) : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border rounded-lg bg-gray-50 p-4"
    >
      {renderEditForm()}
      {/* Module header */}
      {renderHeader()}
      {/* Lessons dnd context */}
      {renderLessonsDnd()}
      {/* Assignments table */}
      {renderAssignments()}
    </div>
  );
};
