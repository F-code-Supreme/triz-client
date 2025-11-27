import { GripVertical, Paperclip, Eye, Pencil, Trash2 } from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import type { Assignment } from '@/features/assignment/services/queries/types';

type AssignmentRowProps = {
  assignment: Assignment;
  moduleId: string;
  onEdit?: (assignmentId: string, moduleId: string) => void;
  onView?: (assignmentId: string, moduleId: string) => void;
  onDelete?: (assignmentId: string) => void;
};

export const AssignmentRow: React.FC<AssignmentRowProps> = ({
  assignment,
  moduleId,
  onEdit,
  onView,
  onDelete,
}) => {
  return (
    <div className="flex items-center border-b last:border-b-0 hover:bg-gray-50">
      {/* Drag handle */}
      <div className="flex items-center justify-center w-[72px] h-14 border-r">
        <GripVertical className="h-4 w-4 text-gray-400" />
      </div>

      {/* Assignment number */}
      <div className="flex items-center w-[200px] h-14 px-4 border-r">
        <span className="text-blue-600 font-medium text-sm">
          Tiêu đề: {assignment.title}
        </span>
      </div>

      {/* Assignment title */}
      <div className="flex items-center flex-1 h-14 px-4 gap-2 border-r">
        <Paperclip className="h-4 w-4 text-gray-400" />
        <span className="text-sm">{assignment.title}</span>
      </div>

      {/* Status badge */}
      <div className="flex items-center justify-center w-[157px] h-14 border-r">
        <Badge
          variant={assignment.status === 'ACTIVE' ? 'default' : 'secondary'}
          className={
            assignment.status === 'ACTIVE'
              ? 'bg-green-100 text-green-700 hover:bg-green-100'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
          }
        >
          {assignment.status === 'ACTIVE' ? 'Published' : 'Unpublish'}
        </Badge>
      </div>

      {/* Action buttons */}
      <div className="flex items-center h-14">
        <Button
          variant="ghost"
          size="icon"
          className="h-14 w-14 rounded-none border-r hover:bg-gray-100"
          onClick={() => onEdit?.(String(assignment.id), moduleId)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-14 w-14 rounded-none border-r hover:bg-gray-100"
          onClick={() => onView?.(String(assignment.id), moduleId)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-14 w-14 rounded-none hover:bg-gray-100 hover:text-red-600"
          onClick={() => onDelete?.(String(assignment.id))}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
