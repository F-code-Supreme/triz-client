import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Paperclip, Eye, Pencil, Trash2 } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUpdateStatusLessonMutation } from '@/features/lesson/services/mutations';

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
  const updateStatusLessonMutation = useUpdateStatusLessonMutation(
    lesson.id || '',
  );
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  const handleStatusChange = (newStatus: 'ACTIVE' | 'INACTIVE') => {
    updateStatusLessonMutation.mutate(newStatus, {
      onSuccess: () => {
        toast.success('Cập nhật trạng thái thành công');
      },
      onError: (error) => {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Không thể cập nhật trạng thái. Vui lòng thử lại.',
        );
      },
    });
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
      <div className="flex items-center w-[200px] h-14 px-4 border-r ">
        <span className="text-blue-600 font-medium text-sm truncate">
          Nội dung: {lesson.type === 'VIDEO' ? 'Video' : 'Văn bản'}{' '}
        </span>
      </div>

      {/* Lesson title */}
      <div className="flex items-center flex-1 h-14 px-4 gap-2 border-r">
        <Paperclip className="h-4 w-4 text-gray-400" />
        <span className="text-sm">{lesson.title}</span>
      </div>

      {/* Status badge */}
      <div className="flex items-center justify-center w-[180px] h-14 border-r px-2">
        <Select
          value={lesson.status || 'INACTIVE'}
          onValueChange={handleStatusChange}
          disabled={disabled || updateStatusLessonMutation.isPending}
        >
          <SelectTrigger className="h-8 w-full">
            <SelectValue>
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
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">
              <Badge
                variant={'default'}
                className={'bg-green-100 text-green-700 hover:bg-green-100'}
              >
                Công khai
              </Badge>
            </SelectItem>
            <SelectItem value="INACTIVE">
              <Badge
                variant={'secondary'}
                className={'bg-gray-100 text-gray-700 hover:bg-gray-100'}
              >
                Không công khai
              </Badge>
            </SelectItem>
          </SelectContent>
        </Select>
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
