import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

import { DataTableColumnHeader } from '@/components/data-table/column-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getReviewStatusBadge } from '@/features/journal-review/utils/status';

import { ExpertJournalReviewsDataTableRowActions } from './expert-journal-reviews-data-table-row-actions';

import type { ReviewStatus, RootReviewWithTimestamp } from '../types';

export const expertJournalReviewsColumns: ColumnDef<RootReviewWithTimestamp>[] =
  [
    {
      accessorKey: 'problemTitle',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tiêu đề vấn đề" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {row.getValue('problemTitle') || 'N/A'}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'creatorFullName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Người yêu cầu" />
      ),
      cell: ({ row }) => {
        const avatarUrl = row.original.creatorAvatarUrl;
        const fullName = row.getValue('creatorFullName') as string;
        const initials = fullName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);

        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatarUrl || undefined} alt={fullName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="max-w-32 truncate sm:max-w-72">{fullName}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'content',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nội dung yêu cầu" />
      ),
      cell: ({ row }) => {
        const content = row.getValue('content') as string;
        return (
          <div className="max-w-md">
            <span className="line-clamp-2 text-sm">{content}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Trạng thái" />
      ),
      cell: ({ row }) => {
        const status = row.getValue('status') as ReviewStatus;

        return getReviewStatusBadge(status);
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: 'averageRating',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Đánh giá TB" />
      ),
      cell: ({ row }) => {
        const rating = row.getValue('averageRating') as number | null;

        if (rating === null || rating === undefined) {
          return <div className="text-gray-400">Chưa có</div>;
        }

        return (
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">/5</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ngày tạo" />
      ),
      cell: ({ row }) => {
        const date = row.getValue('createdAt') as string;
        return (
          <div className="text-sm">
            {format(new Date(date), 'dd/MM/yyyy HH:mm')}
          </div>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return <ExpertJournalReviewsDataTableRowActions row={row} />;
      },
    },
  ];
