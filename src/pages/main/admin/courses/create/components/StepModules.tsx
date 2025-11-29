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
import { Plus, ChevronRight, ChevronLeft } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDeleteAssignmentMutation } from '@/features/assignment/services/mutations';
import { useReorderModuleMutation } from '@/features/courses/services/mutations';
import { useGetCourseByIdQuery } from '@/features/courses/services/queries';
import { useDeleteLessonMutation } from '@/features/lesson/services/mutations';
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
};

const StepModules: React.FC<Props> = ({ goNext, goBack }) => {
  const queryClient = useQueryClient();
  const courseFromLocalStorage = localStorage.getItem('createCourseDraft_v1');
  const courseId = courseFromLocalStorage
    ? JSON.parse(courseFromLocalStorage).id
    : null;
  const parseCourse = courseFromLocalStorage
    ? JSON.parse(courseFromLocalStorage).payload
    : null;

  const { data: modulesQuery } = useGetModulesByCourseQuery(courseId ?? '');
  const { data: courseDetail } = useGetCourseByIdQuery(courseId ?? '');

  // Sort modules based on courseDetail.orders
  const modules = React.useMemo(() => {
    const rawModules = modulesQuery?.content ?? [];
    const orders = courseDetail?.orders ?? [];

    if (orders.length === 0) return rawModules;

    // Create a map of moduleId to order index
    const orderMap = new Map(
      orders.map((order, index) => [order.moduleId, index]),
    );

    // Sort modules based on the order map
    return [...rawModules].sort((a, b) => {
      const orderA = orderMap.get(a.id) ?? Number.MAX_SAFE_INTEGER;
      const orderB = orderMap.get(b.id) ?? Number.MAX_SAFE_INTEGER;
      return orderA - orderB;
    });
  }, [modulesQuery?.content, courseDetail?.orders]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [editingAssignmentId, setEditingAssignmentId] = useState<string | null>(
    null,
  );
  const [selectedModuleIdForLesson, setSelectedModuleIdForLesson] = useState<
    string | null
  >(null);
  // track lesson being edited (if any)
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isAssignmentViewMode, setIsAssignmentViewMode] = useState(false);
  const [deletingLessonId, setDeletingLessonId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingAssignmentId, setDeletingAssignmentId] = useState<
    string | null
  >(null);
  const [deletingAssignmentModuleId, setDeletingAssignmentModuleId] = useState<
    string | null
  >(null);
  const [isDeleteAssignmentDialogOpen, setIsDeleteAssignmentDialogOpen] =
    useState(false);

  const reorderModuleMutation = useReorderModuleMutation(courseId ?? '');
  const deleteLessonMutation = useDeleteLessonMutation(deletingLessonId ?? '');
  const deleteAssignmentMutation = useDeleteAssignmentMutation(
    deletingAssignmentModuleId ?? '',
  );

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
            toast.success('Cập nhật thứ tự chương thành công');
          },
          onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
          },
        },
      );
    }
  };
  // use isLoading for mutation and isFetching for query
  const isPending = reorderModuleMutation.isPending;

  const CreateModuleForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    // keep local disable aware of global pending
    const isCreateDisabled = isPending;
    const createModule = useCreateModuleMutation(courseId ?? '');
    const [name, setName] = useState('');
    const [duration, setDuration] = useState<number | undefined>(undefined);
    // start empty so placeholder is shown until user picks a level
    const [level, setLevel] = useState<'EASY' | 'MEDIUM' | 'HARD' | ''>('');

    const handleCreate = () => {
      if (!courseId) {
        toast.error('Please save the course before adding modules.');
        return;
      }
      if (!name.trim()) {
        toast.error('Tên chương là bắt buộc');
        return;
      }

      if (duration === undefined || duration <= 0) {
        toast.error('Thời lượng phải lớn hơn 0');
        return;
      }
      if (!level) {
        toast.error('Độ khó là bắt buộc');
        return;
      }

      createModule.mutate(
        { name: name.trim(), durationInMinutes: duration, level },
        {
          onSuccess: () => {
            toast.success('Tạo chương thành công');
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
            placeholder="Nhập tên chương"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isCreateDisabled}
          />
          <input
            type="number"
            min={1}
            className="border p-2 rounded "
            placeholder="Nhập thời lượng (phút)"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            disabled={isCreateDisabled}
          />

          <Select
            onValueChange={(value) =>
              setLevel(value as 'EASY' | 'MEDIUM' | 'HARD')
            }
            disabled={isCreateDisabled}
            // pass undefined when empty so SelectValue shows the placeholder
            value={level === '' ? undefined : level}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn độ khó" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="EASY">Dễ</SelectItem>
                <SelectItem value="MEDIUM">Trung Bình</SelectItem>
                <SelectItem value="HARD">Khó</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button onClick={handleCreate} disabled={isCreateDisabled}>
              Tạo
            </Button>
            <Button
              variant="destructive"
              onClick={onClose}
              disabled={isCreateDisabled}
            >
              Hủy
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const EditModuleForm: React.FC<{
    moduleId: string;
    initialName?: string;
    durationInMinutes: number;
    level: 'EASY' | 'MEDIUM' | 'HARD';
  }> = ({ moduleId, initialName, durationInMinutes, level }) => {
    const updateModule = useUpdateModuleMutation(moduleId);
    const [name, setName] = useState(initialName ?? '');
    const [duration, setDuration] = useState<number>(durationInMinutes);
    const [levelModule, setLevelModule] = useState<'EASY' | 'MEDIUM' | 'HARD'>(
      level,
    );

    const handleUpdate = () => {
      if (!name.trim()) {
        toast.error('Tên chương là bắt buộc');
        return;
      }
      if (duration <= 0) {
        toast.error('Thời lượng phải lớn hơn 0');
        return;
      }
      if (!levelModule) {
        toast.error('Độ khó là bắt buộc');
        return;
      }
      updateModule.mutate(
        {
          id: moduleId,
          name: name.trim(),
          durationInMinutes: duration,
          level: levelModule,
        },
        {
          onSuccess: () => {
            toast.success('Cập nhật chương thành công');
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

          <Select
            onValueChange={(value) =>
              setLevelModule(value as 'EASY' | 'MEDIUM' | 'HARD')
            }
            value={levelModule}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn độ khó" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="EASY">Dễ</SelectItem>
                <SelectItem value="MEDIUM">Trung Bình</SelectItem>
                <SelectItem value="HARD">Khó</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button onClick={handleUpdate}>Lưu</Button>
            <Button
              variant="destructive"
              onClick={() => setEditingModuleId(null)}
            >
              Hủy
            </Button>
          </div>
        </div>
      </div>
    );
  };
  const handleDeleteLesson = (lessonId: string) => {
    setDeletingLessonId(lessonId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteLesson = () => {
    if (!deletingLessonId) return;

    deleteLessonMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('Xóa bài học thành công');
        setIsDeleteDialogOpen(false);
        setDeletingLessonId(null);
      },
      onError: (err: unknown) => {
        let msg = 'Không thể xóa bài học';
        if (err instanceof Error) msg = err.message;
        else if (typeof err === 'string') msg = err;
        toast.error(msg);
      },
    });
  };

  const handleDeleteAssignment = (assignmentId: string, moduleId: string) => {
    setDeletingAssignmentId(assignmentId);
    setDeletingAssignmentModuleId(moduleId);
    setIsDeleteAssignmentDialogOpen(true);
  };

  const confirmDeleteAssignment = () => {
    if (!deletingAssignmentId) return;

    deleteAssignmentMutation.mutate(deletingAssignmentId, {
      onSuccess: () => {
        toast.success('Xóa bài tập thành công');
        setIsDeleteAssignmentDialogOpen(false);
        setDeletingAssignmentId(null);
        setDeletingAssignmentModuleId(null);
      },
      onError: (err: unknown) => {
        let msg = 'Không thể xóa bài tập';
        if (err instanceof Error) msg = err.message;
        else if (typeof err === 'string') msg = err;
        toast.error(msg);
      },
    });
  };

  return (
    <div className="rounded-md border">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-blue-600 rounded" />
          <h2 className="text-xl font-semibold flex items-center gap-2">
            Quản lý Chương Học : {parseCourse?.title}
            {isPending && (
              <span className="inline-block w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" />
            )}
            <br />
          </h2>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCreateForm((v) => !v)}
          disabled={isPending || courseId === null}
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
          <div className={`${modules.length > 0 ? 'p-6 space-y-6' : ''}`}>
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
                  setEditingAssignmentId(null);
                  setIsAssignmentViewMode(false);
                  setIsAssignmentModalOpen(true);
                }}
                onAddLesson={(moduleId) => {
                  setSelectedModuleIdForLesson(moduleId);
                  setIsViewMode(false);
                  setIsLessonModalOpen(true);
                }}
                onEditLesson={(lessonId, moduleId) => {
                  setSelectedModuleIdForLesson(moduleId);
                  setEditingLessonId(lessonId);
                  setIsViewMode(false);
                  setIsLessonModalOpen(true);
                }}
                onViewLesson={(lessonId, moduleId) => {
                  setSelectedModuleIdForLesson(moduleId);
                  setEditingLessonId(lessonId);
                  setIsViewMode(true);
                  setIsLessonModalOpen(true);
                }}
                onDeleteLesson={handleDeleteLesson}
                onEditAssignment={(assignmentId, moduleId) => {
                  setSelectedModuleId(moduleId);
                  setEditingAssignmentId(assignmentId);
                  setIsAssignmentViewMode(false);
                  setIsAssignmentModalOpen(true);
                }}
                onViewAssignment={(assignmentId, moduleId) => {
                  setSelectedModuleId(moduleId);
                  setEditingAssignmentId(assignmentId);
                  setIsAssignmentViewMode(true);
                  setIsAssignmentModalOpen(true);
                }}
                onDeleteAssignment={handleDeleteAssignment}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Add Assignment Modal */}
      {selectedModuleId && (
        <AddAssignmentModal
          open={isAssignmentModalOpen}
          onOpenChange={(open) => {
            setIsAssignmentModalOpen(open);
            if (!open) {
              setEditingAssignmentId(null);
              setSelectedModuleId(null);
              setIsAssignmentViewMode(false);
            }
          }}
          moduleId={selectedModuleId}
          assignmentId={editingAssignmentId ?? undefined}
          viewMode={isAssignmentViewMode}
        />
      )}

      {/* Add Lesson Modal */}
      {selectedModuleIdForLesson && (
        <AddLessonModal
          open={isLessonModalOpen}
          onOpenChange={(open) => {
            setIsLessonModalOpen(open);
            if (!open) {
              setEditingLessonId(null);
              setSelectedModuleIdForLesson(null);
              setIsViewMode(false);
            }
          }}
          moduleId={selectedModuleIdForLesson}
          lessonId={editingLessonId ?? undefined}
          viewMode={isViewMode}
        />
      )}

      {/* Delete Lesson Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa bài học</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bài học này không? Hành động này không
              thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setDeletingLessonId(null);
              }}
              disabled={deleteLessonMutation.isPending}
            >
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteLesson}
              disabled={deleteLessonMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteLessonMutation.isPending ? 'Đang xóa...' : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Assignment Confirmation Dialog */}
      <AlertDialog
        open={isDeleteAssignmentDialogOpen}
        onOpenChange={setIsDeleteAssignmentDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa bài tập</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bài tập này không? Hành động này không
              thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsDeleteAssignmentDialogOpen(false);
                setDeletingAssignmentId(null);
                setDeletingAssignmentModuleId(null);
              }}
              disabled={deleteAssignmentMutation.isPending}
            >
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteAssignment}
              disabled={deleteAssignmentMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteAssignmentMutation.isPending ? 'Đang xóa...' : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Footer divider and actions */}
      <div className="border-t">
        <div className="flex items-center justify-between p-6">
          <Button variant="outline" onClick={goBack} disabled={isPending}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Quay Lại
          </Button>
          <Button onClick={goNext} disabled={isPending}>
            Tiếp Theo
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepModules;
