import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useGetAssignmentsQuery } from '@/features/assignment/services/queries';
import { useGetLessonsQuery } from '@/features/lesson/services/queries';
import {
  useCreateModuleMutation,
  useUpdateModuleMutation,
} from '@/features/modules/services/mutations';
import { useGetModulesQuery } from '@/features/modules/services/queries';

import { AddAssignmentModal } from './AddAssignmentModal';
import { AddLessonModal } from './AddLessonModal';
import { ModuleCard } from './ModuleCard';

type Props = {
  goNext: () => void;
  goBack: () => void;
  courseId?: string | null;
};

const StepModules: React.FC<Props> = ({ goNext, goBack, courseId }) => {
  const { data: modulesData } = useGetModulesQuery();
  const { data: lessonsData } = useGetLessonsQuery();
  const { data: assignmentsData } = useGetAssignmentsQuery();
  const apiModules = modulesData?.content ?? [];
  const apiLessons = lessonsData?.content ?? [];
  const apiAssignments = assignmentsData?.content ?? [];

  const modules = apiModules.map((m) => {
    const moduleLessons = apiLessons.filter((l) => l.moduleId === m.id);
    const moduleAssignments = apiAssignments.filter((a) => a.moduleId === m.id);

    // Create a lookup that maps a combined key `${type}:${id}` -> order index
    const orderIndex = new Map<string, number>();
    (m.orders ?? []).forEach((o: { id: string; type: string }, idx: number) => {
      orderIndex.set(`${o.type}:${o.id}`, idx);
    });

    const getIndex = (type: string, id: string) =>
      orderIndex.has(`${type}:${id}`)
        ? (orderIndex.get(`${type}:${id}`) as number)
        : Number.MAX_SAFE_INTEGER;

    // Sort lessons/assignments by order if present; otherwise keep natural order.
    const orderedLessons = [...moduleLessons].sort(
      (a, b) => getIndex('lesson', a.id) - getIndex('lesson', b.id),
    );

    const orderedAssignments = [...moduleAssignments].sort(
      (a, b) => getIndex('assignment', a.id) - getIndex('assignment', b.id),
    );

    // Helper to access unknown API objects safely without `any`.
    const asRecord = (v: unknown) => v as Record<string, unknown>;

    // Map to the UI shape used below. Provide reasonable fallbacks for missing fields.
    const lessons = orderedLessons.map((l, idx) => {
      const r = asRecord(l);
      const title =
        (r.name as string) ?? (r.title as string) ?? 'Untitled lesson';
      const published = Boolean(r.materialUrl as string | undefined);
      return {
        id: (r.id as string) ?? `lesson-${idx}`,
        number: idx + 1,
        title,
        published,
      };
    });

    const assignments = orderedAssignments.map((a, idx) => {
      const r = asRecord(a);
      const title =
        (r.title as string) ?? (r.name as string) ?? 'Untitled assignment';
      const published = ((r.status as string) || '').toUpperCase() === 'ACTIVE';
      return {
        id: (r.id as string) ?? `assignment-${idx}`,
        number: idx + 1,
        title,
        published,
      };
    });

    const mRec = asRecord(m);
    return {
      id: m.id,
      title:
        (mRec.name as string) ?? (mRec.title as string) ?? 'Untitled module',
      lessons,
      assignments,
    };
  });

  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [editingModuleId, setEditingModuleId] = React.useState<string | null>(
    null,
  );
  const [selectedModuleId, setSelectedModuleId] = React.useState<string | null>(
    null,
  );
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] =
    React.useState(false);
  const [selectedModuleIdForLesson, setSelectedModuleIdForLesson] =
    React.useState<string | null>(null);
  const [isLessonModalOpen, setIsLessonModalOpen] = React.useState(false);

  const CreateModuleForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const createModule = useCreateModuleMutation(courseId ?? '');
    const [name, setName] = React.useState('');
    const [duration, setDuration] = React.useState<number>(60);
    const [level, setLevel] = React.useState<'EASY' | 'MEDIUM' | 'HARD'>(
      'EASY',
    );

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
      <div className="p-4 border rounded mb-4 bg-white">
        <div className="flex gap-2 mb-2">
          <input
            className="border p-2 rounded flex-1"
            placeholder="Module name"
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
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCreate}>Create</Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    );
  };

  const EditModuleForm: React.FC<{
    moduleId: string;
    initialName?: string;
  }> = ({ moduleId, initialName }) => {
    const updateModule = useUpdateModuleMutation(moduleId);
    const [name, setName] = React.useState(initialName ?? '');
    const [duration, setDuration] = React.useState<number>(60);
    const [level, setLevel] = React.useState<'EASY' | 'MEDIUM' | 'HARD'>(
      'EASY',
    );

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
      <div className="p-4 border rounded mb-4 bg-white">
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
        </div>
        <div className="flex gap-2">
          <Button onClick={handleUpdate}>Save</Button>
          <Button variant="ghost" onClick={() => setEditingModuleId(null)}>
            Cancel
          </Button>
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
          <h2 className="text-xl font-semibold">Modules</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCreateForm((v) => !v)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Module
        </Button>
      </div>

      {/* Modules list */}
      {showCreateForm && (
        <div className="p-6">
          <CreateModuleForm onClose={() => setShowCreateForm(false)} />
        </div>
      )}
      <div className="p-6 space-y-6">
        {modules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            editingModuleId={editingModuleId}
            EditModuleForm={EditModuleForm}
            onEditModule={setEditingModuleId}
            onAddAssignment={(moduleId) => {
              setSelectedModuleId(moduleId);
              setIsAssignmentModalOpen(true);
            }}
            onAddLesson={(moduleId) => {
              setSelectedModuleIdForLesson(moduleId);
              setIsLessonModalOpen(true);
            }}
            onEditLesson={(lessonId) => {
              // TODO: Implement edit lesson functionality
              toast.info(`Edit lesson ${lessonId}`);
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
          onOpenChange={setIsLessonModalOpen}
          moduleId={selectedModuleIdForLesson}
        />
      )}

      {/* Footer divider and actions */}
      <div className="border-t">
        <div className="flex items-center justify-between p-6">
          <Button variant="outline" onClick={goBack}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={goNext}>
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepModules;
