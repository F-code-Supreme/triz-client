import { type ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/data-table/column-header';
import { Badge } from '@/components/ui/badge';
import { AssignmentsDataTableRowActions } from '@/features/assignment/components/assignments-data-table-row-actions';
import { formatDateHour } from '@/utils';

import {
  assignmentSubmissionStatusLabels,
  getAssignmentSubmissionStatusColors,
} from '../utils';

import type { AssignmentSubmissionStatus } from '../types';
import type { AssignmentSubmissionExpertReview } from '@/features/assignment/services/queries/types';

export const assignmentsColumns: ColumnDef<AssignmentSubmissionExpertReview>[] =
  [
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tiêu đề" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {row.getValue('title') || 'N/A'}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'userFullName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tác giả" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {row.getValue('userFullName')}
            </span>
          </div>
        );
      },
    },

    {
      accessorKey: 'attemptNumber',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Số lần làm" />
      ),
      cell: ({ row }) => {
        const maxAttempts = row.getValue('attemptNumber') as number;
        return <div className="text-center">{maxAttempts}</div>;
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Trạng thái" />
      ),
      cell: ({ row }) => {
        const status = row.getValue('status') as AssignmentSubmissionStatus;

        return (
          <Badge
            variant={status === 'EXPERT_PENDING' ? 'default' : 'secondary'}
            className={getAssignmentSubmissionStatusColors(status)}
          >
            {assignmentSubmissionStatusLabels[status]}
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
            {formatDateHour(new Date(date))}
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
            {formatDateHour(new Date(date))}
          </div>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return <AssignmentsDataTableRowActions row={row} />;
      },
    },
  ];
