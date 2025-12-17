import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useNavigate } from '@tanstack/react-router';
import { type Row } from '@tanstack/react-table';
import { Eye, MessageSquare } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { RootReviewWithTimestamp } from '../types';

interface ExpertJournalReviewsDataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export const ExpertJournalReviewsDataTableRowActions = <TData,>({
  row,
}: ExpertJournalReviewsDataTableRowActionsProps<TData>) => {
  const review = row.original as RootReviewWithTimestamp;
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate({
      to: '/expert/journal-reviews/$journalReviewId',
      params: { journalReviewId: review.id },
    });
  };

  const handleViewProblem = () => {
    // Navigate to problem detail in a new tab
    window.open(`/6-steps/${review.problemId}`, '_blank');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Mở menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuItem onClick={handleViewDetails}>
          <MessageSquare className="mr-2 h-4 w-4" />
          Xem chi tiết
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleViewProblem}>
          <Eye className="mr-2 h-4 w-4" />
          Xem vấn đề 6 bước
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
