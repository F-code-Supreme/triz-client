import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { type Row } from '@tanstack/react-table';
import { BookDashed } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import AssignmentSubmissionsDialog from './assignment-submissions-dialog';

import type { Assignment } from '@/features/assignment/services/queries/types';

interface AssignmentsDataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export const AssignmentsDataTableRowActions = <TData,>({
  row,
}: AssignmentsDataTableRowActionsProps<TData>) => {
  const assignment = row.original as Assignment;
  const [_setIsDeleteDialogOpen] = useState(false);
  const [isSubmissionsDialogOpen, setIsSubmissionsDialogOpen] = useState(false);

  const handleDetailAssignment = () => {
    setIsSubmissionsDialogOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={handleDetailAssignment}>
            <BookDashed className="mr-2 h-4 w-4" />
            Chi tiết bài
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AssignmentSubmissionsDialog
        open={isSubmissionsDialogOpen}
        onOpenChange={setIsSubmissionsDialogOpen}
        assignmentId={assignment.id}
      />
    </>
  );
};
