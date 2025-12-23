import { type ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/data-table/column-header';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ForumPostsDataTableRowActions } from '@/features/forum/components/forum-posts-data-table-row-actions';
import { formatDate } from '@/utils';

import { forumPostStatusLabels } from '../utils';

import type { ForumPost, ForumPostStatus } from '@/features/forum/types';

export const forumpostsColumns: ColumnDef<ForumPost>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tiêu đề" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2 max-w-sm">
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {row.getValue('title') || 'N/A'}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'userName',
    header: () => <span>Người dùng</span>,
    cell: ({ row }) => {
      const userName = row.getValue('userName') as string;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="max-w-[200px] truncate text-sm cursor-help">
                {userName || 'N/A'}
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[300px]">
              <p className="text-xs">{userName || 'No description'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },

  {
    accessorKey: 'status',
    header: () => <span>Trạng thái</span>,
    cell: ({ row }) => {
      const status = row.getValue('status') as ForumPostStatus;

      return (
        <Badge
          variant={status === 'ACTIVE' ? 'default' : 'secondary'}
          className={
            status === 'ACTIVE'
              ? 'bg-green-100 text-green-700 hover:bg-green-100'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
          }
        >
          {forumPostStatusLabels[status]}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày tạo" />
    ),
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as string;
      if (!date) return <div className="text-gray-400">N/A</div>;

      return (
        <div className="text-sm text-gray-600">
          {formatDate(new Date(date), 'DD/MM/YYYY HH:mm')}
        </div>
      );
    },
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cập nhật" />
    ),
    cell: ({ row }) => {
      const date = row.getValue('updatedAt') as string;
      if (!date) return <div className="text-gray-400">N/A</div>;

      return (
        <div className="text-sm text-gray-600">
          {formatDate(new Date(date), 'DD/MM/YYYY HH:mm')}
        </div>
      );
    },
  },
  {
    accessorKey: 'upVoteCount',
    header: () => <span>Lượt thích</span>,
    cell: ({ row }) => {
      const upVoteCount = row.getValue('upVoteCount') as number;
      return <div className="text-sm text-gray-600">{upVoteCount}</div>;
    },
  },
  {
    accessorKey: 'downVoteCount',
    header: () => <span>Lượt không thích</span>,
    cell: ({ row }) => {
      const downVoteCount = row.getValue('downVoteCount') as number;
      return <div className="text-sm text-gray-600">{downVoteCount}</div>;
    },
  },
  {
    accessorKey: 'replyCount',
    header: () => <span>Bình luận</span>,
    cell: ({ row }) => {
      const replyCount = row.getValue('replyCount') as number;
      return <div className="text-sm text-gray-600">{replyCount}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <ForumPostsDataTableRowActions row={row} />,
  },
];
