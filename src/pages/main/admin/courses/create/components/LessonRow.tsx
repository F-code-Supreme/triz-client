import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Paperclip, Eye, Pencil, Trash2 } from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import type { Lesson } from '@/features/lesson/types';

type LessonRowProps = {
  lesson: Lesson;
  onEdit?: (lessonId: string) => void;
  onView?: (lessonId: string) => void;
  onDelete?: (lessonId: string) => void;
  disabled?: boolean;
};

export const LessonRow: React.FC<LessonRowProps> = ({
  lesson,
  onEdit,
  onView,
  onDelete,
  disabled = false,
}) => {
  // ensure sortable id is string so it matches SortableContext items
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: String(lesson.id), disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center border-b last:border-b-0 hover:bg-gray-50"
    >
      {/* Drag handle */}
      <div className="flex items-center justify-center w-[72px] h-14 border-r">
        <button
          className={
            disabled
              ? 'cursor-not-allowed opacity-60'
              : 'cursor-grab active:cursor-grabbing touch-none'
          }
          {...(disabled ? {} : attributes)}
          {...(disabled ? {} : listeners)}
          aria-disabled={disabled}
          type="button"
          title={disabled ? 'Reordering disabled' : 'Drag to reorder'}
        >
          {disabled ? (
            <span className="inline-block w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" />
          ) : (
            <GripVertical className="h-4 w-4 text-gray-400" />
          )}
        </button>
      </div>

      {/* Lesson number */}
      <div className="flex items-center w-[200px] h-14 px-4 border-r">
        <span className="text-blue-600 font-medium text-sm">
          Nội dung bài học: {lesson.type}
        </span>
      </div>

      {/* Lesson title */}
      <div className="flex items-center flex-1 h-14 px-4 gap-2 border-r">
        <Paperclip className="h-4 w-4 text-gray-400" />
        <span className="text-sm">{lesson.title}</span>
      </div>

      {/* Status badge */}
      <div className="flex items-center justify-center w-[157px] h-14 border-r">
        <Badge
          variant={lesson.status === 'ACTIVE' ? 'default' : 'secondary'}
          className={
            lesson.status === 'ACTIVE'
              ? 'bg-green-100 text-green-700 hover:bg-green-100'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
          }
        >
          {lesson.status === 'ACTIVE' ? 'Công khai' : 'Chưa công khai'}
        </Badge>
      </div>

      {/* Action buttons */}
      <div className="flex items-center h-14">
        <Button
          variant="ghost"
          size="icon"
          className="h-14 w-14 rounded-none border-r hover:bg-gray-100"
          onClick={() => onEdit?.(String(lesson.id))}
          disabled={disabled}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-14 w-14 rounded-none border-r hover:bg-gray-100"
          onClick={() => onView?.(String(lesson.id))}
          disabled={disabled}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-14 w-14 rounded-none hover:bg-gray-100 hover:text-red-600"
          onClick={() => onDelete?.(String(lesson.id))}
          disabled={disabled}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
