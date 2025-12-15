import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { type Row } from '@tanstack/react-table';
import { Eye, MessageSquare } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IdeaAssessmentReviewDialog } from '@/features/6-steps/components/idea-assessment-review-dialog';

import type { IdeaAssessmentRequest } from '@/features/6-steps/services/queries/types';

interface IdeaAssessmentDataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export const IdeaAssessmentDataTableRowActions = <TData,>({
  row,
}: IdeaAssessmentDataTableRowActionsProps<TData>) => {
  const request = row.original as IdeaAssessmentRequest;
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  const handleReview = () => {
    setIsReviewDialogOpen(true);
  };

  const handleViewJournal = () => {
    // Navigate to journal detail
    window.open(`/journals/${request.journalId}`, '_blank');
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
        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuItem onClick={handleReview}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Đánh giá ý tưởng
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleViewJournal}>
            <Eye className="mr-2 h-4 w-4" />
            Xem nhật ký
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <IdeaAssessmentReviewDialog
        open={isReviewDialogOpen}
        onOpenChange={setIsReviewDialogOpen}
        request={request}
      />
    </>
  );
};
