import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { type Row } from '@tanstack/react-table';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteAssignmentMutation } from '@/features/assignment/services/mutations';

import type { Assignment } from '@/features/assignment/services/queries/types';

interface AssignmentsDataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export const AssignmentsDataTableRowActions = <TData,>({
  row,
}: AssignmentsDataTableRowActionsProps<TData>) => {
  const assignment = row.original as Assignment;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Note: You'll need to pass moduleId somehow - could be from context or route params
  const deleteAssignment = useDeleteAssignmentMutation(''); // TODO: Add moduleId

  const handleDelete = () => {
    deleteAssignment.mutate(assignment.id, {
      onSuccess: () => {
        toast.success('Xóa bài tập thành công');
        setIsDeleteDialogOpen(false);
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : 'Không thể xóa bài tập',
        );
      },
    });
  };

  const handleView = () => {
    // TODO: Implement view functionality
    toast.info(`View assignment: ${assignment.title}`);
  };

  const handleEdit = () => {
    // TODO: Implement edit functionality
    toast.info(`Edit assignment: ${assignment.title}`);
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
          <DropdownMenuItem onClick={handleView}>
            <Eye className="mr-2 h-4 w-4" />
            Xem
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Xóa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa bài tập</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bài tập "{assignment.title}" không? Hành
              động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteAssignment.isPending}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteAssignment.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteAssignment.isPending ? 'Đang xóa...' : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
