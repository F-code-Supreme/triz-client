import { GripVertical, Pencil, Plus } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';

import { AssignmentRow } from './AssignmentRow';
import { LessonRow } from './LessonRow';

type ModuleCardProps = {
  module: {
    id: string;
    title: string;
    lessons: Array<{
      id: string;
      number: number;
      title: string;
      published: boolean;
    }>;
    assignments: Array<{
      id: string;
      number: number;
      title: string;
      published: boolean;
    }>;
  };
  onEditModule?: (moduleId: string) => void;
  onAddAssignment?: (moduleId: string) => void;
  onAddLesson?: (moduleId: string) => void;
  onEditLesson?: (lessonId: string) => void;
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
}) => {
  return (
    <div className="border rounded-lg bg-gray-50 p-4">
      {editingModuleId === module.id && EditModuleForm ? (
        <EditModuleForm moduleId={module.id} initialName={module.title} />
      ) : null}

      {/* Module header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <GripVertical className="h-5 w-5 text-gray-400" />
          <h3 className="font-medium text-base">
            {module.title} ({module.lessons.length}{' '}
            {module.lessons.length === 1 ? 'lesson' : 'lessons'})
          </h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditModule?.(module.id)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddAssignment?.(module.id)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Assignment
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddLesson?.(module.id)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Lesson
          </Button>
        </div>
      </div>

      {/* Lessons table */}
      {module.lessons.length > 0 && (
        <div className="bg-white rounded-md border overflow-hidden mb-4">
          {module.lessons.map((lesson) => (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              onEdit={onEditLesson}
              onView={onViewLesson}
              onDelete={onDeleteLesson}
            />
          ))}
        </div>
      )}

      {/* Assignments table */}
      {module.assignments.length > 0 && (
        <div className="bg-white rounded-md border overflow-hidden">
          {module.assignments.map((assignment) => (
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
